import z from "zod";
import { Priority, TaskStatus } from "../../generated/prisma/enums";

export const createTaskSchema = z.object({
  title: z.string().trim().min(2, "Title must be at least 2 characters"),
  description: z
    .string()
    .trim()
    .max(500, "Description cannot exceed 1000 characters")
    .optional(),
  status: z.nativeEnum(TaskStatus).default("TODO"),
  priority: z.enum(Priority).default("MEDIUM"),
  assigneeId: z.string().uuid("Invalid assigneeId format").optional(),
  dueDate: z.coerce.date().optional(),
});

export const updateTaskSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(2, "Title must be at least 2 characters")
      .optional(),
    description: z
      .string()
      .trim()
      .max(500, "Description cannot exceed 1000 characters")
      .optional(),
    status: z.nativeEnum(TaskStatus).optional(),
    priority: z.enum(Priority).optional(),
    assigneeId: z
      .union([z.string().uuid("Invalid assigneeId format"), z.null()])
      .optional(),
    dueDate: z
      .union([z.string().datetime("Invalid dueDate format"), z.null()])
      .optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required to update a task",
  });

export const taskProjectParamsSchema = z.object({
  workspaceId: z.string().uuid("Invalid workspaceId format"),
  projectId: z.string().uuid("Invalid projectId format"),
});

export const taskDetailParamsSchema = z.object({
  workspaceId: z.string().uuid("Invalid workspaceId format"),
  projectId: z.string().uuid("Invalid projectId format"),
  taskId: z.string().uuid("Invalid taskId format"),
});

export const listTasksQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  status: z.nativeEnum(TaskStatus).optional(),
  priority: z.nativeEnum(Priority).optional(),
  assigneeId: z.string().uuid().optional(),
  sortBy: z.enum(["createdAt", "dueDate", "priority"]).default("createdAt"),
  order: z.enum(["asc", "desc"]).default("desc"),
});

export type CreateTaskBody = z.infer<typeof createTaskSchema>;
export type UpdateTaskBody = z.infer<typeof updateTaskSchema>;
export type ProjectTaskParamsInput = z.infer<typeof taskProjectParamsSchema>;
export type TaskDetailParamsInput = z.infer<typeof taskDetailParamsSchema>;
export type listTasksQuery = z.infer<typeof listTasksQuerySchema>;
