import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { AppError, ValidationError } from "../common/errors";
import multer from "multer";

export const errorHandler: ErrorRequestHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err instanceof AppError) {
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
    return res.status(400).json({
      success: false,
      code: `FILE_UPLOAD_ERROR_${err.code}`,
      message: err.message,
    });
  }

  if (err instanceof Error) {
    console.error(err);
  }

  console.error(err);

  return res.status(500).json({
    success: false,
    code: "INTERNAL_SERVER_ERROR",
    message: "Something went wrong",
  });
};
