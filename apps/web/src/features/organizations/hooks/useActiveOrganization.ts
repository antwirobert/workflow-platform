import { useOrgStore } from "@/stores/orgStore";
import { useOrganizations } from "./useOrganizations";
import { useEffect } from "react";
import { DEFAULT_PAGE, DEFAULT_SIDEBAR_LIMIT } from "@/constants";

export function useActiveOrganization() {
  const { data: organizations } = useOrganizations({
    page: DEFAULT_PAGE,
    limit: DEFAULT_SIDEBAR_LIMIT,
  });
  const activeOrgId = useOrgStore((state) => state.activeOrgId);
  const setActiveOrgId = useOrgStore((state) => state.setActiveOrgId);

  useEffect(() => {
    if (!organizations?.data || organizations.data.length === 0) return;

    const stillValid = organizations.some((org) => org.slug === activeOrgSlug);
    if (!activeOrgSlug || !stillValid) {
      setActiveOrgSlug(organizations[0].slug);
    }
  }, [activeOrgSlug, organizations, setActiveOrgSlug]);

  const activeOrganization =
    organizations?.data.find((org) => org.id === activeOrgId) ?? null;

  return { organizations, activeOrganization };
}
