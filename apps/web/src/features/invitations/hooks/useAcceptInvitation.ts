import { useMutation, useQueryClient } from "@tanstack/react-query";
import { invitationsApi } from "../api";

export function useAcceptInvitation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (token: string) => invitationsApi.accept({ token }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
    },
  });
}
