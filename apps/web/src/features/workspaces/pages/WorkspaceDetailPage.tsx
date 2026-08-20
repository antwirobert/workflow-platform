import { useState } from "react";
import { useParams } from "react-router-dom";
import { useWorkspace } from "../hooks/useWorkspace";
import { Button } from "@/components/ui/button";
import { Activity, Layers, Plus, Users } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import WorkspaceOverview from "../components/WorkspaceOverview";
import WorkspaceProjects from "../components/WorkspaceProjects";
import { cn, getIdentityColor } from "@/lib/utils";
import ErrorState from "@/components/ErrorState";
import { Skeleton } from "@/components/ui/skeleton";
import { useProjects } from "@/features/projects/hooks/useProjects";
import { DEFAULT_PAGE, DEFAULT_SUB_TABLE_LIMIT } from "@/constants";
import { useOrganizationMembers } from "@/features/organizations/hooks/useOrganizationMembers";

const WorkspaceDetailPage = () => {
  const [projectPage, setProjectPage] = useState(DEFAULT_PAGE);
  const [projectLimit, setProjectLimit] = useState(DEFAULT_SUB_TABLE_LIMIT);
  // const [memberLimit, setMemberLimit] = useState(DEFAULT_SUB_TABLE_LIMIT);
  const [memberPage, setMemberPage] = useState(1);
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

  const {
    data: projects,
    isError: isProjectsError,
    isFetching: isProjectsFetching,
    refetch: refetchProjects,
  } = useProjects(orgSlug ?? null, workspaceSlug ?? null, {
    page: projectPage,
    limit: projectLimit,
  });

  const {
    data: orgMembers,
    isError: isMembersError,
    isFetching: isMembersFetching,
    refetch: refetchMembers,
  } = useOrganizationMembers(orgSlug ?? null, {
    page: memberPage,
    limit: 10,
  });

  if (isLoading) {
    return (
      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-3">
              <Skeleton className="mt-2 size-2.5 shrink-0 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-7 w-48" />
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
            </div>
            <Skeleton className="h-9 w-32 rounded-md" />
          </div>

          <div className="flex items-center gap-4">
            <Skeleton className="h-8 w-24 rounded-md" />
            <Skeleton className="h-8 w-24 rounded-md" />
            <Skeleton className="h-8 w-24 rounded-md" />
          </div>
          <Skeleton className="mt-0 h-px w-full" />

          <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_280px]">
            <div className="min-w-0 space-y-8">
              <div className="space-y-3">
                <Skeleton className="h-3 w-28" />
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between gap-4 rounded-xl border border-border/60 bg-card p-4"
                  >
                    <div className="flex items-center gap-3.5">
                      <Skeleton className="size-10 shrink-0 rounded-lg" />
                      <div className="space-y-1.5">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-48" />
                      </div>
                    </div>
                    <div className="hidden flex-col items-end gap-1.5 sm:flex">
                      <Skeleton className="h-3 w-14" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-24 w-full rounded-xl" />
              </div>
            </div>

            <aside className="space-y-6">
              <div className="space-y-3">
                <Skeleton className="h-3 w-16" />
                <div className="space-y-3 rounded-xl border border-border/60 bg-card p-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                      <Skeleton className="size-8 shrink-0 rounded-full" />
                      <div className="space-y-1.5">
                        <Skeleton className="h-3.5 w-24" />
                        <Skeleton className="h-3 w-14" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* At a glance */}
              <div className="space-y-3">
                <Skeleton className="h-3 w-20" />
                <div className="space-y-2.5 rounded-xl border border-border/60 bg-card p-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <Skeleton className="h-3.5 w-24" />
                      <Skeleton className="h-3.5 w-6" />
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    );
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
                <span className="text-muted-foreground/40">·</span>
                <span>
                  {workspace.taskCount}{" "}
                  {workspace.taskCount === 1 ? "open task" : "open tasks"}
                </span>
                <span className="text-muted-foreground/40">·</span>
                <span>
                  {workspace.memberCount}{" "}
                  {workspace.memberCount === 1 ? "member" : "members"}
                </span>
              </div>
            </div>
          </div>

          <Button className="shrink-0 gap-1.5 self-start">
            <Plus className="size-4" />
            New Project
          </Button>
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
            {projects && orgMembers && (
              <WorkspaceOverview
                projects={projects}
                projectsError={isProjectsError}
                projectsFetching={isProjectsFetching}
                refetchProjects={refetchProjects}
                onProjectPageChange={setProjectPage}
                members={orgMembers}
                membersError={isMembersError}
                membersFetching={isMembersFetching}
                refetchMembers={refetchMembers}
                onMemberPageChange={setMemberPage}
              />
            )}
          </TabsContent>

          <TabsContent
            value="projects"
            className="mt-6 focus-visible:outline-none"
          >
            {projects && (
              <WorkspaceProjects
                projects={projects}
                projectsError={isProjectsError}
                projectsFetching={isProjectsFetching}
                refetchProjects={refetchProjects}
                onProjectPageChange={setProjectPage}
                onProjectPageSizeChange={setProjectLimit}
              />
            )}
          </TabsContent>

          <TabsContent
            value="members"
            className="mt-6 focus-visible:outline-none"
          >
            {/* {orgMembers && (
              <WorkspaceMembers
                members={orgMembers}
                membersError={isMembersError}
                membersFetching={isMembersFetching}
                refetchMembers={refetchMembers}
                onMemberPageChange={setMemberPage}
                onMemberPageSizeChange={setMemberLimit}
              />
            )} */}
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default WorkspaceDetailPage;
