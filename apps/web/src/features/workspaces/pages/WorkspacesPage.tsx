import PageHeader from "@/components/PageHeader";
import CreateWorkspaceDialog from "../components/CreateWorkspaceDialog";
import { useWorkspaces } from "../hooks/useWorkspaces";
import EmptyState from "@/components/EmptyState";
import { Layers, Search } from "lucide-react";
import { useActiveOrganization } from "@/features/organizations/hooks/useActiveOrganization";
import WorkspaceCard from "../components/WorkspaceCard";
import { Input } from "@/components/ui/input";
import ErrorState from "@/components/ErrorState";
import { DEFAULT_PAGE, DEFAULT_TABLE_LIMIT } from "@/constants";
import { useState } from "react";
import PaginationControls from "@/components/PaginationControls";
import { useParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import WorkspaceCardSkeleton from "../components/WorkspaceCardSkeleton";

const WorkspacesPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [page, setPage] = useState(DEFAULT_PAGE);
  const [limit, setLimit] = useState(DEFAULT_TABLE_LIMIT);
  const { orgSlug } = useParams<{ orgSlug: string }>();
  const { activeOrganization } = useActiveOrganization();

  const {
    data: workspaces,
    isLoading,
    isError,
    refetch,
    isFetching,
    isPlaceholderData,
  } = useWorkspaces(orgSlug ?? null, {
    page,
    limit,
  });

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

      {!isLoading && !isError && workspaces?.data.length === 0 && (
        <EmptyState
          title="No workspaces yet"
          description="Create a workspace to organize projects for a team or initiative."
          btnCaption="New workspace"
          icon={Layers}
          onOpenChange={() => setIsOpen(true)}
        />
      )}

      {!isLoading && !isError && (workspaces?.data.length ?? 0) > 0 && (
        <>
          <div
            className={cn(
              "grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
              isPlaceholderData ? "opacity-60 pointer-events-none" : "",
            )}
          >
            {workspaces?.data.map((workspace) => (
              <WorkspaceCard key={workspace.id} {...workspace} />
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
            totalPages={workspaces!.meta.totalPages}
            totalItems={workspaces!.meta.total}
          />
        </>
      )}
    </PageHeader>
  );
};

export default WorkspacesPage;
