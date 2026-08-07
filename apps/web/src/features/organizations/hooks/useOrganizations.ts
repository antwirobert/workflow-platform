import { useQuery } from "@tanstack/react-query";
import { organizationsApi } from "../api";
import type { OrganizationlistParams } from "../types";

export function useOrganizations(filters: OrganizationlistParams) {
  return useQuery({
    queryKey: ["organizations", filters],
    queryFn: () => organizationsApi.list(filters),
  });
}
