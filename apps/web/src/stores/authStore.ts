import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: string | null;
  setAuth: (data: {
    accessToken: string;
    refreshToken: string;
    user: string;
  }) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      setAuth: ({ accessToken, refreshToken, user }) =>
        set({ accessToken, refreshToken, user }),
      clearAuth: () =>
        set({ accessToken: null, refreshToken: null, user: null }),
    }),
    { name: "auth-storage" },
  ),
);
