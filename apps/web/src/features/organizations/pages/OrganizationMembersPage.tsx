import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { useOrganization } from "../hooks/useOrganization";
import { useParams } from "react-router-dom";
import ErrorState from "@/components/ErrorState";
import { Badge } from "@/components/ui/badge";
import MembersTable from "../components/MembersTable";
import OrganizationSkeleton from "../components/OrganizationSkeleton";
import { useOrganizationMembers } from "../hooks/useOrganizationMembers";
import MemberFilters from "../components/MemberFilters";
import { usePagination } from "@/hooks/usePagination";
import { useOrganizationMemberFilters } from "../hooks/useOrganizationMemberFilters";

const OrganizationMembersPage = () => {
  const { page, limit, onPageChange, onPageSizeChange } = usePagination();
  const { search, role, onSearchChange, onRoleChange } =
    useOrganizationMemberFilters();

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
    isError: isMembersError,
    isFetching: isMembersFetching,
    isPlaceholderData: isMembersPlaceholderData,
    refetch: membersRefetch,
  } = useOrganizationMembers(
    orgSlug ?? null,
    {
      page,
      limit,
      role: role === "ALL" ? undefined : role,
    },
    search || undefined,
  );

  const hasFilters = Boolean(search.trim() || role);
  const isEmpty = !isMembersFetching && (members?.data.length ?? 0) === 0;

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

        <MemberFilters
          role={role}
          onRoleChange={(value) => onRoleChange(value)}
          search={search}
          onSearchChange={(value) => onSearchChange(value)}
        />

        {hasFilters && isEmpty && (
          <div className="flex min-h-32 items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 px-6 text-center">
            <div>
              <p className="text-sm font-medium text-foreground">No matches</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Try a different search or role filter.
              </p>
            </div>
          </div>
        )}

        {members?.data && (members?.data.length ?? 0) > 0 && (
          <MembersTable
            members={members}
            isError={isMembersError}
            isFetching={isMembersFetching}
            isPlaceholderData={isMembersPlaceholderData}
            refetch={membersRefetch}
            page={page}
            limit={limit}
            onPageChange={(newPage) => onPageChange(newPage)}
            onPageSizeChange={(size) => onPageSizeChange(size)}
          />
        )}
      </div>
    </section>
  );
};

export default OrganizationMembersPage;
