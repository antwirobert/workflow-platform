import { queryClient } from "@/app/queryClient";
import { workspacesApi } from "./api";
import type { LoaderFunctionArgs } from "react-router-dom";

export function workspaceLoader({ params }: LoaderFunctionArgs) {
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
}
