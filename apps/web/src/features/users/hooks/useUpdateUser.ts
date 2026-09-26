import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userApi } from "../api";
import type { UpdateUserPayload } from "../types";

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateUserPayload) =>
      userApi.updateUserProfile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", "me"] });
    },
  });
};
