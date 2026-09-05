import { DEFAULT_PAGE } from "@/constants";
import { useUrlParams } from "@/hooks/useUrlParams";
import type { OrgRole } from "@/types/organization";

export function useOrganizationMemberFilters() {
  const { searchParams, updateParams } = useUrlParams();

  const search = searchParams.get("q") ?? "";
  const role = (searchParams.get("role") ?? "ALL") as OrgRole | "ALL";

  function onSearchChange(value: string) {
    updateParams({ q: value, page: String(DEFAULT_PAGE) });
  }

  function onRoleChange(value: OrgRole | "ALL") {
    updateParams({ role: value, page: String(DEFAULT_PAGE) });
  }

  return { search, role, onSearchChange, onRoleChange };
}
