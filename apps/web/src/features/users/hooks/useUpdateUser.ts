import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userApi } from "../api";
import type { UpdateUserPayload } from "../types";
import type { UserData } from "@/types/user";
import type { ApiError } from "@/lib/api/client";

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation<UserData, ApiError, UpdateUserPayload>({
    mutationFn: (payload: UpdateUserPayload) =>
      userApi.updateUserProfile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", "me"] });
    },
  });
};
