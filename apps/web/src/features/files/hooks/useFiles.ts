import { useQuery } from "@tanstack/react-query";
import { filesApi } from "../api";

export function useFiles(
  orgSlug: string,
  workspaceSlug: string,
  projectSlug: string,
  taskId: string,
) {
  return useQuery({
    queryKey: [
      "organizations",
      orgSlug,
      "workspaces",
      workspaceSlug,
      "projects",
      projectSlug,
      "tasks",
      taskId,
      "files",
    ],
    queryFn: () => filesApi.list(orgSlug, workspaceSlug, projectSlug, taskId),
  });
}
