import { Worker, Job } from "bullmq";
import { bullmqConnection } from "../../redis/client";
import logger from "../../logger";

interface InvitationEmailJob {
  email: string;
  inviteLink: string;
  orgName: string;
}

const worker = new Worker(
  "email",
  async (job: Job) => {
    if (job.name === "send-invitation-email") {
      const { email, inviteLink, orgName } = job.data as InvitationEmailJob;

      // Simulate sending email — swap for real email service later
      logger.info("Sending invitation email", { email, orgName, inviteLink });
    }
  },
  { connection: bullmqConnection },
);

worker.on("completed", (job) => {
  logger.info("Email job completed", { jobId: job.id });
});

worker.on("failed", (job, err) => {
  logger.error("Email job failed", { jobId: job?.id, error: err.message });
});

export default worker;
