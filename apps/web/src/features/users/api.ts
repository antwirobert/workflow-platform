import { apiClient } from "@/lib/api/client";
import type { UpdateUserPayload } from "./types";
import type { UserData } from "@/types/user";

export const userApi = {
  getUserProfile: () => apiClient.get<UserData>("/api/users/me"),
  updateUserProfile: (paylaod: UpdateUserPayload) =>
    apiClient.patch<UserData>("/api/users/me", paylaod),
};
