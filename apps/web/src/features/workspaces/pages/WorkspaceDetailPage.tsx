import { useState } from "react";
import { useParams } from "react-router-dom";
import { useWorkspace } from "../hooks/useWorkspace";
import { Activity, Layers, Users } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import WorkspaceOverview from "../components/WorkspaceOverview";
import WorkspaceProjects from "../components/WorkspaceProjects";
import { cn, getIdentityColor } from "@/lib/utils";
import ErrorState from "@/components/ErrorState";
import WorkspaceDetailSkeleton from "../components/WorkspaceDetailSkeleton";
import CreateProjectDialog from "@/features/projects/components/CeateProjectDialog";
import { usePaginationState } from "@/hooks/usePaginationState";
import WorkspaceMembersTable from "../components/WorkspaceMembersTable";
import { useWorkspaceMembers } from "../hooks/useWorkspaceMembers";

const WorkspaceDetailPage = () => {
  const { page, limit, setPage, handlePageSizeChange } = usePaginationState();
  const [isOpen, setIsOpen] = useState(false);
  const { orgSlug, workspaceSlug } = useParams<{
    orgSlug: string;
    workspaceSlug: string;
  }>();

  const {
    data: workspace,
    isLoading: isWorkspaceLoading,
    isError: isWorkspaceError,
    refetch: refetchWorkspace,
    isFetching: isWorkspaceFetching,
  } = useWorkspace(orgSlug ?? null, workspaceSlug ?? null);

  const {
    data: members,
    isError: isMembersError,
    refetch: refetchMembers,
    isFetching: isMembersFetching,
    isPlaceholderData: isMembersPlaceholderData,
  } = useWorkspaceMembers(orgSlug ?? null, workspaceSlug ?? null, {
    page,
    limit,
  });

  if (isWorkspaceLoading) {
    return <WorkspaceDetailSkeleton />;
  }

  if (isWorkspaceError || !workspace) {
    return (
      <ErrorState
        title="Couldn't load this workspace"
        description="We couldn't reach the workspace data. Please try again."
        onRetry={refetchWorkspace}
        isRetrying={isWorkspaceFetching}
        className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
      />
    );
  }

  if (!orgSlug || !workspaceSlug) return null;

  const color = getIdentityColor(workspace.id);

  return (
    <section className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col items-baseline gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <div
              className={cn(
                "mt-2 size-2.5 shrink-0 rounded-full ring-1 ring-black/5 dark:ring-white/10",
                color.bg,
              )}
            />

            <div className="min-w-0 space-y-1.5">
              <h1 className="truncate text-2xl font-semibold tracking-tight text-foreground">
                {workspace.name}
              </h1>

              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
                <span>
                  {workspace.projectCount}{" "}
                  {workspace.projectCount === 1 ? "project" : "projects"}
                </span>
                <span className="text-muted-foreground/40">•</span>
                <span>
                  {workspace.openTaskCount}{" "}
                  {workspace.openTaskCount === 1 ? "open task" : "open tasks"}
                </span>
                <span className="text-muted-foreground/40">•</span>
                <span>
                  {workspace.memberCount}{" "}
                  {workspace.memberCount === 1 ? "member" : "members"}
                </span>
              </div>
            </div>
          </div>

          <CreateProjectDialog
            open={isOpen}
            onOpenChange={setIsOpen}
            orgSlug={orgSlug}
            workspaceSlug={workspaceSlug}
          />
        </div>

        <Tabs defaultValue="overview" className="flex flex-col">
          <TabsList variant="line" className="w-fit">
            <TabsTrigger value="overview" className="gap-1.5">
              <Activity className="size-3.5" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="projects" className="gap-1.5">
              <Layers className="size-3.5" />
              Projects
            </TabsTrigger>
            <TabsTrigger value="members" className="gap-1.5">
              <Users className="size-3.5" />
              Members
            </TabsTrigger>
          </TabsList>

          <Separator className="-mt-2" />

          <TabsContent
            value="overview"
            className="mt-6 focus-visible:outline-none"
          >
            <WorkspaceOverview
              activeProjects={workspace.projectCount ?? 0}
              totalTasks={workspace.totalTaskCount ?? 0}
              openTasks={workspace.openTaskCount ?? 0}
              completedTasks={workspace.completedTaskCount ?? 0}
            />
          </TabsContent>

          <TabsContent
            value="projects"
            className="mt-6 focus-visible:outline-none"
          >
            <WorkspaceProjects />
          </TabsContent>

          <TabsContent
            value="members"
            className="mt-6 focus-visible:outline-none"
          >
            {members?.data && (members?.data.length ?? 0) > 0 ? (
              <WorkspaceMembersTable
                members={members}
                isError={isMembersError}
                isFetching={isMembersFetching}
                isPlaceholderData={isMembersPlaceholderData}
                refetch={refetchMembers}
                page={page}
                limit={limit}
                onPageChange={setPage}
                onPageSizeChange={(size) => handlePageSizeChange(size)}
              />
            ) : (
              <div className="min-h-32 rounded-xl border border-dashed border-border bg-muted/20 px-3 py-8 text-center">
                <p className="text-sm font-medium text-foreground">
                  No contributors found
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  No one is assigned to tasks here yet.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default WorkspaceDetailPage;
