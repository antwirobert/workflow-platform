import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "../api";

export function useDashboard(orgSlug: string | null) {
  return useQuery({
    queryKey: ["organizations", orgSlug, "dashboard"],
    queryFn: () => dashboardApi.get(orgSlug as string),
    enabled: !!orgSlug,
  });
}
