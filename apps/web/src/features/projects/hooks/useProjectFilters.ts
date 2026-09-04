import { DEFAULT_PAGE } from "@/constants";
import { useUrlParams } from "@/hooks/useUrlParams";

export function useProjectFilters() {
  const { searchParams, updateParams } = useUrlParams();

  const search = searchParams.get("q") ?? "";

  function onSearchChange(value: string) {
    updateParams({ q: value, page: String(DEFAULT_PAGE) });
  }

  return { search, onSearchChange };
}
