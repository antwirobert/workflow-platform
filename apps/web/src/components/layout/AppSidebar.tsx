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
} from "@/components/ui/sidebar";
import { Separator } from "../ui/separator";
import OrganizationSwitcher from "../../features/organizations/components/OrganizationSwitcher ";
import { Archive, Plus, RotateCw } from "lucide-react";
import { Link } from "react-router-dom";
import { useActiveOrganization } from "@/features/organizations/hooks/useActiveOrganization";
import { useWorkspaces } from "@/features/workspaces/hooks/useWorkspaces";
import { cn, getIdentityColor } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";

const AppSidebar = () => {
  const { activeOrganization } = useActiveOrganization();
  const {
    data: workspaces,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useWorkspaces(activeOrganization?.id ?? null);

  return (
    <Sidebar>
      <SidebarHeader>
        <OrganizationSwitcher />
      </SidebarHeader>

      <Separator />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center justify-between px-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            <span>Workspaces</span>
            <Link
              to={`/organizations/${activeOrganization?.id}/workspaces`}
              className="rounded-md p-0.5 text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <Plus className="size-3.5" strokeWidth={2.5} />
            </Link>
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {isLoading &&
                Array.from({ length: 3 }).map((_, i) => (
                  <SidebarMenuItem key={i}>
                    <SidebarMenuButton className="gap-2.5 pointer-events-none">
                      <Skeleton className="size-2.5 shrink-0 rounded-full" />
                      <Skeleton className="h-3.5 w-full" />
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}

              {isError && (
                <div className="mx-2 rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2.5">
                  <p className="text-xs font-medium text-destructive">
                    Workspaces failed to load
                  </p>
                  <button
                    onClick={() => refetch()}
                    disabled={isFetching}
                    className="mt-1.5 flex items-center gap-1.5 text-xs text-destructive/80 transition-colors hover:text-destructive disabled:opacity-50"
                  >
                    <RotateCw
                      className={cn("size-3", isFetching && "animate-spin")}
                    />
                    Try again
                  </button>
                </div>
              )}

              {!isLoading && !isError && (workspaces ?? []).length === 0 && (
                <div className="mx-2 flex flex-col items-center gap-2 rounded-lg border border-dashed border-border/80 px-3 py-4 text-center">
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    No workspaces yet.
                    <br />
                    Group projects by team or client.
                  </p>
                  <Link
                    to={`/organizations/${activeOrganization?.id}/workspaces`}
                    className="flex items-center gap-1 text-xs font-medium text-foreground/80 transition-colors hover:text-foreground"
                  >
                    <Plus className="size-3" strokeWidth={2.5} />
                    New workspace
                  </Link>
                </div>
              )}

              {!isLoading &&
                !isError &&
                (workspaces ?? []).map((workspace) => {
                  const workspaceColor = getIdentityColor(workspace.id);

                  return (
                    <SidebarMenuItem key={workspace.id}>
                      <SidebarMenuButton className="gap-2.5">
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

            <SidebarMenu className="mt-1">
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  {!isLoading && !isError && (workspaces ?? []).length > 0 && (
                    <Link
                      to={`/organizations/${activeOrganization?.id}/workspaces`}
                      className="flex gap-2.5 text-muted-foreground"
                    >
                      <Archive className="size-4 opacity-70" />
                      <span>All workspaces</span>
                    </Link>
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
};

export default AppSidebar;
