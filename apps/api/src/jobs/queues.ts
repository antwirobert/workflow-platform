import { Queue } from "bullmq";
import { bullmqConnection } from "../redis/client";

export const emailQueue = new Queue("email", { connection: bullmqConnection });
export const cleanupQueue = new Queue("cleanup", {
  connection: bullmqConnection,
  defaultJobOptions: {
    removeOnComplete: true,
    removeOnFail: false,
  },
});
