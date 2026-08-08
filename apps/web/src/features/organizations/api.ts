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
  getById: (orgId: string) => apiClient.get<Organization>(`${base}${orgId}`),
  update: (orgId: string, payload: UpdateOrganizationPayload) =>
    apiClient.patch<Organization>(`${base}${orgId}`, payload),
  delete: (orgId: string) => apiClient.delete<void>(`${base}${orgId}`),
};
