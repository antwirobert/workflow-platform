import { NotFoundError } from "../../common/errors";
import { prisma } from "../../lib/prisma";
import { Task, TaskStatus, Priority } from "../../generated/prisma/client";
import {
  CreateTaskInput,
  ListTasksQuery,
  listTasksQueryResult,
  TaskResult,
  UpdateTaskInput,
} from "./tasks.types";

export class TasksService {
  async create(input: CreateTaskInput): Promise<TaskResult> {
    const {
      projectId,
      title,
      description,
      status,
      priority,
      assigneeId,
      createdById,
      dueDate,
      labels,
    } = input;

    const task = await prisma.task.create({
      data: {
        title,
        description,
        status,
        priority,
        projectId,
        assigneeId,
        createdById,
        dueDate,
        labels,
      },
    });

    return this.buildTaskResult(task);
  }

  async list(query: ListTasksQuery): Promise<listTasksQueryResult<TaskResult>> {
    const { page, limit, status, priority, assigneeId, projectId } = query;

    // Calculate offset for pagination
    const skip = (page - 1) * limit;

    const where = {
      projectId,
      deletedAt: null,
      ...(status && { status }),
      ...(priority && { priority }),
      ...(assigneeId && { assigneeId }),
    };

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        skip,
        take: limit,
        orderBy: [
          { dueDate: { sort: "asc", nulls: "last" } },
          { createdAt: "desc" },
        ],
        include: {
          assignee: { select: { id: true, name: true } },
          _count: {
            select: {
              comments: true,
            },
          },
          files: {
            select: { id: true },
          },
        },
      }),

      prisma.task.count({ where }),
    ]);

    return {
      data: tasks.map((task) =>
        this.buildTaskResult(
          task,
          {
            id: task.assignee?.id ?? null,
            name: task.assignee?.name ?? null,
          },
          {
            commentCount: task._count.comments,
            fileCount: task.files.length,
          },
        ),
      ),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getById(projectId: string, taskId: string): Promise<TaskResult> {
    const task = await prisma.task.findUnique({
      where: {
        id: taskId,
      },
      include: {
        _count: {
          select: {
            comments: true,
          },
        },
        files: {
          select: { id: true },
        },
      },
    });

    if (!task || task.projectId !== projectId || task.deletedAt) {
      throw new NotFoundError("Task");
    }

    return this.buildTaskResult(task);
  }

  async update(input: UpdateTaskInput): Promise<TaskResult> {
    const {
      projectId,
      taskId,
      title,
      description,
      status,
      priority,
      assigneeId,
      dueDate,
      labels,
    } = input;

    const existing = await prisma.task.findUnique({
      where: {
        id: taskId,
      },
    });

    if (!existing || existing.projectId !== projectId || existing.deletedAt) {
      throw new NotFoundError("Task");
    }

    let completedAt: Date | null | undefined = undefined;
    if (status !== undefined && status !== existing.status) {
      if (status === TaskStatus.DONE) {
        completedAt = new Date();
      } else if (existing.status === TaskStatus.DONE) {
        completedAt = null;
      }
    }

    const task = await prisma.task.update({
      where: { id: taskId },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(status !== undefined && { status }),
        ...(priority !== undefined && { priority }),
        ...(assigneeId !== undefined && { assigneeId }),
        ...(dueDate !== undefined && { dueDate }),
        ...(labels !== undefined && { labels }),
      },
    });

    return this.buildTaskResult(task);
  }

  async delete(projectId: string, taskId: string): Promise<TaskResult> {
    const existing = await prisma.task.findUnique({
      where: {
        id: taskId,
      },
    });

    if (!existing || existing.projectId !== projectId || existing.deletedAt) {
      throw new NotFoundError("Task");
    }

    // Perform soft delete by setting timestamps
    const task = await prisma.task.update({
      where: { id: taskId },
      data: {
        deletedAt: new Date(),
      },
    });

    return this.buildTaskResult(task);
  }

  private buildTaskResult(
    task: Task,
    assignee?: { id: string | null; name: string | null },
    counts?: { commentCount: number; fileCount: number },
  ): TaskResult {
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status as TaskStatus,
      priority: task.priority as Priority,
      projectId: task.projectId,
      ...(assignee ? { assignee } : {}),
      dueDate: task.dueDate,
      labels: task.labels,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
      ...(counts
        ? { commentCount: counts.commentCount, fileCount: counts.fileCount }
        : {}),
    };
  }
}

export const tasksService = new TasksService();
