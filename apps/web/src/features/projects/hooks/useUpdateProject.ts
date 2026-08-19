import { useMutation, useQueryClient } from "@tanstack/react-query";
import { projectsApi } from "../api";
import type { UpdateProjectPayload } from "../types";
import type { ApiError } from "@/lib/api/client";
import type { Project } from "@/types/project";

export function useUpdateProject(
  orgSlug: string,
  workspaceSlug: string,
  projectSlug: string,
) {
  const queryClient = useQueryClient();

  return useMutation<Project, ApiError, UpdateProjectPayload>({
    mutationFn: (payload: UpdateProjectPayload) =>
      projectsApi.update(orgSlug, workspaceSlug, projectSlug, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          "organizations",
          orgSlug,
          "workspaces",
          workspaceSlug,
          "projects",
        ],
      });
    },
  });
}
