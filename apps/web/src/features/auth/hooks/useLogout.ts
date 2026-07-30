import { useMutation } from "@tanstack/react-query";
import { authApi } from "../api";
import { useAuthStore } from "@/stores/authStore";
import { useNavigate } from "react-router";
import { queryClient } from "@/app/queryClient";

export function useLogin() {
  const navigate = useNavigate();
  const clearAuth = useAuthStore((state) => state.clearAuth);

  return useMutation({
    mutationFn: authApi.logout,
    onSettled: () => {
      clearAuth();
      queryClient.clear();
      navigate("/login");
    },
  });
}
