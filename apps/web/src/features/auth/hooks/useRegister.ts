import { useMutation } from "@tanstack/react-query";
import { authApi } from "../api";
import { useAuthStore } from "@/stores/authStore";
import type { User } from "@/types/user";
import type { ApiError } from "@/lib/api/client";
import type { RegisterPayload } from "../types";

export function useRegister() {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation<User, ApiError, RegisterPayload>({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      setAuth(data);
    },
  });
}
