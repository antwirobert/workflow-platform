import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { projectsApi } from "../api";
import type { ProjectlistParams } from "../types";
import { useDebounce } from "@/hooks/useDebounce";
import { DELAY_MS } from "@/constants";

export function useProjects(
  orgSlug: string | null,
  workspaceSlug: string | null,
  filters: ProjectlistParams,
  rawQuery?: string,
) {
  const debouncedQuery = useDebounce(rawQuery, DELAY_MS);

  const params = {
    ...filters,
    search: debouncedQuery || undefined,
  };

  return useQuery({
    queryKey: [
      "organizations",
      orgSlug,
      "workspaces",
      workspaceSlug,
      "projects",
      params,
    ],
    queryFn: () =>
      projectsApi.list(orgSlug as string, workspaceSlug as string, params),
    enabled: !!orgSlug && !!workspaceSlug,
    placeholderData: keepPreviousData,
  });
}
