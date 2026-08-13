import { useMutation, useQueryClient } from "@tanstack/react-query";
import { organizationsApi } from "../api";

export function useDeleteOrganization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orgSlug: string) => organizationsApi.delete(orgSlug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
    },
  });
}
