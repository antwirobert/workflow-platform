import PageHeader from "@/components/PageHeader";
import CreateWorkspaceDialog from "../components/CreateWorkspaceDialog";
import { useWorkspaces } from "../hooks/useWorkspaces";
import EmptyState from "@/components/EmptyState";
import { Layers, Search } from "lucide-react";
import { useActiveOrganization } from "@/features/organizations/hooks/useActiveOrganization";
import WorkspaceCard from "../components/WorkspaceCard";
import { Input } from "@/components/ui/input";
import ErrorState from "@/components/ErrorState";
import { useState } from "react";
import PaginationControls from "@/components/PaginationControls";
import { useParams } from "react-router-dom";
import WorkspaceCardSkeleton from "../components/WorkspaceCardSkeleton";
import { usePagination } from "@/hooks/usePagination";
import { useWorkspaceFilters } from "../hooks/useWorkspaceFilters";

const WorkspacesPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { page, limit, onPageChange, onPageSizeChange } = usePagination();
  const { search, onSearchChange } = useWorkspaceFilters();

  const { orgSlug } = useParams<{ orgSlug: string }>();
  const { activeOrganization } = useActiveOrganization();

  const {
    data: workspaces,
    isLoading,
    isError,
    refetch,
    isFetching,
    isPlaceholderData,
  } = useWorkspaces(
    orgSlug ?? null,
    {
      page,
      limit,
    },
    search || undefined,
  );

  if (!activeOrganization) return;

  return (
    <PageHeader
      title="Workspaces"
      description={`Workspaces inside ${activeOrganization.name}. Group projects by team or initiative.`}
      action={
        <CreateWorkspaceDialog
          open={isOpen}
          onOpenChange={setIsOpen}
          orgSlug={orgSlug!}
          role={activeOrganization.role}
        />
      }
    >
      <div className="relative mb-5">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search workspaces..."
          className="w-full pl-9 pr-3 bg-muted/50 focus:bg-background transition"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {isLoading && <WorkspaceCardSkeleton />}

      {!isLoading && isError && (
        <ErrorState
          title="Couldn't load workspaces"
          description="We hit a snag reaching the workspaces service. Try again in a moment."
          onRetry={refetch}
          isRetrying={isFetching}
        />
      )}

      {!search.trim() &&
        !isLoading &&
        !isError &&
        workspaces?.data.length === 0 && (
          <EmptyState
            title="No workspaces yet"
            description="Create a workspace to organize projects for a team or initiative."
            btnCaption="New workspace"
            icon={Layers}
            onOpenChange={() => setIsOpen(true)}
          />
        )}

      {search.trim() && !isFetching && workspaces?.data.length === 0 && (
        <div className="flex min-h-32 items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 px-6 text-center">
          <div className="flex flex-col items-center justify-center">
            <Search className="text-muted-foreground text-center mb-3" />
            <p className="text-sm font-medium text-foreground">
              No workspaces match
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Nothing matches "{search}". Try a different name.
            </p>
          </div>
        </div>
      )}

      {!isLoading && !isError && (workspaces?.data.length ?? 0) > 0 && (
        <>
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {workspaces?.data.map((workspace) => (
              <WorkspaceCard key={workspace.id} {...workspace} />
            ))}
          </div>

          <PaginationControls
            currentPage={page}
            limit={limit}
            onPageChange={(newPage) => onPageChange(newPage)}
            onPageSizeChange={(size) => onPageSizeChange(size)}
            totalPages={workspaces!.meta.totalPages}
            totalItems={workspaces!.meta.total}
            isPlaceholderData={isPlaceholderData}
          />
        </>
      )}
    </PageHeader>
  );
};

export default WorkspacesPage;
