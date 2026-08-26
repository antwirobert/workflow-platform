// pages/DashboardPage.tsx
import { Button } from "@/components/ui/button";
import TextAvatar from "@/components/TextAvatar";
import { getIdentityColor } from "@/lib/utils";
import {
  ArrowUpRight,
  CheckCircle2,
  Clock,
  FolderKanban,
  Plus,
  UserRound,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { useDashboard } from "../hooks/useDashboard";
import { useActiveOrganization } from "@/features/organizations/hooks/useActiveOrganization";
import TasksTable from "@/features/tasks/components/TasksTable";
import { DashboardStatCard } from "../components/DashboardStatCard";
import { DashboardProjectCard } from "../components/DashboardProjectCard";

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
  const {
    data: dashboardData,
    isLoading,
    isError,
    isFetching,
    isPlaceholderData,
    refetch,
  } = useDashboard(activeOrganization?.slug ?? null);

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  const projects = dashboardData?.projectsAcrossWorkspaces ?? [];

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
            icon={UserRound}
          />
          <DashboardStatCard
            label="Due soon"
            value={4}
            hint="Next 7 days"
            icon={Clock}
          />
          <DashboardStatCard
            label="Completed"
            value={1}
            hint="This month"
            icon={CheckCircle2}
          />
          <DashboardStatCard
            label="Active projects"
            value={dashboardData?.projectCount ?? 0}
            hint="Across your workspaces"
            icon={FolderKanban}
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
                  to="/tasks"
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
                    isPlaceholderData={isPlaceholderData}
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

            {/* Recent projects */}
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Recent projects
                </h2>
                <Link
                  to="/projects"
                  className="flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  View all
                  <ArrowUpRight className="size-3" />
                </Link>
              </div>

              {projects.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  {projects.map((project) => (
                    <DashboardProjectCard
                      key={project.id}
                      id={project.id}
                      name={project.name}
                      description={project.description}
                      updatedAt={project.updatedAt}
                      // progress={project.progress} // wire when API exposes it
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
        </div>
      </div>
    </section>
  );
};

export default DashboardPage;
