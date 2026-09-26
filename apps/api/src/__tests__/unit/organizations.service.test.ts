import { OrganizationsService } from "../../modules/organizations/organizations.service";
import { prisma } from "../../lib/prisma";
import { ConflictError } from "../../common/errors";
import { deleteCacheByPattern, getCache, setCache } from "../../redis/cache";

jest.mock("../../lib/prisma", () => ({
  __esModule: true,
  prisma: {
    organization: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    organizationMember: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
    },
    task: {
      findMany: jest.fn(),
      count: jest.fn(),
    },
    workspace: {
      findMany: jest.fn(),
      count: jest.fn(),
    },
    $transaction: jest.fn(),
  },
  default: {
    organization: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    organizationMember: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
    },
    task: {
      findMany: jest.fn(),
      count: jest.fn(),
    },
    workspace: {
      findMany: jest.fn(),
      count: jest.fn(),
    },
    $transaction: jest.fn(),
  },
}));

jest.mock("../../redis/cache", () => ({
  getCache: jest.fn(),
  setCache: jest.fn(),
  deleteCache: jest.fn(),
  deleteCacheByPattern: jest.fn(),
}));

const mockPrisma = prisma as jest.Mocked<typeof prisma>;
const service = new OrganizationsService();

describe("OrganizationsService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("throws a conflict when the slug already exists", async () => {
    mockPrisma.organization.findUnique = jest.fn().mockResolvedValue({
      id: "org-1",
      slug: "acme",
      name: "Acme",
      createdAt: new Date(),
    });

    await expect(
      service.create({ name: "Acme", slug: "acme", userId: "user-1" }),
    ).rejects.toThrow(ConflictError);
    await expect(
      service.create({ name: "Acme", slug: "acme", userId: "user-1" }),
    ).rejects.toThrow("Slug already exists");
  });

  it("creates an organization and owner membership in a transaction", async () => {
    mockPrisma.organization.findUnique = jest.fn().mockResolvedValue(null);

    const txOrganizationCreate = jest.fn().mockResolvedValue({
      id: "org-1",
      name: "Acme",
      slug: "acme",
      createdAt: new Date(),
    });

    const txMembershipCreate = jest.fn().mockResolvedValue({
      id: "member-1",
      organizationId: "org-1",
      userId: "user-1",
      role: "OWNER",
      createdAt: new Date(),
      lastAccessedAt: new Date(),
      accessCount: 1,
    });

    mockPrisma.$transaction = jest.fn().mockImplementation(async (callback) => {
      const tx = {
        organization: { create: txOrganizationCreate },
        organizationMember: { create: txMembershipCreate },
      } as any;

      return callback(tx);
    });

    const result = await service.create({
      name: "Acme",
      slug: "acme",
      userId: "user-1",
    });

    expect(mockPrisma.$transaction).toHaveBeenCalledTimes(1);
    expect(txOrganizationCreate).toHaveBeenCalledWith({
      data: { name: "Acme", slug: "acme" },
    });
    expect(txMembershipCreate).toHaveBeenCalledWith({
      data: {
        organizationId: "org-1",
        userId: "user-1",
        role: "OWNER",
        lastAccessedAt: expect.any(Date),
        accessCount: 1,
      },
    });
    expect(result).toMatchObject({
      id: "org-1",
      name: "Acme",
      slug: "acme",
      role: "OWNER",
    });
    expect(deleteCacheByPattern).toHaveBeenCalledWith(
      "organizations:users:user-1:*",
    );
  });

  it("returns cached organization results when available", async () => {
    const cachedResult = {
      data: [{ id: "org-1", name: "Acme", slug: "acme", role: "OWNER" }],
      meta: { page: 1, limit: 12, total: 1, totalPages: 1 },
    };

    (getCache as jest.Mock).mockResolvedValue(cachedResult);

    const result = await service.listForUser({
      page: 1,
      limit: 12,
      userId: "user-1",
    });

    expect(result).toEqual(cachedResult);
    expect(setCache).not.toHaveBeenCalled();
  });

  it("updates organization metadata and invalidates member caches", async () => {
    mockPrisma.organization.findUnique = jest.fn().mockResolvedValue({
      id: "org-1",
      name: "Acme",
      slug: "old-slug",
      createdAt: new Date(),
    });
    mockPrisma.organization.findUnique = jest
      .fn()
      .mockResolvedValueOnce({
        id: "org-1",
        name: "Acme",
        slug: "old-slug",
        createdAt: new Date(),
      })
      .mockResolvedValueOnce(null);
    mockPrisma.organization.update = jest.fn().mockResolvedValue({
      id: "org-1",
      name: "Acme Labs",
      slug: "acme-labs",
      createdAt: new Date(),
    });
    mockPrisma.organizationMember.findMany = jest
      .fn()
      .mockResolvedValue([{ userId: "user-1" }, { userId: "user-2" }]);

    const result = await service.update({
      organizationId: "org-1",
      name: "Acme Labs",
      slug: "acme-labs",
    });

    expect(mockPrisma.organization.update).toHaveBeenCalledWith({
      where: { id: "org-1" },
      data: { name: "Acme Labs", slug: "acme-labs" },
    });
    expect(result).toMatchObject({
      id: "org-1",
      name: "Acme Labs",
      slug: "acme-labs",
    });
  });
});
