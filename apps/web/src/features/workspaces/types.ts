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
