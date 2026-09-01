import type { OrgRole } from "@/types/organization";

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
  role?: OrgRole;
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
