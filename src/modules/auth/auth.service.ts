import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { ConflictError, UnauthorizedError } from "../../common/errors";
import { prisma } from "../../lib/prisma";
import { LoginInput, RegisterInput } from "./auth.schemas";
import { config } from "../../config/env";
import { AuthResult, RefreshResult } from "./auth.types";
import { Prisma, User } from "../../generated/prisma/client";

export class AuthService {
  private generateAccessToken(userId: string): string {
    return jwt.sign({ userId }, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn,
    });
  }

  private async generateRefreshToken(userId: string): Promise<string> {
    const token = crypto.randomBytes(40).toString("hex");

    // Hash token before database insertion to prevent leaked DB dumps from compromising accounts
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    // Convert days config value into a absolute expiration timestamp
    const expiresAt = new Date(
      Date.now() + config.refreshTokenDays * 24 * 60 * 60 * 1000,
    );

    await prisma.refreshToken.create({
      data: { tokenHash, userId, expiresAt },
    });

    return token;
  }

  async register(input: RegisterInput): Promise<AuthResult> {
    const { name, email, password } = input;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictError("User already exists");
    }

    const passwordHash = await bcrypt.hash(password, 12);

    try {
      const user = await prisma.user.create({
        data: { name, email, passwordHash },
      });

      return await this.buildAuthResult(user);
    } catch (error) {
      // Catch race condition uniqueness constraint failures
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new ConflictError("User already exists");
      }

      throw error;
    }
  }

  async login(input: LoginInput): Promise<AuthResult> {
    const { email, password } = input;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const isVerified = await bcrypt.compare(password, user.passwordHash);

    if (!isVerified) {
      throw new UnauthorizedError("Invalid email or password");
    }

    return await this.buildAuthResult(user);
  }

  async refresh(rawToken: string): Promise<RefreshResult> {
    const tokenHash = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    const stored = await prisma.refreshToken.findUnique({
      where: { tokenHash },
    });

    if (!stored) {
      throw new UnauthorizedError("Refresh token is invalid");
    }

    if (stored.expiresAt < new Date()) {
      await prisma.refreshToken.delete({
        where: { id: stored.id },
      });
      throw new UnauthorizedError("Refresh token has expired");
    }

    // Enforce single-use refresh token rotation mechanics to minimize replay window
    await prisma.refreshToken.delete({
      where: { id: stored.id },
    });

    const accessToken = this.generateAccessToken(stored.userId);
    const refreshToken = await this.generateRefreshToken(stored.userId);

    return { accessToken, refreshToken };
  }

  async logout(rawToken: string) {
    const tokenHash = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    return prisma.refreshToken.deleteMany({
      where: { tokenHash },
    });
  }

  private async buildAuthResult(user: User): Promise<AuthResult> {
    const accessToken = this.generateAccessToken(user.id);
    const refreshToken = await this.generateRefreshToken(user.id);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }
}

export const authService = new AuthService();
