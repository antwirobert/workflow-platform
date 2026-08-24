export interface CreateProjectPayload {
  name: string;
  slug: string;
  description?: string;
}

export interface UpdateProjectPayload {
  name?: string;
  slug?: string;
  description?: string;
}

export interface ProjectAssignee {
  id: string;
  name: string;
}

export interface ProjectlistParams {
  page: number;
  limit: number;
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
