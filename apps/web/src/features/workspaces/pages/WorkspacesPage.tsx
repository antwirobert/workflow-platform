import PageHeader from "@/components/PageHeader";
import CreateWorkspaceDialog from "../components/CreateWorkspaceDialog";
import { useWorkspaces } from "../hooks/useWorkspaces";
import EmptyState from "@/components/EmptyState";
import { Layers, Search } from "lucide-react";
import { useActiveOrganization } from "@/features/organizations/hooks/useActiveOrganization";
import WorkspaceCard from "../components/WorkspaceCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import ErrorState from "@/components/ErrorState";
import { DEFAULT_PAGE, DEFAULT_TABLE_LIMIT } from "@/constants";
import { useState } from "react";
import PaginationControls from "@/components/PaginationControls";

const WorkspacesPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [page, setPage] = useState(DEFAULT_PAGE);
  const [limit, setLimit] = useState(DEFAULT_TABLE_LIMIT);
  const { activeOrganization } = useActiveOrganization();

  const {
    data: workspaces,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useWorkspaces(activeOrganization?.slug ?? null, {
    page,
    limit,
  });

  if (!activeOrganization) return null;

  return (
    <PageHeader
      title="Workspaces"
      description={`Workspaces inside ${activeOrganization?.name}. Group projects by team or initiative.`}
      action={
        <CreateWorkspaceDialog
          open={isOpen}
          onOpenChange={setIsOpen}
          orgSlug={activeOrganization && activeOrganization.slug}
        />
      }
    >
      {isLoading && (
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col gap-3 rounded-xl border border-border/60 bg-card p-4"
            >
              <div className="flex items-center gap-2.5">
                <Skeleton className="size-2.5 shrink-0 rounded-full" />
                <Skeleton className="h-4 w-28" />
              </div>
              <Skeleton className="h-3 w-24" />
              <div className="mt-1 flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <Skeleton className="size-3.5 shrink-0 rounded-sm" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="size-3.5 shrink-0 rounded-sm" />
                  <Skeleton className="h-3 w-28" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="size-3.5 shrink-0 rounded-sm" />
                  <Skeleton className="h-3 w-36" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="relative mb-5">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search workspaces..."
          className="w-full pl-9 pr-3 bg-muted/50 focus:bg-background transition"
        />
      </div>

      {isError && (
        <ErrorState
          title="Couldn't load workspaces"
          description="We hit a snag reaching the workspaces service. Try again in a moment."
          onRetry={refetch}
          isRetrying={isFetching}
        />
      )}

      {workspaces?.data && workspaces.data.length === 0 && (
        <EmptyState
          title="No workspaces yet"
          description="Create a workspace to organize projects for a team or initiative."
          btnCaption="New workspace"
          icon={Layers}
          onOpenChange={() => setIsOpen(true)}
        />
      )}

      {!isError && (workspaces?.data.length ?? 0) > 0 && (
        <>
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {workspaces?.data.map((workspace) => (
              <WorkspaceCard key={workspace.id} {...workspace} />
            ))}
          </div>

          <PaginationControls
            currentPage={workspaces!.meta.page}
            totalPages={workspaces!.meta.totalPages}
            totalItems={workspaces!.meta.total}
            onPageChange={setPage}
            onPageSizeChange={setLimit}
          />
        </>
      )}
    </PageHeader>
  );
};

export default WorkspacesPage;
