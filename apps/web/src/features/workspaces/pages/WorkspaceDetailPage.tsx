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
import MembersTable from "@/features/organizations/components/MembersTable";

const WorkspaceDetailPage = () => {
  const [isOpen, setIsOpen] = useState(false);

  const { orgSlug, workspaceSlug } = useParams<{
    orgSlug: string;
    workspaceSlug: string;
  }>();

  const {
    data: workspace,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useWorkspace(orgSlug ?? null, workspaceSlug ?? null);

  if (isLoading) {
    return <WorkspaceDetailSkeleton />;
  }

  if (isError || !workspace) {
    return (
      <ErrorState
        title="Couldn't load this workspace"
        description="We couldn't reach the workspace data. Please try again."
        onRetry={refetch}
        isRetrying={isFetching}
        className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
      />
    );
  }

  if (!orgSlug || !workspaceSlug) return null;

  const color = getIdentityColor(workspace.id);

  return (
    <section className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
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
                  {workspace.taskCount}{" "}
                  {workspace.taskCount === 1 ? "open task" : "open tasks"}
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
            <WorkspaceOverview />
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
            <MembersTable />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default WorkspaceDetailPage;
