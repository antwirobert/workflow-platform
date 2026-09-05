import { useState } from "react";
import { calculateProgressPercentage, getIdentityColor } from "@/lib/utils";
import { useProject } from "../hooks/useProject";
import { useParams } from "react-router-dom";
import TasksPage from "@/features/tasks/pages/TasksPage";
import { Skeleton } from "@/components/ui/skeleton";
import ErrorState from "@/components/ErrorState";
import CreateTaskDialog from "@/features/tasks/components/CreateTaskDialog";
import TextAvatar from "@/components/TextAvatar";
import { useProjectAssignees } from "../hooks/useProjectAssignees";
import { DEFAULT_PAGE, SELECT_ITEMS_LIMIT } from "@/constants";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ellipsis, Lock, Pencil, Trash2 } from "lucide-react";
import { useActiveOrganization } from "@/features/organizations/hooks/useActiveOrganization";
import { Button } from "@/components/ui/button";
import EditProjectDialog from "../components/EditProjectDialog";
import DeleteProjectDialog from "../components/DeleteProjectDialog";
import ProgressBar from "@/components/ProgressBar";

const ProjectTasksPage = () => {
  const [isTaskOpen, setisTaskOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const { orgSlug, workspaceSlug, projectSlug } = useParams<{
    orgSlug: string;
    workspaceSlug: string;
    projectSlug: string;
  }>();

  const { activeOrganization } = useActiveOrganization();

  const {
    data: project,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useProject(orgSlug ?? null, workspaceSlug ?? null, projectSlug ?? null);

  const { data: projectAssignees } = useProjectAssignees(
    orgSlug ?? null,
    workspaceSlug ?? null,
    projectSlug ?? null,
    {
      page: DEFAULT_PAGE,
      limit: SELECT_ITEMS_LIMIT,
    },
  );

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

  const isPriviledged = activeOrganization?.role ?? "";
  const color = getIdentityColor(project.id);
  const total = project.totalTaskCount ?? 0;
  const completed = project.completedTaskCount ?? 0;
  const progressPercentage = calculateProgressPercentage(total, completed);

  return (
    <section className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-xl space-y-1.5">
            <div className="flex items-center gap-3">
              <TextAvatar
                name={project.name}
                colorClass={color.bg}
                textClass={color.text}
                className="size-8 rounded-lg text-xs font-semibold"
              />
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

          <div className="flex gap-0.5">
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="outline"
                    size="icon"
                    className="size-8 shrink-0 data-[state=open]:opacity-100"
                  >
                    <Ellipsis className="size-4" />
                  </Button>
                }
              />
              <DropdownMenuContent className="w-52 p-1" align="end">
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() => setIsEditOpen(true)}
                    disabled={!isPriviledged}
                    className="cursor-pointer gap-2 rounded-md px-2 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-100"
                  >
                    {isPriviledged ? (
                      <>
                        <Pencil className="size-3.5 text-muted-foreground" />
                        Edit project
                      </>
                    ) : (
                      <div className="flex items-start gap-2 py-0.5">
                        <Lock className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
                        <div className="flex flex-col gap-0.5">
                          <span className="text-sm text-muted-foreground">
                            Edit project
                          </span>
                          <span className="text-[11px] leading-snug text-muted-foreground/70">
                            Only the creator, an admin, or the owner can edit
                            this project
                          </span>
                        </div>
                      </div>
                    )}
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => setIsDeleteOpen(true)}
                    disabled={!isPriviledged}
                    className={
                      isPriviledged
                        ? "cursor-pointer gap-2 rounded-md px-2 py-1.5 text-sm text-destructive focus:bg-destructive/10 focus:text-destructive [&_svg]:text-destructive"
                        : "cursor-not-allowed gap-2 rounded-md px-2 py-1.5 text-sm disabled:opacity-100"
                    }
                    variant="destructive"
                  >
                    {isPriviledged ? (
                      <>
                        <Trash2 className="size-3.5" />
                        Delete project
                      </>
                    ) : (
                      <div className="flex items-start gap-2 py-0.5">
                        <Lock className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
                        <div className="flex flex-col gap-0.5">
                          <span className="text-sm text-muted-foreground">
                            Delete project
                          </span>
                          <span className="text-[11px] leading-snug text-muted-foreground/70">
                            Only the creator, an admin, or the owner can delete
                            this project
                          </span>
                        </div>
                      </div>
                    )}
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            <EditProjectDialog
              name={project.name}
              description={project.description ?? ""}
              projectSlug={project.slug}
              open={isEditOpen}
              onOpenChange={setIsEditOpen}
            />

            <DeleteProjectDialog
              name={project.name}
              projectSlug={project.slug}
              open={isDeleteOpen}
              onOpenChange={setIsDeleteOpen}
            />

            <CreateTaskDialog
              open={isTaskOpen}
              onOpenChange={setisTaskOpen}
              orgSlug={orgSlug}
              workspaceSlug={workspaceSlug}
              projectSlug={projectSlug}
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-5">
          {(projectAssignees?.data.length ?? 0) > 0 && (
            <div className="flex -space-x-2">
              {projectAssignees?.data.slice(0, 5).map((assignee) => {
                const color = getIdentityColor(assignee.id);

                return (
                  <TextAvatar
                    key={assignee.id}
                    name={assignee.name}
                    colorClass={color.bg}
                    textClass={color.text}
                    className="size-7 rounded-full text-[10px] font-semibold ring-2 ring-card"
                  />
                );
              })}

              {(projectAssignees?.data.length ?? 0) > 5 && (
                <div className="flex size-7 items-center justify-center rounded-full bg-muted text-[10px] font-medium text-muted-foreground ring-2 ring-card">
                  +{(projectAssignees?.data.length ?? 0) - 5}
                </div>
              )}
            </div>
          )}

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-medium text-muted-foreground">
              Progress
            </span>
            <div className="w-24">
              <ProgressBar progress={progressPercentage} />
            </div>
            <span className="text-[11px] tabular-nums text-muted-foreground">
              {progressPercentage}%
            </span>
          </div>
        </div>

        <TasksPage
          open={isTaskOpen}
          onOpenChange={setisTaskOpen}
          orgSlug={orgSlug}
          workspaceSlug={workspaceSlug}
          projectSlug={projectSlug}
        />
      </div>
    </section>
  );
};

export default ProjectTasksPage;
