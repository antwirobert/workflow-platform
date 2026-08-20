import { useState } from "react";
import { useOrganizations } from "../hooks/useOrganizations";
import { Building2, Search } from "lucide-react";
import ErrorState from "@/components/ErrorState";
import EmptyState from "@/components/EmptyState";
import OrganizationCard from "../components/OrganizationCard";
import CreateOrganizationDialog from "../components/CreateOrganizationDialog";
import PageHeader from "@/components/PageHeader";
import PaginationControls from "@/components/PaginationControls";
import { DEFAULT_PAGE, DEFAULT_TABLE_LIMIT } from "@/constants";
import OrganizationCardSkeleton from "../components/OrganizationCardSkeleton";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const OrganizationsPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [page, setPage] = useState(DEFAULT_PAGE);
  const [limit, setLimit] = useState(DEFAULT_TABLE_LIMIT);
  const {
    data: organizations,
    isLoading,
    isError,
    refetch,
    isFetching,
    isPlaceholderData,
  } = useOrganizations({
    page,
    limit,
  });

  return (
    <PageHeader
      title="Organizations"
      description="Every org you belong to. Switch context or spin up a new one."
      action={
        <CreateOrganizationDialog open={isOpen} onOpenChange={setIsOpen} />
      }
    >
      <div className="relative mb-5">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search organizations..."
          className="w-full pl-9 pr-3 bg-muted/50 focus:bg-background transition"
        />
      </div>

      {isLoading && <OrganizationCardSkeleton />}

      {!isLoading && isError && (
        <ErrorState
          title="Couldn't load organizations"
          description="We hit a snag reaching the organizations service. Try again in a moment."
          onRetry={refetch}
          isRetrying={isFetching}
        />
      )}

      {!isLoading && !isError && (organizations?.data.length ?? 0) === 0 && (
        <EmptyState
          title="No organizations yet"
          description="Create your first organization to invite teammates and start collaborating."
          btnCaption="New organization"
          icon={Building2}
          onOpenChange={() => setIsOpen(true)}
        />
      )}

      {!isLoading && !isError && (organizations?.data.length ?? 0) > 0 && (
        <>
          <div
            className={cn(
              "overflow-hidden rounded-lg border border-border/60 bg-card shadow-sm",
              isPlaceholderData ? "opacity-60 pointer-events-none" : "",
            )}
          >
            {organizations!.data.map((org) => (
              <OrganizationCard key={org.id} {...org} />
            ))}
          </div>
          <PaginationControls
            currentPage={page}
            limit={limit}
            onPageChange={setPage}
            onPageSizeChange={(size) => {
              setLimit(size);
              setPage(DEFAULT_PAGE);
            }}
            totalItems={organizations!.meta.total}
            totalPages={organizations!.meta.totalPages}
          />
        </>
      )}
    </PageHeader>
  );
};

export default OrganizationsPage;
