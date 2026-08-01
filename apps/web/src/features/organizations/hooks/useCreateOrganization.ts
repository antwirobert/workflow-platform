import { useMutation, useQueryClient } from "@tanstack/react-query";
import { organizationsApi } from "../api";
import { generateSlug } from "@/lib/utils";
import type { CreateOrganizationPayload } from "../types";
import type { Organization } from "@/types/organization";
import type { ApiError } from "@/lib/api/client";

export function useCreateOrganization() {
  const queryClient = useQueryClient();

  return useMutation<
    Organization,
    ApiError,
    Omit<CreateOrganizationPayload, "slug">
  >({
    mutationFn: (payload: Omit<CreateOrganizationPayload, "slug">) =>
      organizationsApi.create({
        ...payload,
        slug: generateSlug(payload.name),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
    },
  });
}
