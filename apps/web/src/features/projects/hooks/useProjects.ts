import { useQuery } from "@tanstack/react-query";
import { projectsApi } from "../api";
import type { ProjectlistParams } from "../types";

export function useProjects(
  orgSlug: string | null,
  workspaceSlug: string | null,
  filters: ProjectlistParams,
) {
  return useQuery({
    queryKey: [
      "organizations",
      orgSlug,
      "workspaces",
      workspaceSlug,
      "projects",
      filters,
    ],
    queryFn: () =>
      projectsApi.list(orgSlug as string, workspaceSlug as string, filters),
    enabled: !!orgSlug && !!workspaceSlug,
  });
}
