import { generateSlug } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateWorkspacePayload } from "../types";
import { workspacesApi } from "../api";
import type { Workspace } from "@/types/workspace";
import type { ApiError } from "@/lib/api/client";

export function useCreateWorkspace(orgId: string) {
  const queryClient = useQueryClient();

  return useMutation<Workspace, ApiError, Omit<CreateWorkspacePayload, "slug">>(
    {
      mutationFn: (payload: Omit<CreateWorkspacePayload, "slug">) =>
        workspacesApi.create(orgId, {
          ...payload,
          slug: generateSlug(payload.name),
        }),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["organizations", orgId, "workspaces"],
        });
      },
    },
  );
}
