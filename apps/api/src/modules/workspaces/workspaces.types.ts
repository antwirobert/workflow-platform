import {
  CreateWorkspacePayload,
  listWorkspacesQueryInput,
  UpdateWorkspacePayload,
} from "./workspaces.schemas";

export interface CreateWorkspaceInput extends CreateWorkspacePayload {
  organizationId: string;
}

export interface WorkspaceResult {
  id: string;
  name: string;
  slug: string;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
  role?: string;
  projectCount?: number;
  taskCount?: number;
  memberCount?: number;
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
