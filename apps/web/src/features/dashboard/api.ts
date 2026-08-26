import { apiClient } from "@/lib/api/client";
import type { DashboardData } from "./types";

export const dashboardApi = {
  get: (orgSlug: string) =>
    apiClient.get<DashboardData>(`/api/organizations/${orgSlug}/dashboard/`),
};
