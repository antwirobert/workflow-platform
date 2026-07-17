import { TaskStatus, Priority } from "../../generated/prisma/client";
import {
  CreateTaskPayload,
  ListTasksQueryInput,
  UpdateTaskPayload,
} from "./tasks.schemas";

export interface CreateTaskInput extends CreateTaskPayload {
  projectId: string;
  createdById: string;
}

export interface UpdateTaskInput extends UpdateTaskPayload {
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

export interface ListTasksQuery extends ListTasksQueryInput {
  projectId: string;
}

export interface listTasksQueryResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
