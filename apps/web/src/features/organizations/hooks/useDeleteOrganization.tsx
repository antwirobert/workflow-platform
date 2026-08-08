import { useMutation, useQueryClient } from "@tanstack/react-query";
import { organizationsApi } from "../api";

export function useDeleteOrganization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orgId: string) => organizationsApi.delete(orgId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
    },
  });
}
