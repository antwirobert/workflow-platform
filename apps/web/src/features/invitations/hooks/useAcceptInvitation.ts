import { useMutation } from "@tanstack/react-query";
import { invitationsApi } from "../api";

export function useAcceptInvitation() {
  return useMutation({
    mutationFn: (token: string) => invitationsApi.accept({ token }),
  });
}
