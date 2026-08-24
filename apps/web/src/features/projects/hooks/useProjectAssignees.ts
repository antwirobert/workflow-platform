import { useQuery } from "@tanstack/react-query";
import { projectsApi } from "../api";
import type { ProjectlistParams } from "../types";

export function useProjectAssignees(
  orgSlug: string | null,
  workspaceSlug: string | null,
  projectSlug: string | null,
  filters: ProjectlistParams,
) {
  return useQuery({
    queryKey: [
      "organizations",
      orgSlug,
      "workspaces",
      workspaceSlug,
      "projects",
      projectSlug,
      filters,
    ],
    queryFn: () =>
      projectsApi.listProjectAssignees(
        orgSlug as string,
        workspaceSlug as string,
        projectSlug as string,
        filters,
      ),
    enabled: !!orgSlug && !!workspaceSlug && !!projectSlug,
  });
}
