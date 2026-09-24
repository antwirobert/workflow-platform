import { Worker, Job } from "bullmq";
import { bullmqConnection } from "../../redis/client";
import { prisma } from "../../lib/prisma";
import logger from "../../logger";

const worker = new Worker(
  "cleanup",
  async (job: Job) => {
    if (job.name === "cleanup-expired-tokens") {
      const result = await prisma.refreshToken.deleteMany({
        where: { expiresAt: { lt: new Date() } },
      });
      logger.info("Cleaned up expired refresh tokens", { count: result.count });
    }

    if (job.name === "cleanup-expired-invitations") {
      const result = await prisma.invitation.updateMany({
        where: { expiresAt: { lt: new Date() }, status: "PENDING" },
        data: { status: "EXPIRED" },
      });

      logger.info("Marked invitations as expired", { count: result.count });
    }
  },
  { connection: bullmqConnection },
);

worker.on("completed", (job) => {
  logger.info("Cleanup job completed", { jobId: job.id });
});

worker.on("failed", (job, err) => {
  logger.error("Cleanup job failed", { jobId: job?.id, error: err.message });
});

export default worker;
