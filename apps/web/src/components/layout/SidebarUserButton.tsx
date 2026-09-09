import { ChevronsUpDown, Loader2, LogOut, Settings } from "lucide-react";
import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/stores/authStore";
import TextAvatar from "../TextAvatar";
import { getIdentityColor } from "@/lib/utils";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { Skeleton } from "../ui/skeleton";

const SidebarUserButton = () => {
  const { mutate: logout, isPending } = useLogout();
  const user = useAuthStore((state) => state.user);
  const color = user ? getIdentityColor(user.id) : null;

  if (!user || !color) {
    return (
      <SidebarFooter>
        <div className="flex items-center gap-2.5 px-2 py-1.5">
          <Skeleton className="size-8 shrink-0 rounded-full" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-3.5 w-24" />
            <Skeleton className="h-3 w-32" />
          </div>
        </div>
      </SidebarFooter>
    );
  }

  return (
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <SidebarMenuButton
                  size="lg"
                  className="gap-2.5 data-[state=open]:bg-sidebar-accent"
                >
                  <TextAvatar
                    name={user.name}
                    colorClass={color.bg}
                    textClass={color.text}
                    className="size-8 shrink-0 rounded-full text-xs font-semibold"
                  />
                  <div className="min-w-0 flex-1 text-left leading-tight">
                    <p className="truncate text-sm font-medium">{user.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                  <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground opacity-60" />
                </SidebarMenuButton>
              }
            />

            <DropdownMenuContent
              className="w-59.5 p-1"
              align="start"
              side="top"
              sideOffset={8}
            >
              <DropdownMenuGroup>
                <DropdownMenuLabel className="flex items-center gap-2.5 px-2 py-2 font-normal">
                  <TextAvatar
                    name={user.name}
                    colorClass={color.bg}
                    textClass={color.text}
                    className="size-8 shrink-0 rounded-full text-xs font-semibold"
                  />
                  <div className="min-w-0 flex-1 leading-tight">
                    <p className="truncate text-sm font-medium">{user.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <DropdownMenuGroup>
                <DropdownMenuItem
                  disabled
                  className="cursor-pointer gap-2 rounded-md px-2 py-1.5 text-sm"
                >
                  <Settings className="size-3.5 text-muted-foreground" />
                  Settings
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={() => logout()}
                  variant="destructive"
                  disabled={isPending}
                  className="cursor-pointer gap-2 rounded-md px-2 py-1.5 text-sm text-destructive focus:bg-destructive/10 focus:text-destructive [&_svg]:text-destructive"
                >
                  {isPending ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <LogOut className="size-3.5" />
                  )}
                  {isPending ? "Logging out..." : "Log out"}
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  );
};

export default SidebarUserButton;
