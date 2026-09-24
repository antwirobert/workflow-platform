import winston from "winston";
import { config } from "../config/env";

const logger = winston.createLogger({
  level: config.nodeEnv === "production" ? "info" : "debug",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    config.nodeEnv === "production"
      ? winston.format.json() // Machine-readable in production
      : winston.format.combine(
          // Human-readable in development
          winston.format.colorize(),
          winston.format.printf(({ level, message, timestamp, ...meta }) => {
            const metaStr = Object.keys(meta).length
              ? JSON.stringify(meta, null, 2)
              : "";
            return `${timestamp} [${level}]: ${message} ${metaStr}`;
          }),
        ),
  ),
  transports: [new winston.transports.Console()],
});

export default logger;
