import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { organizationsApi } from "../api";
import type { OrganizationlistParams } from "../types";

export function useOrganizationMembers(
  orgSlug: string | null,
  filters: OrganizationlistParams,
) {
  return useQuery({
    queryKey: ["organizations", orgSlug, filters],
    queryFn: () => organizationsApi.listOrgMembers(orgSlug as string, filters),
    enabled: !!orgSlug,
    placeholderData: keepPreviousData,
  });
}
