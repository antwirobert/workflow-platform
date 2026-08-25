import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { commentsApi } from "../api";

export function useComments(
  orgSlug: string,
  workspaceSlug: string,
  projectSlug: string,
  taskId: string,
) {
  const commentKey = [
    "organizations",
    orgSlug,
    "workspaces",
    workspaceSlug,
    "projects",
    projectSlug,
    "tasks",
    taskId,
    "comments",
  ];

  return useQuery({
    queryKey: commentKey,
    queryFn: () =>
      commentsApi.list(orgSlug, workspaceSlug, projectSlug, taskId),
    placeholderData: keepPreviousData,
  });
}
