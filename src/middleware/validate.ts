import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";
import { ValidationError } from "../common/errors";

export type RequestPart = "body" | "query" | "params";

declare global {
  namespace Express {
    interface Request {
      validated?: {
        body?: unknown;
        query?: unknown;
        params?: unknown;
      };
    }
  }
}

export const validate = (schema: ZodSchema, part: RequestPart = "body") => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[part]);

    if (!result.success) {
      return next(
        new ValidationError(
          `Invalid request ${part}`,
          result.error.flatten().fieldErrors,
        ),
      );
    }

    req.validated ??= {};
    req.validated[part] = result.data;
    next();
  };
};
