import { useOrgStore } from "@/stores/orgStore";
import { useOrganizations } from "./useOrganizations";
import { useEffect } from "react";

const PAGE = 1;
const LIMIT = 5;

export function useActiveOrganization() {
  const { data: organizations } = useOrganizations({
    page: PAGE,
    limit: LIMIT,
  });
  const activeOrgId = useOrgStore((state) => state.activeOrgId);
  const setActiveOrgId = useOrgStore((state) => state.setActiveOrgId);

  console.log(organizations);

  useEffect(() => {
    if (!organizations?.data || organizations.data.length === 0) return;

    const stillValid = organizations.data.some((org) => org.id === activeOrgId);
    if (!activeOrgId || !stillValid) {
      setActiveOrgId(organizations.data[0].id);
    }
  }, [activeOrgId, organizations, setActiveOrgId]);

  const activeOrganization =
    organizations?.data.find((org) => org.id === activeOrgId) ?? null;

  return { organizations, activeOrganization };
}
