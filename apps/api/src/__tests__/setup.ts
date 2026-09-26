import { config } from "../config/env";
import { prisma } from "../lib/prisma";

jest.mock("../jobs/queues", () => ({
  emailQueue: { add: jest.fn() },
  cleanupQueue: { add: jest.fn() },
}));

jest.mock("../jobs", () => ({
  startJobSystem: jest.fn(),
}));

// Runs once before all tests
beforeAll(async () => {
  // Point Prisma at test database
  config.databaseUrl = config.databaseUrlTest!;
});

// Runs after each test — clean the database
afterEach(async () => {
  if (jest.isMockFunction(prisma.refreshToken.deleteMany)) return;

  // Delete in correct order to respect foreign keys
  await prisma.refreshToken.deleteMany();
  await prisma.invitation.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.file.deleteMany();
  await prisma.task.deleteMany();
  await prisma.project.deleteMany();
  await prisma.workspace.deleteMany();
  await prisma.organizationMember.deleteMany();
  await prisma.organization.deleteMany();
  await prisma.user.deleteMany();
});

// Runs once after all tests
afterAll(async () => {
  await prisma.$disconnect();
});
