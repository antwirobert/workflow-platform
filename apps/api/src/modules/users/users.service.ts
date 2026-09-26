import { ConflictError, NotFoundError } from "../../common/errors";
import { Prisma, User } from "../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { UpdateUserInput, UserResult } from "./users.types";

export class UsersService {
  async getUserProfile(userId: string): Promise<UserResult> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundError("User");
    }

    return this.buildUsersResult(user);
  }

  async updateUserProfile(input: UpdateUserInput): Promise<UserResult> {
    const { name, email, userId } = input;

    try {
      const updated = await prisma.user.update({
        where: { id: userId },
        data: {
          ...(name !== undefined && { name }),
          ...(email !== undefined && { email }),
        },
      });

      return this.buildUsersResult(updated);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          throw new NotFoundError("User");
        }
        if (error.code === "P2002") {
          throw new ConflictError("Email already in use");
        }
      }
      throw error;
    }
  }

  private buildUsersResult(user: User): UserResult {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }
}

export const usersService = new UsersService();
