import { useMutation, useQueryClient } from "@tanstack/react-query";
import { organizationsApi } from "../api";
import type { UpdateOrganizationPayload } from "../types";
import type { Organization } from "@/types/organization";
import type { ApiError } from "@/lib/api/client";

export function useUpdateOrganization(orgSlug: string) {
  const queryClient = useQueryClient();

  return useMutation<Organization, ApiError, UpdateOrganizationPayload>({
    mutationFn: (payload: UpdateOrganizationPayload) =>
      organizationsApi.update(orgSlug, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
    },
  });
}
