import { useOrgStore } from "@/stores/orgStore";
import { useOrganizations } from "./useOrganizations";
import { useEffect } from "react";
import { DEFAULT_PAGE, DEFAULT_SIDEBAR_LIMIT } from "@/constants";

export function useActiveOrganization() {
  const { data: organizations } = useOrganizations({
    page: DEFAULT_PAGE,
    limit: DEFAULT_SIDEBAR_LIMIT,
  });
  const activeOrgSlug = useOrgStore((state) => state.activeOrgSlug);
  const setActiveOrgSlug = useOrgStore((state) => state.setActiveOrgSlug);

  useEffect(() => {
    if (!organizations?.data || organizations.data.length === 0) return;

    const stillValid = organizations.data.some(
      (org) => org.slug === activeOrgSlug,
    );
    if (!activeOrgSlug || !stillValid) {
      setActiveOrgSlug(organizations.data[0].slug);
    }
  }, [activeOrgSlug, organizations, setActiveOrgSlug]);

  const activeOrganization =
    organizations?.data.find((org) => org.slug === activeOrgSlug) ?? null;

  return { organizations, activeOrganization };
}
