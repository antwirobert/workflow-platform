import { useMutation } from "@tanstack/react-query";
import { authApi } from "../api";
import { useAuthStore } from "@/stores/authStore";
import type { User } from "@/types/user";
import type { ApiError } from "@/lib/api/client";
import type { LoginPayload } from "../types";

export function useLogin() {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation<User, ApiError, LoginPayload>({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      setAuth(data);
    },
  });
}
