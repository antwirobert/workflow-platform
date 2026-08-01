import { useOrgStore } from "@/stores/orgStore";
import { useOrganizations } from "./useOrganizations";
import { useEffect } from "react";

export function useActiveOrganization() {
  const { data: organizations } = useOrganizations();
  const activeOrgId = useOrgStore((state) => state.activeOrgId);
  const setActiveOrgId = useOrgStore((state) => state.setActiveOrgId);

  useEffect(() => {
    if (!organizations || organizations.length === 0) return;

    const stillValid = organizations.some((org) => org.id === activeOrgId);
    if (!activeOrgId || !stillValid) {
      setActiveOrgId(organizations[0].id);
    }
  }, [activeOrgId, organizations, setActiveOrgId]);

  const activeOrganization =
    organizations?.find((org) => org.id === activeOrgId) ?? null;

  return { organizations, activeOrganization };
}
