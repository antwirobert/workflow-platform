export interface CreateProjectPaylaod {
  name: string;
  slug: string;
  description?: string;
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
