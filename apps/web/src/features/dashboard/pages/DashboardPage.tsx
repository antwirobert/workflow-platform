import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { useActiveOrganization } from "@/features/organizations/hooks/useActiveOrganization";
import { useDashboard } from "../hooks/useDashboard";
import { useAuthStore } from "@/stores/authStore";
import { TaskStatusBadge } from "@/features/tasks/components/TaskStatusBadge";

import { useOrgStore } from "@/stores/orgStore";
import { getIdentityColor } from "@/lib/utils";

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export function DashboardPage() {
  const { activeOrganization } = useActiveOrganization();
  const activeOrgSlug = useOrgStore((s) => s.activeOrgSlug);
  const user = useAuthStore((s) => s.user);
  const { data, isLoading, isError } = useDashboard(
    activeOrganization?.slug ?? null,
  );

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl space-y-6 p-8">
        <Skeleton className="h-10 w-1/3" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="p-8 text-sm text-destructive">
        Could not load your dashboard. Please try again.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-8">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {greeting()}, {user?.name?.split(" ")[0] ?? "there"}
        </p>
        <h1 className="mt-1 text-3xl font-semibold">
          Here's what's moving today.
        </h1>
      </div>

      {/* Stat cards — only using real counts the backend actually gives us */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Assigned to you" value={data.assignedTaskCount} />
        <StatCard label="Active projects" value={data.projectCount} />
      </div>

      {/* Assigned tasks */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Assigned to you
          </h2>
        </div>
        {data.assignedTasks.length === 0 && (
          <div className="rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground">
            No tasks assigned to you right now.
          </div>
        )}
        <div className="divide-y divide-border rounded-md border border-border">
          {data.assignedTasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between px-4 py-3"
            >
              <p className="text-sm font-medium">{task.title}</p>
              <div className="flex items-center gap-3">
                <TaskStatusBadge status={task.status} />
                {task.dueDate && (
                  <span className="text-xs text-muted-foreground">
                    {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent projects across workspaces */}
      <section>
        <h2 className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Recent projects
        </h2>
        {data.projectsAcrossWorkspaces.length === 0 && (
          <div className="rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground">
            No projects yet.
          </div>
        )}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {data.projectsAcrossWorkspaces.map((project) => {
            const color = getIdentityColor(project.id);
            return (
              <Link
                key={project.id}
                to={`/organizations/${activeOrgSlug}/workspaces/${project.workspaceId}/projects/${project.id}`}
              >
                <Card className="h-full transition-colors hover:border-muted-foreground/30">
                  <CardContent className="py-4">
                    <div className="mb-2 flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${color.bg}`} />
                      {/* <span className="text-xs text-muted-foreground">
                        {resolveWorkspaceName(project.workspaceId)}
                      </span> */}
                    </div>
                    <p className="font-medium">{project.name}</p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <Card>
      <CardContent className="py-4">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="mt-1 text-3xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}
