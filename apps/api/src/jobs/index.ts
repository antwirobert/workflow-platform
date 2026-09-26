import "./workers/email.worker";
import "./workers/cleanup.worker";
import { startScheduler } from "./scheduler";
import logger from "../logger";

export async function startJobSystem() {
  await startScheduler();
  logger.info("Workers started");
}
