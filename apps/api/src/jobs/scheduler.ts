import { cleanupQueue } from "./queues";

export async function startScheduler() {
  await cleanupQueue.upsertJobScheduler(
    "cleanup-expired-tokens",
    { every: 60 * 60 * 1000 },
    { name: "cleanup-expired-tokens", data: {} },
  );

  await cleanupQueue.upsertJobScheduler(
    "cleanup-expired-invitations",
    { every: 60 * 60 * 1000 },
    { name: "cleanup-expired-invitations", data: {} },
  );

  console.log("⏰ Job scheduler started");
}
