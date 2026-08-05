import {
  CreateOrganizationPayload,
  ListOrganizationsQueryInput,
  UpdateOrganizationPayload,
} from "./organizations.schemas";

export interface CreateOrganizationInput extends CreateOrganizationPayload {
  userId: string;
}

export interface UpdateOrganizationInput extends UpdateOrganizationPayload {
  organizationId: string;
  userId: string;
}

export interface OrganizationResult {
  id: string;
  name: string;
  slug: string;
  role?: string;
  createdAt: Date;
  workspaceCount?: number;
  memberCount?: number;
}

export interface ListOrganizationQuery extends ListOrganizationsQueryInput {
  userId: string;
}

export interface ListOrganizationsQueryResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
