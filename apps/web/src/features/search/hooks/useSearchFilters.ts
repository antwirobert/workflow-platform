import { DEFAULT_PAGE } from "@/constants";
import { usePaginationState } from "@/hooks/usePaginationState";
import { useState } from "react";
import type { SearchType } from "../types";

export function useSearchFilters() {
  const { setPage } = usePaginationState();

  const [search, setSearch] = useState("");
  const [type, setType] = useState<SearchType | "ALL">("ALL");

  function onSearchChange(value: string) {
    setSearch(value);
    setPage(DEFAULT_PAGE);
  }

  function onTypeChange(value: SearchType | "ALL") {
    setType(value);
    setPage(DEFAULT_PAGE);
  }

  return { search, type, onSearchChange, onTypeChange };
}
