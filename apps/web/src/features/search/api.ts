import { apiClient } from "@/lib/api/client";
import type { SearchParams, SearchResults } from "./types";

export const searchApi = {
  search: (orgSlug: string, params: SearchParams) =>
    apiClient.get<SearchResults>(`/api/organizations/${orgSlug}/search/`, {
      params: {
        q: params.query,
        ...(params.type ? { type: params.type } : {}),
      },
    }),
};
