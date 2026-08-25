import { useQuery } from "@tanstack/react-query";
import { filesApi } from "../api";

export function useFiles(
  orgId: string,
  workspaceId: string,
  projectId: string,
  taskId: string,
) {
  return useQuery({
    queryKey: [
      "organizations",
      orgId,
      "workspaces",
      workspaceId,
      "projects",
      projectId,
      "tasks",
      taskId,
      "files",
    ],
    queryFn: () => filesApi.list(orgId, workspaceId, projectId, taskId),
  });
}
