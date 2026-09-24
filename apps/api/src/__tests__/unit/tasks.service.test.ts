import { Priority, TaskStatus } from "../../generated/prisma/enums";
import { NotFoundError } from "../../common/errors";
import { prisma } from "../../lib/prisma";
import { deleteCacheByPattern, getCache, setCache } from "../../redis/cache";
import { TasksService } from "../../modules/tasks/tasks.service";

jest.mock("../../lib/prisma", () => ({
  __esModule: true,
  prisma: {
    task: {
      create: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  },
  default: {
    task: {
      create: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  },
}));

jest.mock("../../redis/cache", () => ({
  getCache: jest.fn(),
  setCache: jest.fn(),
  deleteCacheByPattern: jest.fn(),
}));

const mockPrisma = prisma as jest.Mocked<typeof prisma>;
const service = new TasksService();

const task = (overrides: Record<string, unknown> = {}) => ({
  id: "task-1",
  title: "Write tests",
  description: "Cover the tasks module",
  status: TaskStatus.TODO,
  priority: Priority.HIGH,
  projectId: "project-1",
  assigneeId: "user-2",
  createdById: "user-1",
  dueDate: null,
  completedAt: null,
  labels: ["testing"],
  deletedAt: null,
  createdAt: new Date("2026-09-01T10:00:00.000Z"),
  updatedAt: new Date("2026-09-01T10:00:00.000Z"),
  ...overrides,
});

describe("TasksService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (deleteCacheByPattern as jest.Mock).mockResolvedValue(undefined);
    (setCache as jest.Mock).mockResolvedValue(undefined);
    (getCache as jest.Mock).mockResolvedValue(null);
  });

  it("creates a task and invalidates project and user caches", async () => {
    (mockPrisma.task.create as jest.Mock).mockResolvedValue(task());

    const result = await service.create({
      projectId: "project-1",
      organizationId: "org-1",
      workspaceId: "workspace-1",
      createdById: "user-1",
      title: "Write tests",
      description: "Cover the tasks module",
      status: TaskStatus.TODO,
      priority: Priority.HIGH,
      assigneeId: "user-2",
      dueDate: undefined,
      labels: ["testing"],
    });

    expect(mockPrisma.task.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        title: "Write tests",
        projectId: "project-1",
        createdById: "user-1",
        assigneeId: "user-2",
        labels: ["testing"],
      }),
    });
    expect(result).toMatchObject({ id: "task-1", title: "Write tests" });
    expect(deleteCacheByPattern).toHaveBeenCalledWith(
      "organizations:org-1:users:user-2:tasks:*",
    );
  });

  it("returns cached task lists without querying Prisma", async () => {
    const cached = {
      data: [task()],
      meta: { total: 1, page: 1, limit: 12, totalPages: 1 },
    };
    (getCache as jest.Mock).mockResolvedValue(cached);

    await expect(
      service.list({
        page: 1,
        limit: 12,
        projectId: "project-1",
        organizationId: "org-1",
        workspaceId: "workspace-1",
      }),
    ).resolves.toEqual(cached);

    expect(mockPrisma.task.findMany).not.toHaveBeenCalled();
    expect(setCache).not.toHaveBeenCalled();
  });

  it("lists filtered tasks with pagination and related counts", async () => {
    (mockPrisma.task.findMany as jest.Mock).mockResolvedValue([
      {
        ...task(),
        assignee: { id: "user-2", name: "Assignee" },
        _count: { comments: 2 },
        files: [{ id: "file-1" }],
      },
    ]);
    (mockPrisma.task.count as jest.Mock).mockResolvedValue(3);

    const result = await service.list({
      page: 2,
      limit: 1,
      status: TaskStatus.TODO,
      priority: Priority.HIGH,
      assigneeId: "user-2",
      projectId: "project-1",
    });

    expect(mockPrisma.task.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          projectId: "project-1",
          deletedAt: null,
          status: TaskStatus.TODO,
          priority: Priority.HIGH,
          assigneeId: "user-2",
        },
        skip: 1,
        take: 1,
      }),
    );
    expect(result).toMatchObject({
      meta: { total: 3, page: 2, limit: 1, totalPages: 3 },
      data: [
        expect.objectContaining({
          assignee: { id: "user-2", name: "Assignee" },
          commentCount: 2,
          fileCount: 1,
        }),
      ],
    });
    expect(setCache).toHaveBeenCalledWith(expect.any(String), result, 120);
  });

  it("rejects tasks outside the requested project", async () => {
    (mockPrisma.task.findUnique as jest.Mock).mockResolvedValue(
      task({ projectId: "other-project" }),
    );

    await expect(
      service.getById("org-1", "workspace-1", "project-1", "task-1"),
    ).rejects.toThrow(NotFoundError);
  });

  it("stores completion timestamps when a task is completed", async () => {
    (mockPrisma.task.findUnique as jest.Mock).mockResolvedValue(task());
    (mockPrisma.task.update as jest.Mock).mockResolvedValue(
      task({ status: TaskStatus.DONE, completedAt: expect.any(Date) }),
    );

    await service.update({
      projectId: "project-1",
      taskId: "task-1",
      organizationId: "org-1",
      workspaceId: "workspace-1",
      status: TaskStatus.DONE,
    });

    expect(mockPrisma.task.update).toHaveBeenCalledWith({
      where: { id: "task-1" },
      data: expect.objectContaining({
        status: TaskStatus.DONE,
        completedAt: expect.any(Date),
      }),
    });
  });

  it("soft deletes an existing task", async () => {
    (mockPrisma.task.findUnique as jest.Mock).mockResolvedValue(task());
    (mockPrisma.task.update as jest.Mock).mockResolvedValue(
      task({ deletedAt: new Date() }),
    );

    const result = await service.delete(
      "org-1",
      "workspace-1",
      "project-1",
      "task-1",
    );

    expect(mockPrisma.task.update).toHaveBeenCalledWith({
      where: { id: "task-1" },
      data: { deletedAt: expect.any(Date) },
    });
    expect(result.id).toBe("task-1");
  });
});