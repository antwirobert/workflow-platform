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
  assignee?: {
    id: string | null;
    name: string | null;
  };
  dueDate: Date | null;
  labels: string[];
  createdAt: Date;
  updatedAt: Date;
  commentCount?: number;
  fileCount?: number;
}

export interface ListTasksQuery extends ListTasksQueryInput {
  userId: string;
  organizationId: string;

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
