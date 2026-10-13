import { Queue } from "bullmq";
import { bullmqConnection } from "../redis/client";

export const emailQueue = new Queue("email", {
  connection: bullmqConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 5000,
    },
    removeOnComplete: true,
    removeOnFail: false,
  },
});
export const cleanupQueue = new Queue("cleanup", {
  connection: bullmqConnection,
  defaultJobOptions: {
    removeOnComplete: true,
    removeOnFail: false,
  },
});
