import { apiClient } from "@/lib/api/client";
import type { User } from "@/types/user";
import type { LoginPayload, RegisterPayload } from "./types";

export const authApi = {
  register: (payload: RegisterPayload) =>
    apiClient.post<User>("/api/auth/register/", payload),
  login: (payload: LoginPayload) =>
    apiClient.post<User>("/api/auth/login/", payload),
  logout: () => apiClient.post<void>("/api/auth/logout/"),
  me: () => apiClient.get<User>("/api/auth/me/"),
};
