import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { useActiveOrganization } from "@/features/organizations/hooks/useActiveOrganization";
import TextAvatar from "../../../components/TextAvatar";
import { getIdentityColor } from "@/lib/utils";
import { Check, Plus } from "lucide-react";
import OrganizationSwitcherTrigger from "./OrganizationSwitcherTrigger ";
import { useOrgStore } from "@/stores/orgStore";
import { useWorkspaceStore } from "@/stores/workspaceStore";

const OrganizationSwitcher = () => {
  const { activeOrganization, organizations } = useActiveOrganization();
  const setActiveOrgId = useOrgStore((state) => state.setActiveOrgId);
  const setActiveWorkspaceId = useWorkspaceStore(
    (state) => state.setActiveWorkspaceId,
  );

  const handleSwitch = (orgId: string) => {
    setActiveOrgId(orgId);
    setActiveWorkspaceId(null);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<OrganizationSwitcherTrigger />} />
      <DropdownMenuContent
        className="w-59.5 mt-1.5 shadow-lg border-border/60"
        align="start"
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel className="px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Organizations
          </DropdownMenuLabel>

          {organizations?.map((org) => {
            const orgColor = getIdentityColor(org.id);
            const isActive = org.id === activeOrganization?.id;

            return (
              <DropdownMenuItem
                key={org.id}
                className="group flex items-center justify-between gap-2 rounded-md px-2 py-2 cursor-pointer focus:bg-accent"
                onClick={() => handleSwitch(org.id)}
              >
                <div className="flex min-w-0 items-center gap-2.5">
                  <TextAvatar
                    name={org.name}
                    colorClass={orgColor.bg}
                    textClass={orgColor.text}
                    className="size-7 shrink-0 rounded-md text-xs font-medium"
                  />
                  <span
                    className={`truncate text-sm capitalize ${
                      isActive
                        ? "font-medium text-foreground"
                        : "text-foreground/90"
                    }`}
                  >
                    {org.name}
                  </span>
                </div>

                {isActive && (
                  <Check
                    className="size-4 shrink-0 text-primary"
                    strokeWidth={2.5}
                  />
                )}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="my-1.5" />

        <DropdownMenuGroup>
          <DropdownMenuItem className="flex items-center gap-2.5 rounded-md px-2 py-2 cursor-pointer text-muted-foreground hover:text-foreground focus:bg-accent">
            <div className="flex size-7 shrink-0 items-center justify-center rounded-md border border-dashed border-border bg-muted/40">
              <Plus className="size-3.5" strokeWidth={2.5} />
            </div>
            <span className="text-sm font-medium">New organization</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default OrganizationSwitcher;
