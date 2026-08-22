import { Priority, TaskStatus } from "../../generated/prisma/enums";
import {
  CreateWorkspacePayload,
  listWorkspacesQueryInput,
  UpdateWorkspacePayload,
} from "./workspaces.schemas";

export interface CreateWorkspaceInput extends CreateWorkspacePayload {
  organizationId: string;
}

export interface WorkspaceResult {
  id?: string;
  name?: string;
  slug?: string;
  organizationId?: string;
  createdAt?: Date;
  updatedAt?: Date;
  role?: string;
  projectCount?: number;
  taskCount?: number;
  memberCount?: number;
  task?: {
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
  };
}

export interface UpdateWorkspaceInput extends UpdateWorkspacePayload {
  organizationId: string;
  workspaceId: string;
}

export interface listWorkspacesQuery extends listWorkspacesQueryInput {
  organizationId?: string;
  userId?: string;
  workspaceId?: string;
}

export interface ListWorkspacesQueryResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
