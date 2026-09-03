import {
  CreateProjectPayload,
  ListProjectsQueryInput,
  UpdateProjectPayload,
} from "./projects.schemas";

export interface CreateProjectInput extends CreateProjectPayload {
  workspaceId: string;
}

export interface ProjectResult {
  name: string;
  slug: string;
  description: string | null;
  workspaceId: string;
  id: string;
  createdAt: Date;
  updatedAt: Date;
  role?: string;
  totalTaskCount?: number;
  completedTaskCount?: number;
}

export interface UpdateProjectInput extends UpdateProjectPayload {
  projectId: string;
  workspaceId: string;
}
export interface ProjectAssignneeResult {
  id: string;
  name: string;
}

export interface ListProjectsQuery extends ListProjectsQueryInput {
  userId?: string;
  workspaceId?: string;
  projectId?: string;
}

export interface ListProjectsQueryResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
