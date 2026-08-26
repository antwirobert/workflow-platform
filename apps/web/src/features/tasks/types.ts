import type { Priority, TaskStatus } from "@/types/task";

export interface CreateTaskPaylaod {
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  assigneeId?: string;
  dueDate?: Date;
}

export interface UpdateTaskPayload {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: Priority;
  assigneeId?: string;
  dueDate?: Date;
}

export interface TasklistParams {
  page: number;
  limit: number;
  status?: TaskStatus;
  priority?: Priority;
  assigneeId?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
