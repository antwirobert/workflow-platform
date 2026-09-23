import bcrypt from "bcryptjs";
import { AuthService } from "../../modules/auth/auth.service";
import { prisma } from "../../lib/prisma";

// Mock the entire Prisma client — no real DB in unit tests
jest.mock("../../lib/prisma", () => ({
  __esModule: true,
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
      ).rejects.toThrow("Email already in use");
    });

    it("should hash password and create user", async () => {
      mockPrisma.user.findUnique = jest.fn().mockResolvedValue(null);
      mockPrisma.user.create = jest.fn().mockResolvedValue({
        id: "1",
        name: "Robert",
        email: "test@test.com",
      });

      const result = await authService.register({
        name: "Robert",
        email: "test@test.com",
        password: "password123",
      });
      expect(mockPrisma.user.create).toHaveBeenCalledTimes(1);

      // Verify the password was hashed — never stored as plaintext
      const createCall = (mockPrisma.user.create as jest.Mock).mock.calls[0][0];
      const isHashed = await bcrypt.compare(
        "password123",
        createCall.data.password,
      );
      expect(isHashed).toBe(true);
    });
  });

  describe("login", () => {
    it("should throw 401 if user does not exist", async () => {
      mockPrisma.user.findUnique = jest.fn().mockResolvedValue(null);

      await expect(
        authService.login({ email: "unknown@test.com", password: "password" }),
      ).rejects.toThrow("Invalid credentials");
    });

    it("should throw 401 if password is wrong", async () => {
      const hashedPassword = await bcrypt.hash("correctpassword", 10);
      mockPrisma.user.findUnique = jest.fn().mockResolvedValue({
        id: "1",
        email: "test@test.com",
        password: hashedPassword,
      });

      await expect(
        authService.login({
          email: "test@test.com",
          password: "wrongpassword",
        }),
      ).rejects.toThrow("Invalid credentials");
    });
  });
});
