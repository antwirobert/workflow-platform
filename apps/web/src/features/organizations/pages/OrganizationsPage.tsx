import { useState } from "react";
import { useOrganizations } from "../hooks/useOrganizations";
import { Building2 } from "lucide-react";
import ErrorState from "@/components/ErrorState";
import EmptyState from "@/components/EmptyState";
import OrganizationCard from "../components/OrganizationCard";
import CreateOrganizationDialog from "../components/CreateOrganizationDialog";
import PageHeader from "@/components/PageHeader";
import PaginationControls from "@/components/PaginationControls";
import OrganizationCardSkeleton from "../components/OrganizationCardSkeleton";
import { usePagination } from "@/hooks/usePagination";

const OrganizationsPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { page, limit, onPageChange, onPageSizeChange } = usePagination();

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
          <div className="overflow-hidden rounded-lg border border-border/60 bg-card shadow-sm">
            {organizations!.data.map((org) => (
              <OrganizationCard key={org.id} {...org} />
            ))}
          </div>
          <PaginationControls
            currentPage={page}
            limit={limit}
            onPageChange={(newPage) => onPageChange(newPage)}
            onPageSizeChange={(size) => onPageSizeChange(size)}
            totalItems={organizations!.meta.total}
            totalPages={organizations!.meta.totalPages}
            isPlaceholderData={isPlaceholderData}
          />
        </>
      )}
    </PageHeader>
  );
};

export default OrganizationsPage;
