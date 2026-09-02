import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { organizationsApi } from "../api";
import type { OrganizationlistParams } from "../types";
import { useDebounce } from "@/hooks/useDebounce";
import { DELAY_MS } from "@/constants";

export function useOrganizations(
  filters: OrganizationlistParams,
  rawQuery?: string,
) {
  const debouncedQuery = useDebounce(rawQuery, DELAY_MS);

  const params = { ...filters, search: debouncedQuery || undefined };

  return useQuery({
    queryKey: ["organizations", params],
    queryFn: () => organizationsApi.list(params),
    placeholderData: keepPreviousData,
  });
}
