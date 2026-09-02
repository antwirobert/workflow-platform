import { useOrgStore } from "@/stores/orgStore";
import { useOrganizations } from "./useOrganizations";
import { useEffect } from "react";
import { DEFAULT_PAGE, DEFAULT_SIDEBAR_LIMIT } from "@/constants";
import { useParams } from "react-router-dom";

export function useActiveOrganization() {
  const { orgSlug: routeOrgSlug } = useParams<{ orgSlug: string }>();
  const {
    data: organizations,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useOrganizations({
    page: DEFAULT_PAGE,
    limit: DEFAULT_SIDEBAR_LIMIT,
  });
  const lastVisitedOrgSlug = useOrgStore((state) => state.activeOrgSlug);
  const setLastVisitedOrgSlug = useOrgStore((state) => state.setActiveOrgSlug);

  const activeOrgSlug = routeOrgSlug ?? lastVisitedOrgSlug;

  useEffect(() => {
    if (routeOrgSlug && routeOrgSlug !== lastVisitedOrgSlug) {
      setLastVisitedOrgSlug(routeOrgSlug);
    }
  }, [routeOrgSlug, lastVisitedOrgSlug, setLastVisitedOrgSlug]);

  const activeOrganization =
    organizations?.data.find((org) => org.slug === activeOrgSlug) ?? null;

  return {
    organizations,
    activeOrganization,
    isLoading,
    isError,
    isFetching,
    refetch,
  };
}
