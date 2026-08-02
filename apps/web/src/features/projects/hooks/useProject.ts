import { useQuery } from "@tanstack/react-query";
import { projectsApi } from "../api";

export function useProject(
  orgId: string | null,
  workspaceId: string | null,
  projectId: string | null,
) {
  return useQuery({
    queryKey: [
      "organizations",
      orgId,
      "workspaces",
      workspaceId,
      "projects",
      projectId,
    ],
    queryFn: () =>
      projectsApi.getById(
        orgId as string,
        workspaceId as string,
        projectId as string,
      ),
    enabled: !!orgId && !!workspaceId && !!projectId,
  });
}
