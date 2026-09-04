import { DEFAULT_PAGE, DEFAULT_TABLE_LIMIT } from "@/constants";
import { useUrlParams } from "./useUrlParams";

export function usePagination(defaultLimit = DEFAULT_TABLE_LIMIT) {
  const { searchParams, updateParams } = useUrlParams();

  const page = Number(searchParams.get("page") ?? String(DEFAULT_PAGE));
  const limit = Number(searchParams.get("limit") ?? String(defaultLimit));

  function onPageChange(newPage: number) {
    updateParams({ page: String(newPage) });
  }

  function onPageSizeChange(newLimit: number) {
    updateParams({ limit: String(newLimit), page: String(DEFAULT_PAGE) });
  }

  return { page, limit, onPageChange, onPageSizeChange };
}
