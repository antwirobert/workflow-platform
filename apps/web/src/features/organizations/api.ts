import { apiClient } from "@/lib/api/client";
import type {
  CreateOrganizationPayload,
  OrganizationlistParams,
  PaginatedResponse,
} from "./types";
import type { Organization } from "@/types/organization";

export const organizationsApi = {
  create: (payload: CreateOrganizationPayload) =>
    apiClient.post<Organization>("/api/organizations/", payload),
  list: (params: OrganizationlistParams) =>
    apiClient.get<PaginatedResponse<Organization>>("/api/organizations/", {
      params: {
        page: String(params.page),
        limit: String(params.limit),
      },
    }),
};
