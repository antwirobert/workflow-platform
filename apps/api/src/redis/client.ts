import Redis from "ioredis";
import { config } from "../config/env";

const redis = new Redis(config.redisUrl || "redis://localhost:6379", {
  maxRetriesPerRequest: 3,
  lazyConnect: true,
});

export const bullmqConnection = new Redis(
  config.redisUrl || "redis://localhost:6379",
  {
    maxRetriesPerRequest: null,
    lazyConnect: true,
  },
);

redis.on("connect", () => console.log("Redis connected"));
redis.on("error", (err) => console.error("Redis error:", err));

export default redis;
