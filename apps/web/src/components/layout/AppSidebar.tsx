import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useActiveOrganization } from "@/features/organizations/hooks/useActiveOrganization";
import OrgSwitcher from "./OrgSwitcher";
import { Separator } from "../ui/separator";
import TextAvatar from "../TextAvatar";
import { getIdentityColor } from "@/lib/utils";
import { Check, Plus } from "lucide-react";

const AppSidebar = () => {
  const { activeOrganization, organizations } = useActiveOrganization();

  return (
    <Sidebar>
      <SidebarHeader>
        <DropdownMenu>
          <DropdownMenuTrigger render={<OrgSwitcher />} />
          <DropdownMenuContent className="w-59.5 mt-1">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="uppercase font-bold">
                organizations
              </DropdownMenuLabel>
              {organizations?.map((org) => {
                const orgColor = getIdentityColor(org.id);

                return (
                  <DropdownMenuItem
                    key={org.id}
                    className="flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <TextAvatar
                        name={org.name}
                        colorClass={orgColor.bg}
                        textClass={orgColor.text}
                        className="px-1.25 py-1"
                      />
                      <span className="flex-1 truncate">{org.name}</span>
                    </div>
                    {org.id === activeOrganization?.id && (
                      <Check className="shrink-0" />
                    )}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className="flex items-center gap-4.5 cursor-pointer">
                <Plus className="size-5" />
                New organization
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarHeader>

      <Separator />

      <SidebarContent>
        <SidebarGroup />
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
};

export default AppSidebar;
