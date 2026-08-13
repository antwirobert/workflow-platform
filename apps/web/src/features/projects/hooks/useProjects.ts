import { useQuery } from "@tanstack/react-query";
import { projectsApi } from "../api";

export function useProjects(
  orgSlug: string | null,
  workspaceSlug: string | null,
) {
  return useQuery({
    queryKey: [
      "organizations",
      orgSlug,
      "workspaces",
      workspaceSlug,
      "projects",
    ],
    queryFn: () => projectsApi.list(orgSlug as string, workspaceSlug as string),
    enabled: !!orgSlug && !!workspaceSlug,
  });
}
