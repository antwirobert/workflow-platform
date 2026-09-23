import { Worker, Job } from "bullmq";
import { bullmqConnection } from "../../redis/client";

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
      console.log(`\n📧 [Email Worker] Sending invite to ${email}`);
      console.log(`   Org: ${orgName}`);
      console.log(`   Link: ${inviteLink}\n`);
    }
  },
  { connection: bullmqConnection },
);

worker.on("completed", (job) => {
  console.log(`✅ Email job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.error(`❌ Email job ${job?.id} failed:`, err.message);
});

export default worker;
