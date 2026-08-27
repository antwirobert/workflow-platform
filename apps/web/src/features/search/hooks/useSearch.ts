import { useQuery } from "@tanstack/react-query";
import { searchApi } from "../api";
import { useDebounce } from "@/hooks/useDebounce";
import type { SearchType } from "../types";

export function useSearch(
  orgSlug: string | null,
  rawQuery: string,
  type: SearchType,
) {
  const debouncedQuery = useDebounce(rawQuery, 300);

  return useQuery({
    queryKey: ["organizations", orgSlug, "search", type, debouncedQuery],
    queryFn: () =>
      searchApi.search(orgSlug as string, { query: debouncedQuery, type }),
    enabled: !!orgSlug && debouncedQuery.trim().length >= 2,
  });
}
