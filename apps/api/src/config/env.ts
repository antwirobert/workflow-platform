import dotenv from "dotenv";
import { SignOptions } from "jsonwebtoken";
dotenv.config();

function requireEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing rquired environment variable: ${name}`);
  }

  return value;
}

export const config = {
  port: parseInt(process.env.PORT ?? "8080", 10),
  refreshTokenDays: parseInt(process.env.REFRESH_TOKEN_DAYS ?? "7", 10),
  nodeEnv: process.env.NODE_ENV ?? "development",
  databaseUrl: requireEnv("DATABASE_URL"),
  jwtSecret: requireEnv("JWT_SECRET"),
  jwtExpiresIn: requireEnv("JWT_EXPIRES_IN") as SignOptions["expiresIn"],
};
