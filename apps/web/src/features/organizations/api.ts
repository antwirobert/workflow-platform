import { apiClient } from "@/lib/api/client";
import type { CreateOrganizationPayload } from "./types";
import type { Organization } from "@/types/organization";

export const organizationsApi = {
  create: (payload: CreateOrganizationPayload) =>
    apiClient.post<Organization>("/api/organizations/", payload),
  list: () => apiClient.get<Organization[]>("/api/organizations/"),
};
