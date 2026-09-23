import { Worker, Job } from "bullmq";
import { bullmqConnection } from "../../redis/client";
import { prisma } from "../../lib/prisma";

const worker = new Worker(
  "cleanup",
  async (job: Job) => {
    if (job.name === "cleanup-expired-tokens") {
      const result = await prisma.refreshToken.deleteMany({
        where: { expiresAt: { lt: new Date() } },
      });
      console.log(`🧹 Cleaned up ${result.count} expired refresh tokens`);
    }

    if (job.name === "cleanup-expired-invitations") {
      const result = await prisma.invitation.updateMany({
        where: { expiresAt: { lt: new Date() }, status: "PENDING" },
        data: { status: "EXPIRED" },
      });
      console.log(`🧹 Marked ${result.count} invitations as expired`);
    }
  },
  { connection: bullmqConnection },
);

worker.on("completed", (job) => {
  console.log(`✅ Cleanup job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.error(`❌ Cleanup job ${job?.id} failed:`, err.message);
});

export default worker;
