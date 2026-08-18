import { useState } from "react";
import { DEFAULT_SUB_TABLE_LIMIT } from "@/constants";
import { useProjects } from "@/features/projects/hooks/useProjects";
import PaginationControls from "@/components/PaginationControls";
import TextAvatar from "@/components/TextAvatar";
import { useOrganizationMembers } from "@/features/organizations/hooks/useOrganizationMembers";
import { getIdentityColor, timeAgo } from "@/lib/utils";

interface WorkspaceOverviewProps {
  orgSlug: string;
  workspaceSlug: string;
}

const WorkspaceOverview = ({
  orgSlug,
  workspaceSlug,
}: WorkspaceOverviewProps) => {
  const [projectPage, setProjectPage] = useState(1);
  const [memberPage, setMemberPage] = useState(1);
  const { data: projects, isError } = useProjects(
    orgSlug ?? null,
    workspaceSlug ?? null,
    {
      page: projectPage,
      limit: DEFAULT_SUB_TABLE_LIMIT,
    },
  );

  const { data: orgMembers } = useOrganizationMembers(orgSlug ?? null, {
    page: memberPage,
    limit: DEFAULT_SUB_TABLE_LIMIT,
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

          {!isError && (projects?.data.length ?? 0) > 0 ? (
            <div className="space-y-3">
              {projects?.data.map((project) => {
                const { name, description, updatedAt, taskCount } = project;
                const color = getIdentityColor(project.id);

                return (
                  <div
                    key={project.id}
                    className="group flex items-center justify-between gap-4 rounded-xl border border-border/60 bg-card p-4 shadow-sm transition-all hover:border-border hover:shadow-md"
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
                  </div>
                );
              })}

              <PaginationControls
                currentPage={projects!.meta.page}
                totalPages={projects!.meta.totalPages}
                totalItems={projects!.meta.total}
                limit={DEFAULT_SUB_TABLE_LIMIT}
                onPageChange={setProjectPage}
              />
            </div>
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

          <div className="rounded-xl border border-border/60 bg-card p-4 shadow-sm">
            {!isError && (orgMembers?.data.length ?? 0) > 0 ? (
              <div className="space-y-3">
                {orgMembers?.data.map((member) => {
                  const color = getIdentityColor(member.user.id);

                  return (
                    <div
                      key={member.user.id}
                      className="flex items-center gap-2.5"
                    >
                      <TextAvatar
                        name={member.user.name}
                        colorClass={color.bg}
                        textClass={color.text}
                        className="size-8 shrink-0 rounded-full text-xs font-semibold"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">
                          {member.user.name}
                        </p>
                        <p className="text-[11px] capitalize text-muted-foreground">
                          {member.role.toLowerCase()}
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

          {orgMembers && (
            <PaginationControls
              currentPage={orgMembers.meta.page}
              totalPages={orgMembers.meta.totalPages}
              totalItems={orgMembers.meta.total}
              limit={DEFAULT_SUB_TABLE_LIMIT}
              onPageChange={setMemberPage}
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
