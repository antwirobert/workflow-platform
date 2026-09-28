import { queryClient } from "@/app/queryClient";
import { workspacesApi } from "./api";
import type { LoaderFunctionArgs } from "react-router-dom";
import { throwIfNotFound } from "@/lib/api/throwIfNotFound";

export function workspaceLoader({ params }: LoaderFunctionArgs) {
  try {
    return queryClient.ensureQueryData({
      queryKey: [
        "organizations",
        params.orgSlug,
        "workspaces",
        params.workspaceSlug,
      ],
      queryFn: () =>
        workspacesApi.getById(
          params.orgSlug as string,
          params.workspaceSlug as string,
        ),
    });
  } catch (error) {
    throwIfNotFound(error, "Workspace");
  }
}
