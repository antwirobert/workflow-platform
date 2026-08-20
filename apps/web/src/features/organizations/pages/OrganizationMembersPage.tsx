import { Button } from "@/components/ui/button";
import { Search, UserPlus } from "lucide-react";
import { useOrganization } from "../hooks/useOrganization";
import { useParams } from "react-router-dom";
import ErrorState from "@/components/ErrorState";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import RoleFilter from "../components/RoleFilter";
import MembersTable from "../components/MembersTable";
import { useOrganizationMembers } from "../hooks/useOrganizationMembers";
import { useState } from "react";
import { DEFAULT_PAGE, DEFAULT_TABLE_LIMIT } from "@/constants";
import OrganizationSkeleton from "../components/OrganizationSkeleton";

const OrganizationMembersPage = () => {
  const [page, setPage] = useState(DEFAULT_PAGE);
  const [limit, setLimit] = useState(DEFAULT_TABLE_LIMIT);
  const { orgSlug } = useParams<{ orgSlug: string }>();
  const {
    data: organization,
    isLoading: isOrganizationloading,
    isError: isOrganizationError,
    isFetching: isOrganizationFetching,
    refetch: refetchOrganization,
  } = useOrganization(orgSlug ?? null);
  const {
    data: members,
    isLoading: isMembersLoaading,
    isError: isMembersError,
    isFetching: isMembersFetching,
    isPlaceholderData,
    refetch: refetchMembers,
  } = useOrganizationMembers(orgSlug ?? null, {
    page,
    limit,
  });

  if (isOrganizationloading) {
    return <OrganizationSkeleton />;
  }

  if (isOrganizationError || !organization) {
    return (
      <ErrorState
        title="Couldn't load this organization"
        description="We couldn't reach the organization data. Please try again."
        onRetry={refetchOrganization}
        isRetrying={isOrganizationFetching}
        className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
      />
    );
  }

  return (
    <section className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-xl space-y-1.5">
            <h1 className="truncate text-xl font-semibold tracking-tight text-foreground">
              {organization.name}
            </h1>

            <div className="flex flex-wrap items-center gap-x-1 gap-y-1 text-sm text-muted-foreground">
              <span>
                {organization.memberCount}{" "}
                {organization.memberCount === 1 ? "member" : "members"}
              </span>
              <span className="text-muted-foreground/40">•</span>
              <Badge
                variant="secondary"
                className="flex gap-[0.6px] h-5 shrink-0 rounded-md px-1.5 text-[11px] font-medium text-muted-foreground"
              >
                <span>/</span>
                {organization.slug}
              </Badge>
            </div>
          </div>
          <Button className="shrink-0 gap-1.5 self-start">
            <UserPlus className="size-4" />
            Invite members
          </Button>
        </div>

        <div className="mb-5 grid grid-cols-4 gap-2">
          <div className="col-span-3 relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by name or email"
              className="w-full pl-9 pr-3 bg-muted/50 focus:bg-background transition"
            />
          </div>

          <RoleFilter />
        </div>

        {!isMembersLoaading &&
          !isMembersError &&
          (members?.data.length ?? 0) > 0 && (
            <MembersTable
              members={members!}
              isError={isMembersError}
              isFetching={isMembersFetching}
              isPlaceholderData={isPlaceholderData}
              onRetry={refetchMembers}
              page={page}
              limit={limit}
              onPageChange={setPage}
              onPageSizeChange={(size) => {
                setLimit(size);
                setPage(DEFAULT_PAGE);
              }}
            />
          )}
      </div>
    </section>
  );
};

export default OrganizationMembersPage;
