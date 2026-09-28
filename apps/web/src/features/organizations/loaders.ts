import type { LoaderFunctionArgs } from "react-router";
import { queryClient } from "@/app/queryClient";
import { organizationsApi } from "./api";
import { throwIfNotFound } from "@/lib/api/throwIfNotFound";

export async function organizationLoader({ params }: LoaderFunctionArgs) {
  try {
    return await queryClient.ensureQueryData({
      queryKey: ["organizations", params.orgSlug],
      queryFn: () => organizationsApi.getById(params.orgSlug as string),
    });
  } catch (error) {
    throwIfNotFound(error, "Organization");
  }
}
