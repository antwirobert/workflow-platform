import { useQuery } from "@tanstack/react-query";
import { projectsApi } from "../api";

export function useProject(
  orgSlug: string | null,
  workspaceSlug: string | null,
  projectSlug: string | null,
) {
  return useQuery({
    queryKey: [
      "organizations",
      orgSlug,
      "workspaces",
      workspaceSlug,
      "projects",
      projectSlug,
    ],
    queryFn: () =>
      projectsApi.getById(
        orgSlug as string,
        workspaceSlug as string,
        projectSlug as string,
      ),
    enabled: !!orgSlug && !!workspaceSlug && !!projectSlug,
  });
}
