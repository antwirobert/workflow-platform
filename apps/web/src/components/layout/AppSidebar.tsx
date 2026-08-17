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
import { Archive, Hash, Plus, RotateCw } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useActiveOrganization } from "@/features/organizations/hooks/useActiveOrganization";
import { useWorkspaces } from "@/features/workspaces/hooks/useWorkspaces";
import { cn, getIdentityColor } from "@/lib/utils";
import { useWorkspaceStore } from "@/stores/workspaceStore";
// import { useProjects } from "@/features/projects/hooks/useProjects";
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

  // const {
  //   data: projects,
  //   isLoading: projectsLoading,
  //   isError: projectsError,
  //   refetch: projectsRefetch,
  //   isFetching: projectsFetching,
  // } = useProjects(
  //   activeOrganization?.slug ?? null,
  //   activeWorkspaceSlug ?? null,
  // );

  const allWorkspacesPath = `/organizations/${activeOrganization?.slug}/workspaces`;
  const allProjectsPath = `/organizations/${activeOrganization?.slug}/workspaces/${activeWorkspaceSlug}/projects`;

  const isAllWorkspacesActive = location.pathname === allWorkspacesPath;
  // const isAllProjectsActive = location.pathname === allProjectsPath;

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
          <SidebarGroupLabel className="px-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
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

              {!workspacesLoading &&
                !workspacesError &&
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
          <SidebarGroupLabel className="flex items-center justify-between px-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            <span>Projects</span>
            <Link
              to={allProjectsPath}
              className="rounded-md p-0.5 text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <Plus className="size-3.5" strokeWidth={2.5} />
            </Link>
          </SidebarGroupLabel>

          {/* <SidebarGroupContent>
            <SidebarMenu>
              {projectsLoading &&
                Array.from({ length: 3 }).map((_, i) => (
                  <SidebarMenuItem key={i}>
                    <SidebarMenuButton className="gap-2.5 pointer-events-none">
                      <Skeleton className="size-2.5 shrink-0 rounded-full" />
                      <Skeleton className="h-3.5 w-full" />
                    </SidebarMenuButton>
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

              {!projectsLoading &&
                !projectsError &&
                (projects ?? []).length === 0 && (
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

              {!projectsLoading &&
                !projectsError &&
                (projects ?? []).map((project) => {
                  const isProjectActive =
                    location.pathname === `${allProjectsPath}/${project.id}`;

                  return (
                    <SidebarMenuItem key={project.id}>
                      <SidebarMenuButton
                        className="gap-2.5"
                        onClick={() =>
                          navigate(`${allProjectsPath}/${project.id}`)
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
              (projects ?? []).length > 0 && (
                <SidebarMenu className="mt-1">
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => navigate(allProjectsPath)}
                      isActive={isAllProjectsActive}
                    >
                      <div className="flex gap-2.5 text-muted-foreground">
                        <Archive className="size-4 opacity-70" />
                        <span>All projects</span>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              )}
          </SidebarGroupContent> */}
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter />
    </Sidebar>
  );
};

export default AppSidebar;
