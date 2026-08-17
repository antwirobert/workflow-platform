import { useMutation, useQueryClient } from "@tanstack/react-query";
import { workspacesApi } from "../api";
import type { UpdateWorkspacePayload } from "../types";
import type { ApiError } from "@/lib/api/client";
import type { Workspace } from "@/types/workspace";

export function useUpdateWorkspace(orgSlug: string, workspaceSlug: string) {
  const queryClient = useQueryClient();

  return useMutation<Workspace, ApiError, UpdateWorkspacePayload>({
    mutationFn: (payload: UpdateWorkspacePayload) =>
      workspacesApi.update(orgSlug, workspaceSlug, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["organizations", orgSlug, "workspaces"],
      });
    },
  });
}
