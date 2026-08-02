import { useQuery } from "@tanstack/react-query";
import { projectsApi } from "../api";

export function useProjects(orgId: string | null, workspaceId: string | null) {
  return useQuery({
    queryKey: ["organizations", orgId, "workspaces", workspaceId, "projects"],
    queryFn: () => projectsApi.list(orgId as string, workspaceId as string),
    enabled: !!orgId && !!workspaceId,
  });
}
