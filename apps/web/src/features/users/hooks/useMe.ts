import { useQuery } from "@tanstack/react-query";
import { userApi } from "../api";

export function useMe() {
  return useQuery({
    queryKey: ["user", "me"],
    queryFn: () => userApi.getUserProfile(),
  });
}
