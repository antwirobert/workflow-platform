import "./workers/email.worker";
import "./workers/cleanup.worker";
import { startScheduler } from "./scheduler";

export async function startJobSystem() {
  await startScheduler();
  console.log("👷 Workers started");
}
