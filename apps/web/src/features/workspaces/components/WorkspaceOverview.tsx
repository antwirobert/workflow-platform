import type { Dispatch, SetStateAction } from "react";

import PaginationControls from "@/components/PaginationControls";
import TextAvatar from "@/components/TextAvatar";
import { cn, getIdentityColor, timeAgo } from "@/lib/utils";
import ErrorState from "@/components/ErrorState";
import type { PaginatedResponse } from "@/features/projects/types";
import type { Project } from "@/types/project";
import type { Member } from "@/types/organization";
import { Link, useParams } from "react-router-dom";
import TasksTable from "@/features/tasks/components/TasksTable";
import type { Task } from "@/types/task";

interface WorkspaceOverviewProps {
  projects: PaginatedResponse<Project>;
  projectsError: boolean;
  projectsFetching: boolean;
  projectsPlaceholderData: boolean;
  refetchProjects: () => void;
  projectPage: number;
  projectLimit: number;
  onProjectPageChange: Dispatch<SetStateAction<number>>;
  tasks: PaginatedResponse<Task>;
  tasksFetching: boolean;
  tasksPlaceholderData: boolean;
  members: PaginatedResponse<Member>;
  membersError: boolean;
  membersFetching: boolean;
  membersPlaceholderData: boolean;
  refetchMembers: () => void;
  memberPage: number;
  memberLimit: number;
  onMemberPageChange: Dispatch<SetStateAction<number>>;
}

const WorkspaceOverview = ({
  projects,
  projectsError,
  projectsFetching,
  projectsPlaceholderData,
  refetchProjects,
  projectPage,
  projectLimit,
  onProjectPageChange,
  tasks,
  tasksFetching,
  tasksPlaceholderData,
  members,
  membersError,
  membersFetching,
  membersPlaceholderData,
  refetchMembers,
  memberPage,
  memberLimit,
  onMemberPageChange,
}: WorkspaceOverviewProps) => {
  const { orgSlug, workspaceSlug } = useParams<{
    orgSlug: string;
    workspaceSlug: string;
  }>();

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
      {/* Main column */}
      <div className="min-w-0 space-y-8">
        {/* Recent projects */}
        <section className="space-y-3">
          <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Recent projects
          </h3>

          {projectsError && (
            <ErrorState
              title="Couldn't load projects"
              description="Something went wrong fetching projects for this workspace."
              onRetry={refetchProjects}
              isRetrying={projectsFetching}
            />
          )}

          {!projectsError && projects.data.length > 0 ? (
            <>
              <div
                className={cn(
                  "overflow-hidden rounded-lg border border-border/60 bg-card shadow-sm",
                  projectsPlaceholderData
                    ? "opacity-60 pointer-events-none"
                    : "",
                )}
              >
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

                      <div className="hidden shrink-0 flex-col items-end gap-0.5 text-xs text-muted-foreground sm:flex">
                        <span className="font-medium text-foreground/80">
                          {taskCount} open
                        </span>
                        <span>Updated {timeAgo(updatedAt)}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>

              <PaginationControls
                currentPage={projectPage}
                limit={projectLimit}
                onPageChange={onProjectPageChange}
                totalItems={projects.meta.total}
                totalPages={projects.meta.totalPages}
              />
            </>
          ) : (
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
          )}
        </section>

        {/* Open tasks */}
        <section className="space-y-3">
          <TasksTable
            tasks={tasks.data}
            isLoading={tasksPlaceholderData}
            isFetching={tasksFetching}
          />
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
        </section>
      </div>

      {/* Sidebar column */}
      <aside className="space-y-6">
        {/* Members */}
        <section className="space-y-3">
          <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Members
          </h3>

          {membersError && (
            <ErrorState
              title="Couldn't load members"
              description="Something went wrong fetching members for this workspace."
              onRetry={refetchMembers}
              isRetrying={membersFetching}
            />
          )}

          <div
            className={cn(
              "rounded-xl border border-border/60 bg-card p-4 shadow-sm",
              membersPlaceholderData ? "opacity-60 pointer-events-none" : "",
            )}
          >
            {!membersError && members.data.length > 0 ? (
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
              <div className="px-3 py-8 text-center">
                <p className="text-sm font-medium text-foreground">
                  No members found
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Workspace members will appear here.
                </p>
              </div>
            )}
          </div>

          <PaginationControls
            currentPage={memberPage}
            limit={memberLimit}
            onPageChange={onMemberPageChange}
            totalItems={members.meta.total}
            totalPages={members.meta.totalPages}
          />
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
                <dd className="font-medium tabular-nums">3</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Total tasks</dt>
                <dd className="font-medium tabular-nums">9</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Open</dt>
                <dd className="font-medium tabular-nums">8</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Completed</dt>
                <dd className="font-medium tabular-nums">2</dd>
              </div>
            </dl>
          </div>
        </section>
      </aside>
    </div>
  );
};

export default WorkspaceOverview;
