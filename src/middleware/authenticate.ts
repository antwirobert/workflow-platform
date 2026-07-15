import { Request, Response, NextFunction } from "express";
import { UnauthorizedError } from "../common/errors";
import jwt, {
  JsonWebTokenError,
  NotBeforeError,
  TokenExpiredError,
} from "jsonwebtoken";
import { config } from "../config/env";

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
  };
}

function isValidPayload(payload: unknown): payload is { userId: string } {
  return (
    typeof payload === "object" &&
    payload !== null &&
    "userId" in payload &&
    typeof (payload as Record<string, unknown>).userId === "string"
  );
}

export const authenticate = (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction,
) => {
  const authHeaders = req.headers.authorization;

  if (!authHeaders?.startsWith("Bearer ")) {
    return next(
      new UnauthorizedError("Missing or invalid authorization header"),
    );
  }

  const token = authHeaders.split(" ")[1];

  try {
    const payload = jwt.verify(token, config.jwtSecret);

    if (!isValidPayload(payload)) {
      return next(new UnauthorizedError("Malformed token payload"));
    }

    req.user = payload;
    next();
  } catch (error) {
    if (error instanceof TokenExpiredError)
      return next(new UnauthorizedError("Token has expired"));
    if (error instanceof JsonWebTokenError)
      return next(new UnauthorizedError("Invalid token"));
    if (error instanceof NotBeforeError)
      return next(new UnauthorizedError("Token not yet valid"));

    return next(new UnauthorizedError("Failed to authenticate token"));
  }
};
