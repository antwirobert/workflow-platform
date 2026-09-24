import { Response, NextFunction } from "express";
import logger from "../logger";
import { randomUUID } from "crypto";
import { AuthenticatedRequest } from "./authenticate";

export function requestLogger(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  const requestId = randomUUID();
  const start = Date.now();

  req.requestId = requestId;

  res.on("finish", () => {
    const duration = Date.now() - start;

    logger.info("HTTP Request", {
      requestId,
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get("user-agent"),
      userId: req.user?.userId ?? null,
    });
  });

  next();
}
