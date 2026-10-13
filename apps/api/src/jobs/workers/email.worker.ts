import { Worker, Job } from "bullmq";
import { Resend } from "resend";
import { bullmqConnection } from "../../redis/client";
import logger from "../../logger";
import { config } from "../../config/env";

const resend = new Resend(config.resendApiKey);

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

      const { error } = await resend.emails.send({
        from: config.emailFrom,
        to: email,
        subject: `You've been invited to join ${orgName}`,
        html: `
          <h2>You've been invited to join ${orgName}</h2>
          <p>Click the link below to accept your invitation:</p>
          <a href="${inviteLink}">Accept Invitation</a>
          <p>This link expires in 7 days.</p>
        `,
      });

      if (error) {
        logger.error("Resend API error", { error, email, orgName });
        throw new Error(error.message);
      }

      logger.info("Invitation email sent", { email, orgName });
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
