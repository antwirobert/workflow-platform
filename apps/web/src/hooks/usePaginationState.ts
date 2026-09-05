import { DEFAULT_PAGE, DEFAULT_TABLE_LIMIT } from "@/constants";
import { useState } from "react";

export function usePaginationState(
  initialPage = DEFAULT_PAGE,
  initialLimit = DEFAULT_TABLE_LIMIT,
) {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);

  function onPageSizeChange(newLimit: number) {
    setLimit(newLimit);
    setPage(DEFAULT_PAGE);
  }

  return { page, limit, setPage, onPageSizeChange };
}
