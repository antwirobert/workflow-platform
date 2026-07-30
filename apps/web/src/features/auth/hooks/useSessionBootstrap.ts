import { useQuery } from "@tanstack/react-query";
import { authApi } from "../api";
import { useAuthStore } from "@/stores/authStore";

export function useSessionBootstrap() {
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const refreshToken = useAuthStore((state) => state.refreshToken);

  return useQuery({
    queryKey: ["session-bootstrap"],
    queryFn: async () => {
      if (!refreshToken) return null;
      try {
        const data = await authApi.me();
        return data;
      } catch {
        clearAuth();
        return null;
      }
    },
    retry: false,
    staleTime: Infinity,
  });
}
