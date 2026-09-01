import { useSearchParams } from "react-router-dom";

export function useUrlParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  function updateParams(changes: Record<string, string | null>) {
    const next = new URLSearchParams(searchParams);
    Object.entries(changes).forEach(([key, value]) => {
      if (value === null) {
        next.delete(key);
      } else {
        next.set(key, value);
      }
    });
    setSearchParams(next);
  }

  return { searchParams, updateParams };
}
