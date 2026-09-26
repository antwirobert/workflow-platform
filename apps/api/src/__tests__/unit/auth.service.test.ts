import bcrypt from "bcryptjs";
import { AuthService } from "../../modules/auth/auth.service";
import { prisma } from "../../lib/prisma";

// Mock the entire Prisma client — no real DB in unit tests
jest.mock("../../lib/prisma", () => ({
  __esModule: true,
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    refreshToken: {
      create: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
    },
  },
  default: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    refreshToken: {
      create: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
    },
  },
}));

const mockPrisma = prisma as jest.Mocked<typeof prisma>;
const authService = new AuthService();

beforeEach(() => {
  mockPrisma.refreshToken.create = jest.fn().mockResolvedValue({ id: "rt-1" });
});

describe("AuthService", () => {
  describe("register", () => {
    it("should throw ConflictError if email already exists", async () => {
      mockPrisma.user.findUnique = jest
        .fn()
        .mockResolvedValue({ id: "1", email: "test@test.com" });

      await expect(
        authService.register({
          name: "Robert",
          email: "test@test.com",
          password: "password123",
        }),
      ).rejects.toThrow("User already exists");
    });

    it("should hash password and create user", async () => {
      mockPrisma.user.findUnique = jest.fn().mockResolvedValue(null);
      mockPrisma.user.create = jest.fn().mockResolvedValue({
        id: "1",
        name: "Robert",
        email: "test@test.com",
      });

      await authService.register({
        name: "Robert",
        email: "test@test.com",
        password: "password123",
      });

      expect(mockPrisma.user.create).toHaveBeenCalledTimes(1);

      const createCall = (mockPrisma.user.create as jest.Mock).mock.calls[0][0];
      const isHashed = await bcrypt.compare(
        "password123",
        createCall.data.passwordHash,
      );
      expect(isHashed).toBe(true);
    });
  });

  describe("login", () => {
    it("should throw 401 if user does not exist", async () => {
      mockPrisma.user.findUnique = jest.fn().mockResolvedValue(null);

      await expect(
        authService.login({ email: "unknown@test.com", password: "password" }),
      ).rejects.toThrow("Invalid email or password");
    });

    it("should throw 401 if password is wrong", async () => {
      const hashedPassword = await bcrypt.hash("correctpassword", 10);
      mockPrisma.user.findUnique = jest.fn().mockResolvedValue({
        id: "1",
        email: "test@test.com",
        passwordHash: hashedPassword,
      });

      await expect(
        authService.login({
          email: "test@test.com",
          password: "wrongpassword",
        }),
      ).rejects.toThrow("Invalid email or password");
    });
  });
});
