import { useMutation, useQueryClient } from "@tanstack/react-query";
import { organizationsApi } from "../api";
import { generateSlug } from "@/lib/utils";
import type { CreateOrganizationPayload } from "../types";

export function useCreateOrganization() {
  const queryClient = useQueryClient();

  return useMutation({
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
