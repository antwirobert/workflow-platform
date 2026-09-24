import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { AppError, ValidationError } from "../common/errors";
import multer from "multer";
import logger from "../logger";

export const errorHandler: ErrorRequestHandler = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err instanceof AppError) {
    logger.warn("Application error", {
      message: err.message,
      statusCode: err.statusCode,
      code: err.code,
      path: req.path,
      method: req.method,
      requestId: req.requestId,
    });

    return res.status(err.statusCode).json({
      success: false,
      code: err.code,
      message: err.message,
      ...(err instanceof ValidationError && err.details
        ? { details: err.details }
        : {}),
    });
  }

  if (err instanceof multer.MulterError) {
    logger.warn("Multer error", {
      code: err.code,
      message: err.message,
      path: req.path,
      requestId: req.requestId,
    });

    return res.status(400).json({
      success: false,
      code: `FILE_UPLOAD_ERROR_${err.code}`,
      message: err.message,
    });
  }

  logger.error("Unexpected error", {
    message: err instanceof Error ? err.message : "Unknown error",
    stack: err instanceof Error ? err.stack : undefined,
    path: req.path,
    method: req.method,
    requestId: req.requestId,
  });

  return res.status(500).json({
    success: false,
    code: "INTERNAL_SERVER_ERROR",
    message: "Something went wrong",
  });
};
