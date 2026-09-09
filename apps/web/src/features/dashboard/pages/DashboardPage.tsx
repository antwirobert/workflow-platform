import { Button } from "@/components/ui/button";
import TextAvatar from "@/components/TextAvatar";
import { cn, formatDueDate, getIdentityColor } from "@/lib/utils";
import {
  ArrowUpRight,
  CheckCircle2,
  Clock,
  FolderOpen,
  Plus,
  Zap,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { useDashboard } from "../hooks/useDashboard";
import TasksTable from "@/features/tasks/components/TasksTable";
import { DashboardStatCard } from "../components/DashboardStatCard";
import { DashboardWorkspaceCard } from "../components/DashboardWorkspaceCard";
import { useActiveOrganization } from "@/features/organizations/hooks/useActiveOrganization";

const ACTIVITY = [
  {
    id: "a1",
    userId: "u1",
    userName: "Alex Chen",
    action: "commented on",
    target: "CP-1024 Refactor authentication middleware",
    context: "Core Platform",
    time: "12m ago",
  },
  {
    id: "a2",
    userId: "u2",
    userName: "Sara Kessler",
    action: "completed",
    target: "CP-1026 Update swagger documentation",
    context: "Core Platform",
    time: "1h ago",
  },
  {
    id: "a3",
    userId: "u3",
    userName: "Lena Rivers",
    action: "created",
    target: "DS-205 Audit spacing tokens",
    context: "Design System",
    time: "3h ago",
  },
  {
    id: "a4",
    userId: "u4",
    userName: "Marcus Aurelius",
    action: "moved to review",
    target: "CP-1027 Rate limiting for invitations",
    context: "Core Platform",
    time: "5h ago",
  },
  {
    id: "a5",
    userId: "u5",
    userName: "Jordan Smith",
    action: "assigned",
    target: "CP-1028 Fix flake in auth tests",
    context: "Core Platform",
    time: "6h ago",
  },
];

const DashboardPage = () => {
  const user = useAuthStore((state) => state.user);
  const { activeOrganization } = useActiveOrganization();
  const { orgSlug } = useParams<{ orgSlug: string }>();
  const {
    data: dashboardData,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useDashboard(orgSlug ?? null);

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <section className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
              {greeting}, {user?.name}
            </p>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Here's what's moving today.
            </h1>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <Button variant="outline" className="gap-1.5">
              <Plus className="size-4" />
              New project
            </Button>
            <Button className="gap-1.5">
              <Plus className="size-4" />
              New task
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <DashboardStatCard
            label="Assigned to you"
            value={dashboardData?.assignedTaskCount ?? 0}
            hint="Open tasks"
            icon={Zap}
          />
          <DashboardStatCard
            label="Due soon"
            value={dashboardData?.dueThisWeekCount ?? 0}
            hint="Next 7 days"
            icon={Clock}
          />
          <DashboardStatCard
            label="Completed"
            value={dashboardData?.completedThisMonthCount ?? 0}
            hint="This month"
            icon={CheckCircle2}
          />
          <DashboardStatCard
            label="Active workspaces"
            value={dashboardData?.workspaceCount ?? 0}
            hint={`Inside ${activeOrganization?.name}`}
            icon={FolderOpen}
          />
        </div>

        {/* Main grid */}
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="min-w-0 space-y-8">
            {/* Assigned to you */}
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Assigned to you
                </h2>
                <Link
                  to={`/organizations/${orgSlug}/tasks`}
                  className="flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  View all
                  <ArrowUpRight className="size-3" />
                </Link>
              </div>

              {!isLoading &&
                !isError &&
                (dashboardData?.assignedTasks.length ?? 0) > 0 && (
                  <TasksTable
                    tasks={dashboardData?.assignedTasks ?? []}
                    isError={isError}
                    isFetching={isFetching}
                    refetch={refetch}
                  />
                )}

              {!isLoading &&
                !isError &&
                (dashboardData?.assignedTasks.length ?? 0) === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No tasks assigned to you
                  </p>
                )}
            </section>

            {/* Recent workspaces */}
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Recent workspaces
                </h2>
                <Link
                  to={`/organizations/${orgSlug}/workspaces`}
                  className="flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  View all
                  <ArrowUpRight className="size-3" />
                </Link>
              </div>

              {dashboardData?.allWorkspaces &&
              dashboardData.allWorkspaces.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  {dashboardData.allWorkspaces.map((workspace) => (
                    <DashboardWorkspaceCard
                      key={workspace.id}
                      id={workspace.id}
                      name={workspace.name}
                      updatedAt={workspace.updatedAt}
                    />
                  ))}
                </div>
              ) : (
                !isLoading &&
                !isError && (
                  <p className="text-sm text-muted-foreground">
                    No projects yet
                  </p>
                )
              )}
            </section>
          </div>

          <div className="space-y-8">
            {/* Activity */}
            <aside className="space-y-3">
              <h2 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Activity
              </h2>

              <div className="rounded-xl border border-border/60 bg-card p-4 shadow-sm">
                <div className="space-y-4">
                  {ACTIVITY.map((item) => {
                    const color = getIdentityColor(item.userId);

                    return (
                      <div key={item.id} className="flex gap-2.5">
                        <TextAvatar
                          name={item.userName}
                          colorClass={color.bg}
                          textClass={color.text}
                          className="size-7 shrink-0 rounded-full text-[10px] font-semibold"
                        />
                        <div className="min-w-0 flex-1 space-y-0.5">
                          <p className="text-sm leading-snug text-foreground">
                            <span className="font-medium">{item.userName}</span>{" "}
                            <span className="text-muted-foreground">
                              {item.action}
                            </span>{" "}
                            <span className="font-medium">{item.target}</span>
                          </p>
                          <p className="text-[11px] text-muted-foreground">
                            {item.context}
                            <span className="mx-1 text-muted-foreground/40">
                              ·
                            </span>
                            {item.time}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </aside>

            <section className="space-y-3">
              {/* Due This Week */}
              <h2 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Due this week
              </h2>

              <div className="flex flex-col gap-2">
                {dashboardData?.dueThisWeek &&
                dashboardData.dueThisWeek.length > 0
                  ? dashboardData.dueThisWeek.map((task) => {
                      const priorityColor = getIdentityColor(task.id);

                      return (
                        <div
                          key={task.id}
                          className="flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-card px-4 py-3 shadow-sm transition-colors hover:border-border hover:bg-muted/20"
                        >
                          <div className="flex min-w-0 items-start gap-2.5">
                            <div
                              className={cn(
                                "mt-1.5 size-2 shrink-0 rounded-full ring-1 ring-black/5 dark:ring-white/10",
                                priorityColor.bg,
                              )}
                            />
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium leading-snug text-foreground">
                                {task.title || "Untitled task"}
                              </p>
                              <p className="mt-0.5 text-xs tabular-nums text-muted-foreground">
                                {task.dueDate
                                  ? formatDueDate(task.dueDate)
                                  : "No due date"}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  : !isLoading &&
                    !isError && (
                      <p className="text-sm text-muted-foreground">
                        Nothing due this week
                      </p>
                    )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardPage;
