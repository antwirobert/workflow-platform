import { apiClient } from "@/lib/api/client";
import type {
  CreateOrganizationPayload,
  OrganizationlistParams,
  PaginatedResponse,
  UpdateOrganizationPayload,
} from "./types";
import type { Organization } from "@/types/organization";

const base = "/api/organizations/";

export const organizationsApi = {
  create: (payload: CreateOrganizationPayload) =>
    apiClient.post<Organization>(base, payload),
  list: (params: OrganizationlistParams) =>
    apiClient.get<PaginatedResponse<Organization>>(base, {
      params: {
        page: String(params.page),
        limit: String(params.limit),
      },
    }),
  getById: (orgSlug: string) =>
    apiClient.get<Organization>(`${base}${orgSlug}`),
  update: (orgSlug: string, payload: UpdateOrganizationPayload) =>
    apiClient.patch<Organization>(`${base}${orgSlug}`, payload),
  delete: (orgSlug: string) => apiClient.delete<void>(`${base}${orgSlug}`),
};
