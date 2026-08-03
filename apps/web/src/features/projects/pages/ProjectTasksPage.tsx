import { Button } from "@/components/ui/button";
import { cn, getIdentityColor, getInitials } from "@/lib/utils";
import { useProject } from "../hooks/useProject";
import { useParams } from "react-router-dom";
import { useActiveOrganization } from "@/features/organizations/hooks/useActiveOrganization";
import { useWorkspaceStore } from "@/stores/workspaceStore";
import {
  Ellipsis,
  Loader2,
  Plus,
  RefreshCw,
  TriangleAlert,
} from "lucide-react";
import TasksPage from "@/features/tasks/pages/TasksPage";
import { Skeleton } from "@/components/ui/skeleton";

const ProjectTasksPage = () => {
  const { activeOrganization } = useActiveOrganization();
  const activeWorkspaceId = useWorkspaceStore(
    (state) => state.activeWorkspaceId,
  );
  const { projectId } = useParams<{ projectId: string }>();

  const {
    data: project,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useProject(
    activeOrganization?.id ?? null,
    activeWorkspaceId ?? null,
    projectId ?? null,
  );

  if (!activeOrganization || !activeWorkspaceId || !projectId) return null;

  if (isLoading) {
    return (
      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-xl space-y-3">
              <div className="flex items-center gap-3">
                <Skeleton className="size-8 shrink-0 rounded-lg" />
                <Skeleton className="h-6 w-40" />
              </div>
              <Skeleton className="h-4 w-72" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="size-9 rounded-md" />
              <Skeleton className="h-9 w-28 rounded-md" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (isError || !project) {
    return (
      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-destructive/20 bg-destructive/5 px-6 py-10 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
              <TriangleAlert className="h-6 w-6 text-destructive" />
            </div>
            <h3 className="text-base font-semibold text-foreground">
              Couldn't load this project
            </h3>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              We hit a snag reaching the projects service. Try again in a
              moment.
            </p>
            <Button
              variant="destructive"
              onClick={() => refetch()}
              className="mt-2 text-white bg-destructive hover:bg-destructive/90"
              disabled={isFetching}
            >
              {isFetching ? (
                <>
                  <Loader2 className="mr- h-4 w-4 animate-spin" /> Retrying...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-1 h-4 w-4" /> Retry
                </>
              )}
            </Button>
          </div>
        </div>
      </section>
    );
  }

  const color = getIdentityColor(project.id);

  return (
    <section className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-xl space-y-1.5">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-lg text-xs font-semibold",
                  color.bg,
                  color.text,
                )}
              >
                {getInitials(project.name)}
              </div>
              <h1 className="truncate text-xl font-semibold tracking-tight text-foreground">
                {project.name}
              </h1>
            </div>

            {project.description && (
              <p className="text-sm leading-relaxed text-muted-foreground">
                {project.description}
              </p>
            )}
          </div>

          <div className="flex items-center shrink-0 gap-2">
            <Button variant="outline" size="icon" className="size-9">
              <Ellipsis className="size-4" />
            </Button>
            <Button className="gap-1.5">
              <Plus className="size-4" />
              New Task
            </Button>
          </div>
        </div>

        <TasksPage />
      </div>
    </section>
  );
};

export default ProjectTasksPage;
