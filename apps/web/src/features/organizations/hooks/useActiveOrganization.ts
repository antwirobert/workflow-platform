import { useOrgStore } from "@/stores/orgStore";
import { useOrganizations } from "./useOrganizations";
import { useEffect } from "react";

export function useActiveOrganization() {
  const { data: organizations } = useOrganizations();
  const activeOrgSlug = useOrgStore((state) => state.activeOrgSlug);
  const setActiveOrgSlug = useOrgStore((state) => state.setActiveOrgSlug);

  console.log(organizations);

  useEffect(() => {
    if (!organizations || organizations.length === 0) return;

    const stillValid = organizations.some((org) => org.slug === activeOrgSlug);
    if (!activeOrgSlug || !stillValid) {
      setActiveOrgSlug(organizations[0].slug);
    }
  }, [activeOrgSlug, organizations, setActiveOrgSlug]);

  const activeOrganization =
    organizations?.find((org) => org.slug === activeOrgSlug) ?? null;

  return { organizations, activeOrganization };
}
