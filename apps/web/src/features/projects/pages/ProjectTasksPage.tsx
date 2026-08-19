import { useState } from "react";
import { cn, getIdentityColor, getInitials } from "@/lib/utils";
import { useProject } from "../hooks/useProject";
import { useParams } from "react-router-dom";
import TasksPage from "@/features/tasks/pages/TasksPage";
import { Skeleton } from "@/components/ui/skeleton";
import ErrorState from "@/components/ErrorState";
import CreateTaskDialog from "@/features/tasks/components/CreateTaskDialog";

const ProjectTasksPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { orgSlug, workspaceSlug, projectSlug } = useParams<{
    orgSlug: string;
    workspaceSlug: string;
    projectSlug: string;
  }>();

  const {
    data: project,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useProject(orgSlug ?? null, workspaceSlug ?? null, projectSlug ?? null);

  if (!orgSlug || !workspaceSlug || !projectSlug) return null;

  if (isLoading) {
    return (
      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
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
      <ErrorState
        title="Couldn't load this project"
        description="We couldn't reach the project data. Please try again."
        onRetry={refetch}
        isRetrying={isFetching}
        className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
      />
    );
  }

  const color = getIdentityColor(project.id);

  return (
    <section className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
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

          <CreateTaskDialog
            open={isOpen}
            onOpenChange={setIsOpen}
            orgSlug={orgSlug}
            workspaceSlug={workspaceSlug}
            projectSlug={projectSlug}
          />
        </div>

        <TasksPage
          orgSlug={orgSlug}
          workspaceSlug={workspaceSlug}
          projectSlug={projectSlug}
        />
      </div>
    </section>
  );
};

export default ProjectTasksPage;
