import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { workspacesApi } from "../api";
import type { WorkspacelistParams } from "../types";
import { useDebounce } from "@/hooks/useDebounce";
import { DELAY_MS } from "@/constants";

export function useWorkspaces(
  orgSlug: string | null,
  filters: WorkspacelistParams,
  rawQuery?: string,
) {
  const debouncedQuery = useDebounce(rawQuery, DELAY_MS);
  const params = { ...filters, search: debouncedQuery || undefined };

  return useQuery({
    queryKey: ["organizations", orgSlug, "workspaces", params],
    queryFn: () => workspacesApi.list(orgSlug as string, params),
    enabled: !!orgSlug,
    placeholderData: keepPreviousData,
  });
}
