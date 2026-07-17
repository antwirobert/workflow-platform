import { NotFoundError } from "../../common/errors";
import { prisma } from "../../lib/prisma";
import { Task, TaskStatus, Priority } from "../../generated/prisma/client";
import {
  CreateTaskInput,
  listTasksQueryInput,
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
      },
    });

    return this.buildTaskResult(task);
  }

  async list(
    query: listTasksQueryInput,
  ): Promise<listTasksQueryResult<TaskResult>> {
    const {
      page,
      limit,
      status,
      priority,
      assigneeId,
      sortBy,
      order,
      projectId,
    } = query;

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
        orderBy: {
          [sortBy]: order,
        },
      }),

      prisma.task.count({ where }),
    ]);

    return {
      data: tasks.map((task) => this.buildTaskResult(task)),
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
    } = input;

    const existing = await prisma.task.findUnique({
      where: {
        id: taskId,
      },
    });

    if (!existing || existing.projectId !== projectId || existing.deletedAt) {
      throw new NotFoundError("Task");
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

    const task = await prisma.task.update({
      where: { id: taskId },
      data: {
        deletedAt: new Date(),
      },
    });

    return this.buildTaskResult(task);
  }

  private buildTaskResult(task: Task): TaskResult {
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status as TaskStatus,
      priority: task.priority as Priority,
      projectId: task.projectId,
      assigneeId: task.assigneeId,
      createdById: task.createdById,
      dueDate: task.dueDate,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    };
  }
}

export const tasksService = new TasksService();
