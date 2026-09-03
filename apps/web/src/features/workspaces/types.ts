import type { OrgRole } from "@/types/organization";

export interface CreateWorkspacePayload {
  name: string;
  slug: string;
}

export interface UpdateWorkspacePayload {
  name?: string;
  slug?: string;
}

export interface WorkspacelistParams {
  page: number;
  limit: number;
  search?: string;
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

export interface WorkspaceMember {
  id: string;
  name: string;
  email: string;
  role: OrgRole;
  assignedTaskCount: number;
}
