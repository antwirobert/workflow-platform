import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { organizationsApi } from "../api";
import type { OrganizationlistParams } from "../types";
import { useDebounce } from "@/hooks/useDebounce";

export function useOrganizationMembers(
  orgSlug: string | null,
  filters: OrganizationlistParams,
  rawQuery?: string,
) {
  const debouncedQuery = useDebounce(rawQuery, 300);

  const params = {
    ...filters,
    search: debouncedQuery || undefined,
  };

  return useQuery({
    queryKey: ["organizations", orgSlug, "members", params],
    queryFn: () => organizationsApi.listOrgMembers(orgSlug as string, params),
    enabled: !!orgSlug,
    placeholderData: keepPreviousData,
  });
}
