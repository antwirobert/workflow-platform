import type { OrgRole } from "@/types/organization";
import type { Priority, TaskScope, TaskStatus } from "@/types/task";

export interface CreateOrganizationPayload {
  name: string;
  slug: string;
}

export interface UpdateOrganizationPayload {
  name?: string;
  slug?: string;
}

export interface OrganizationlistParams {
  page: number;
  limit: number;
  search?: string;
  role?: OrgRole;
  status?: TaskStatus;
  priority?: Priority;
  projectId?: string;
  tab?: TaskScope;
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
