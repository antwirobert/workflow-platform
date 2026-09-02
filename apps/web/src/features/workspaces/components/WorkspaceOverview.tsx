import { Link, useParams } from "react-router-dom";
import PaginationControls from "@/components/PaginationControls";
import TextAvatar from "@/components/TextAvatar";
import ErrorState from "@/components/ErrorState";
import { useProjects } from "@/features/projects/hooks/useProjects";
import { useWorkspaceTasks } from "../hooks/useWorkspaceTasks";
import { useOrganizationMembers } from "@/features/organizations/hooks/useOrganizationMembers";
import { DEFAULT_TABLE_LIMIT } from "@/constants";
import { getIdentityColor, timeAgo } from "@/lib/utils";
import { usePaginationState } from "@/hooks/usePaginationState";
import WorkspaceTasksTable from "./WorkspaceTasksTable";
import ProgressBar from "./ProgressBar";

interface WorkspaceOverviewProps {
  activeProjects: number;
  totalTasks: number;
  openTasks: number;
  completedTasks: number;
}

const WorkspaceOverview = ({
  activeProjects,
  totalTasks,
  openTasks,
  completedTasks,
}: WorkspaceOverviewProps) => {
  const { page: projectPage, setPage: setProjectPage } = usePaginationState();
  const { page: taskPage, setPage: setTaskPage } = usePaginationState();
  const { page: memberPage, setPage: setMemberPage } = usePaginationState();

  const { orgSlug, workspaceSlug } = useParams<{
    orgSlug: string;
    workspaceSlug: string;
  }>();

  const {
    data: projects,
    isError: isProjectsError,
    isFetching: isProjectsFetching,
    isPlaceholderData: isProjectsPlaceholderData,
    refetch: refetchProjects,
  } = useProjects(orgSlug ?? null, workspaceSlug ?? null, {
    page: projectPage,
    limit: DEFAULT_TABLE_LIMIT,
  });

  const {
    data: tasks,
    isError: isTasksError,
    isFetching: isTasksFetching,
    isPlaceholderData: isTasksPlaceholderData,
    refetch: refetchTasks,
  } = useWorkspaceTasks(orgSlug ?? null, workspaceSlug ?? null, {
    page: taskPage,
    limit: DEFAULT_TABLE_LIMIT,
  });

  const {
    data: members,
    isError: isMembersError,
    isFetching: isMembersFetching,
    isPlaceholderData: isMembersPlaceholderData,
    refetch: refetchMembers,
  } = useOrganizationMembers(orgSlug ?? null, {
    page: memberPage,
    limit: DEFAULT_TABLE_LIMIT,
  });

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
      {/* Main column */}
      <div className="min-w-0 space-y-8">
        {/* Recent projects */}
        <section className="space-y-3">
          <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Recent projects
          </h3>

          {isProjectsError && (
            <ErrorState
              title="Couldn't load projects"
              description="Something went wrong fetching projects for this workspace."
              onRetry={refetchProjects}
              isRetrying={isProjectsFetching}
            />
          )}

          {!isProjectsError && projects && projects.data.length > 0 ? (
            <>
              <div className="overflow-hidden rounded-lg border border-border/60 bg-card shadow-sm">
                {projects.data.map((project) => {
                  const {
                    id,
                    name,
                    slug: projectSlug,
                    description,
                    updatedAt,
                    taskCount,
                  } = project;
                  const color = getIdentityColor(id);
                  const progressCount = completedTasks / totalTasks;

                  return (
                    <Link
                      to={`/organizations/${orgSlug}/workspaces/${workspaceSlug}/projects/${projectSlug}`}
                      key={id}
                      className="group relative flex items-center justify-between gap-4 border-b border-border/40 p-4 transition-all hover:bg-muted/30 hover:cursor-pointer last:border-0"
                    >
                      <div className="flex min-w-0 items-center gap-3.5">
                        <TextAvatar
                          name={name}
                          colorClass={color.bg}
                          textClass={color.text}
                          className="size-10 shrink-0 rounded-lg text-sm font-semibold"
                        />

                        <div className="min-w-0 space-y-0.5">
                          <h4 className="truncate text-sm font-semibold tracking-tight text-foreground">
                            {name}
                          </h4>
                          {description && (
                            <p className="truncate text-xs text-muted-foreground">
                              {description}
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <div className="hidden shrink-0 flex-col items-end gap-0.5 text-xs text-muted-foreground sm:flex">
                          <span className="font-medium text-foreground/80">
                            {taskCount} open
                          </span>
                          <span>Updated {timeAgo(updatedAt)}</span>
                        </div>
                        <ProgressBar progress={progressCount} />
                      </div>
                    </Link>
                  );
                })}
              </div>

              <PaginationControls
                currentPage={projectPage}
                limit={DEFAULT_TABLE_LIMIT}
                onPageChange={setProjectPage}
                totalItems={projects.meta.total}
                totalPages={projects.meta.totalPages}
                isPlaceholderData={isProjectsPlaceholderData}
              />
            </>
          ) : (
            !isProjectsError && (
              <div className="flex min-h-32 items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 px-6 text-center">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    No projects yet
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Projects created in this workspace will appear here.
                  </p>
                </div>
              </div>
            )
          )}
        </section>

        {/* Open tasks */}
        <section className="space-y-3">
          {isTasksError && (
            <ErrorState
              title="Couldn't load tasks"
              description="Something went wrong fetching tasks for this workspace."
              onRetry={refetchTasks}
              isRetrying={isTasksFetching}
            />
          )}

          {!isTasksError && tasks && tasks.data.length > 0 ? (
            <>
              <WorkspaceTasksTable
                tasks={tasks.data}
                isError={isTasksError}
                isFetching={isTasksFetching}
                refetch={refetchTasks}
              />

              <PaginationControls
                currentPage={taskPage}
                limit={DEFAULT_TABLE_LIMIT}
                onPageChange={setTaskPage}
                totalItems={tasks.meta.total}
                totalPages={tasks.meta.totalPages}
                isPlaceholderData={isTasksPlaceholderData}
              />
            </>
          ) : (
            !isTasksError && (
              <div className="flex min-h-32 items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 px-6 text-center">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    No open tasks
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    You're all caught up in this workspace.
                  </p>
                </div>
              </div>
            )
          )}
        </section>
      </div>

      {/* Sidebar column */}
      <aside className="space-y-6">
        {/* Members */}
        <section className="space-y-3">
          <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Members
          </h3>

          {isMembersError && (
            <ErrorState
              title="Couldn't load members"
              description="Something went wrong fetching members for this workspace."
              onRetry={refetchMembers}
              isRetrying={isMembersFetching}
            />
          )}

          <div className="rounded-xl border border-border/60 bg-card p-4 shadow-sm">
            {!isMembersError && members && members.data.length > 0 ? (
              <div className="space-y-3">
                {members.data.map((member) => {
                  const {
                    user: { id, name },
                    role,
                  } = member;
                  const color = getIdentityColor(id);

                  return (
                    <div key={id} className="flex items-center gap-2.5">
                      <TextAvatar
                        name={name}
                        colorClass={color.bg}
                        textClass={color.text}
                        className="size-8 shrink-0 rounded-full text-xs font-semibold"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">
                          {name}
                        </p>
                        <p className="text-[11px] capitalize text-muted-foreground">
                          {role.toLowerCase()}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              !isMembersError && (
                <div className="px-3 py-8 text-center">
                  <p className="text-sm font-medium text-foreground">
                    No members found
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Workspace members will appear here.
                  </p>
                </div>
              )
            )}
          </div>

          {members && (
            <PaginationControls
              currentPage={memberPage}
              limit={DEFAULT_TABLE_LIMIT}
              onPageChange={setMemberPage}
              totalItems={members.meta.total}
              totalPages={members.meta.totalPages}
              isPlaceholderData={isMembersPlaceholderData}
            />
          )}
        </section>

        {/* At a glance */}
        <section className="space-y-3">
          <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            At a glance
          </h3>

          <div className="rounded-xl border border-border/60 bg-card p-4 shadow-sm">
            <dl className="space-y-2.5 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Active projects</dt>
                <dd className="font-medium tabular-nums">{activeProjects}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Total tasks</dt>
                <dd className="font-medium tabular-nums">{totalTasks}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Open</dt>
                <dd className="font-medium tabular-nums">{openTasks}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Completed</dt>
                <dd className="font-medium tabular-nums">{completedTasks}</dd>
              </div>
            </dl>
          </div>
        </section>
      </aside>
    </div>
  );
};

export default WorkspaceOverview;
