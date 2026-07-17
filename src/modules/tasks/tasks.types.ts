import { TaskStatus, Priority } from "../../generated/prisma/client";
import { CreateTaskBody, UpdateTaskBody } from "./tasks.schemas";

export interface CreateTaskInput extends CreateTaskBody {
  projectId: string;
  createdById: string;
}

export interface UpdateTaskInput extends UpdateTaskBody {
  projectId: string;
  taskId: string;
}

export interface TaskResult {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: Priority;
  projectId: string;
  assigneeId: string | null;
  createdById: string;
  dueDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
