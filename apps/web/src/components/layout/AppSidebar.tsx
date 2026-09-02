import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
} from "@/components/ui/sidebar";
import { Separator } from "../ui/separator";
import { Archive, Hash, Lock, Plus, RotateCw } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useActiveOrganization } from "@/features/organizations/hooks/useActiveOrganization";
import { useWorkspaces } from "@/features/workspaces/hooks/useWorkspaces";
import { cn, getIdentityColor } from "@/lib/utils";
import { useWorkspaceStore } from "@/stores/workspaceStore";
import { useProjects } from "@/features/projects/hooks/useProjects";
import OrganizationSwitcher from "@/features/organizations/components/OrganizationSwitcher ";
import { DEFAULT_PAGE, DEFAULT_SIDEBAR_LIMIT } from "@/constants";

const AppSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { activeOrganization } = useActiveOrganization();
  const activeWorkspaceSlug = useWorkspaceStore(
    (state) => state.activeWorkspaceSlug,
  );
  const setActiveWorkspaceSlug = useWorkspaceStore(
    (state) => state.setActiveWorkspaceSlug,
  );

  const {
    data: workspaces,
    isLoading: workspacesLoading,
    isError: workspacesError,
    refetch: workspacesRefetch,
    isFetching: workspacesFetching,
  } = useWorkspaces(activeOrganization?.slug ?? null, {
    page: DEFAULT_PAGE,
    limit: DEFAULT_SIDEBAR_LIMIT,
  });

  const {
    data: projects,
    isLoading: projectsLoading,
    isError: projectsError,
    refetch: projectsRefetch,
    isFetching: projectsFetching,
  } = useProjects(
    activeOrganization?.slug ?? null,
    activeWorkspaceSlug ?? null,
    {
      page: DEFAULT_PAGE,
      limit: DEFAULT_SIDEBAR_LIMIT,
    },
  );

  const allWorkspacesPath = `/organizations/${activeOrganization?.slug}/workspaces`;
  const allProjectsPath = `/organizations/${activeOrganization?.slug}/workspaces/${activeWorkspaceSlug}/projects`;

  const isAllWorkspacesActive = location.pathname === allWorkspacesPath;
  const isAllProjectsActive = location.pathname === allProjectsPath;

  const handleWorkspaceClick = (slug: string) => {
    setActiveWorkspaceSlug(slug);
    navigate(`${allWorkspacesPath}/${slug}`);
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <OrganizationSwitcher />
      </SidebarHeader>

      <Separator />

      <SidebarContent>
        {/* Workspaces */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            <span>Workspaces</span>
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {workspacesLoading &&
                Array.from({ length: 3 }).map((_, index) => (
                  <SidebarMenuItem key={index}>
                    <SidebarMenuSkeleton />
                  </SidebarMenuItem>
                ))}

              {workspacesError && (
                <div className="mx-2 rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2.5">
                  <p className="text-xs font-medium text-destructive">
                    Workspaces failed to load
                  </p>
                  <button
                    onClick={() => workspacesRefetch()}
                    disabled={workspacesFetching}
                    className="mt-1.5 flex items-center gap-1.5 text-xs text-destructive/80 transition-colors hover:text-destructive disabled:opacity-50"
                  >
                    <RotateCw
                      className={cn(
                        "size-3",
                        workspacesFetching && "animate-spin",
                      )}
                    />
                    Try again
                  </button>
                </div>
              )}

              {!activeOrganization && (
                <div className="mx-2 flex flex-col items-center gap-2 rounded-lg border border-dashed border-border/80 px-3 py-4 text-center">
                  <Lock className="size-3.5 text-muted-foreground/70" />
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    Workspaces live inside an organization. Pick one to see its
                    workspaces.
                  </p>
                  <Link
                    to="/organizations"
                    className="text-xs font-medium text-foreground/80 transition-colors hover:text-foreground"
                  >
                    Choose an organization
                  </Link>
                </div>
              )}

              {!workspacesLoading &&
                !workspacesError &&
                activeOrganization &&
                (workspaces?.data ?? []).length === 0 && (
                  <div className="mx-2 flex flex-col items-center gap-2 rounded-lg border border-dashed border-border/80 px-3 py-4 text-center">
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      No workspaces yet.
                      <br />
                      Group projects by team or client.
                    </p>
                    <Link
                      to={allWorkspacesPath}
                      className="flex items-center gap-1 text-xs font-medium text-foreground/80 transition-colors hover:text-foreground"
                    >
                      <Plus className="size-3" strokeWidth={2.5} />
                      New workspace
                    </Link>
                  </div>
                )}

              {!workspacesLoading &&
                !workspacesError &&
                (workspaces?.data ?? []).map((workspace) => {
                  const workspaceColor = getIdentityColor(workspace.id);
                  const isWorkspaceActive =
                    workspace.slug === activeWorkspaceSlug;

                  return (
                    <SidebarMenuItem key={workspace.id}>
                      <SidebarMenuButton
                        className="gap-2.5"
                        onClick={() => handleWorkspaceClick(workspace.slug)}
                        isActive={isWorkspaceActive}
                      >
                        <div
                          className={cn(
                            "size-2.5 shrink-0 rounded-full ring-1 ring-black/5 dark:ring-white/10",
                            workspaceColor.bg,
                          )}
                        />
                        <span className="truncate">{workspace.name}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
            </SidebarMenu>

            {!workspacesLoading &&
              !workspacesError &&
              (workspaces?.data ?? []).length > 0 && (
                <SidebarMenu className="mt-1">
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => {
                        setActiveWorkspaceSlug(null);
                        navigate(allWorkspacesPath);
                      }}
                      isActive={isAllWorkspacesActive}
                      className="flex gap-2.5 text-muted-foreground"
                    >
                      <Archive className="size-4 opacity-70" />
                      <span>All workspaces</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              )}
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Projects */}
        <SidebarGroup>
          <SidebarGroupLabel className="px-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Projects
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {projectsLoading &&
                Array.from({ length: 3 }).map((_, index) => (
                  <SidebarMenuItem key={index}>
                    <SidebarMenuSkeleton />
                  </SidebarMenuItem>
                ))}

              {projectsError && (
                <div className="mx-2 rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2.5">
                  <p className="text-xs font-medium text-destructive">
                    Projects failed to load
                  </p>
                  <button
                    onClick={() => projectsRefetch()}
                    disabled={projectsFetching}
                    className="mt-1.5 flex items-center gap-1.5 text-xs text-destructive/80 transition-colors hover:text-destructive disabled:opacity-50"
                  >
                    <RotateCw
                      className={cn(
                        "size-3",
                        projectsFetching && "animate-spin",
                      )}
                    />
                    Try again
                  </button>
                </div>
              )}

              {!activeOrganization && (
                <div className="mx-2 flex flex-col items-center gap-2 rounded-lg border border-dashed border-border/80 px-3 py-4 text-center">
                  <Lock className="size-3.5 text-muted-foreground/70" />
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    Pick an organization first. Projects sit inside its
                    workspaces.
                  </p>
                  <Link
                    to="/organizations"
                    className="text-xs font-medium text-foreground/80 transition-colors hover:text-foreground"
                  >
                    Choose an organization
                  </Link>
                </div>
              )}

              {activeOrganization && !activeWorkspaceSlug && (
                <div className="mx-2 flex flex-col items-center gap-2 rounded-lg border border-dashed border-border/80 px-3 py-4 text-center">
                  <Lock className="size-3.5 text-muted-foreground/70" />
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    Projects sit inside workspaces. Choose one to continue.
                  </p>
                  <Link
                    to={`/organizations/${activeOrganization.slug}/workspaces`}
                    className="text-xs font-medium text-foreground/80 transition-colors hover:text-foreground"
                  >
                    Choose a workspace
                  </Link>
                </div>
              )}

              {!projectsLoading &&
                !projectsError &&
                activeOrganization &&
                activeWorkspaceSlug &&
                (projects?.data ?? []).length === 0 && (
                  <div className="mx-2 flex flex-col items-center gap-2 rounded-lg border border-dashed border-border/80 px-3 py-4 text-center">
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      No projects in this workspace yet.
                    </p>
                    <Link
                      to={allProjectsPath}
                      className="flex items-center gap-1 text-xs font-medium text-foreground/80 transition-colors hover:text-foreground"
                    >
                      <Plus className="size-3" strokeWidth={2.5} />
                      New project
                    </Link>
                  </div>
                )}

              {activeWorkspaceSlug &&
                !projectsLoading &&
                !projectsError &&
                (projects?.data ?? []).map((project) => {
                  const isProjectActive =
                    location.pathname === `${allProjectsPath}/${project.slug}`;

                  return (
                    <SidebarMenuItem key={project.id}>
                      <SidebarMenuButton
                        className="gap-2.5"
                        onClick={() =>
                          navigate(`${allProjectsPath}/${project.slug}`)
                        }
                        isActive={isProjectActive}
                      >
                        <Hash className="size-4 text-muted-foreground" />
                        <span className="truncate">{project.name}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
            </SidebarMenu>

            {!projectsLoading &&
              !projectsError &&
              (projects?.data ?? []).length > 0 && (
                <SidebarMenu className="mt-1">
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => navigate(allProjectsPath)}
                      isActive={isAllProjectsActive}
                      className="flex gap-2.5 text-muted-foreground"
                    >
                      <Archive className="size-4 opacity-70" />
                      <span>All projects</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              )}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter />
    </Sidebar>
  );
};

export default AppSidebar;
