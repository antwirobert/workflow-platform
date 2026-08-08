import { useOrganizations } from "../hooks/useOrganizations";
import { Building2 } from "lucide-react";
import ErrorState from "@/components/ErrorState";
import EmptyState from "@/components/EmptyState";
import OrganizationCard from "../components/OrganizationCard";
import { Skeleton } from "@/components/ui/skeleton";
import CreateOrganizationDialog from "../components/CreateOrganizationDialog";
import PageHeader from "@/components/PageHeader";
import { useState } from "react";
import PaginationControls from "@/components/PaginationControls";
import { DEFAULT_PAGE, DEFAULT_TABLE_LIMIT } from "@/constants";

const OrganizationsPage = () => {
  const [page, setPage] = useState(DEFAULT_PAGE);
  const [limit, setLimit] = useState(DEFAULT_TABLE_LIMIT);
  const {
    data: organizations,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useOrganizations({
    page,
    limit,
  });

  return (
    <PageHeader
      title="Organizations"
      description="Every org you belong to. Switch context or spin up a new one."
      action={<CreateOrganizationDialog />}
    >
      {organizations?.data && organizations.data.length === 0 && (
        <EmptyState
          title="No organizations yet"
          description="Create your first organization to invite teammates and start collaborating."
          btnCaption="New organization"
          icon={Building2}
        />
      )}

      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between gap-4 rounded-xl border border-border/60 bg-card p-4"
            >
              <div className="flex min-w-0 items-center gap-3.5">
                <Skeleton className="size-11 shrink-0 rounded-lg" />
                <div className="flex min-w-0 flex-col gap-1.5">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-5 w-14 rounded-md" />
                    <Skeleton className="h-5 w-16 rounded-md" />
                  </div>
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-1.5">
                <Skeleton className="h-8 w-20 rounded-md" />
                <Skeleton className="size-8 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      )}

      {isError && (
        <ErrorState
          title="Couldn't load organizations"
          description="We hit a snag reaching the organizations service. Try again in a moment."
          onRetry={refetch}
          isRetrying={isFetching}
        />
      )}

      {!isError && (organizations?.data.length ?? 0) > 0 && (
        <>
          <div className="space-y-3">
            {organizations!.data.map((org) => (
              <OrganizationCard key={org.id} {...org} />
            ))}
          </div>
          <PaginationControls
            currentPage={organizations!.meta.page}
            totalPages={organizations!.meta.totalPages}
            totalItems={organizations!.meta.total}
            onPageChange={setPage}
            onPageSizeChange={setLimit}
          />
        </>
      )}
    </PageHeader>
  );
};

export default OrganizationsPage;
