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
import { cn, getIdentityColor } from "@/lib/utils";
import { Building2, Check, Plus, RotateCw } from "lucide-react";
import OrganizationSwitcherTrigger from "./OrganizationSwitcherTrigger ";
import { useOrgStore } from "@/stores/orgStore";
import { useWorkspaceStore } from "@/stores/workspaceStore";
import { Link, useNavigate } from "react-router-dom";

const OrganizationSwitcher = () => {
  const navigate = useNavigate();
  const { activeOrganization, organizations, isError, isFetching, refetch } =
    useActiveOrganization();
  const setActiveOrgSlug = useOrgStore((state) => state.setActiveOrgSlug);
  const setActiveWorkspaceSlug = useWorkspaceStore(
    (state) => state.setActiveWorkspaceSlug,
  );

  const handleSwitch = (slug: string) => {
    setActiveOrgSlug(slug);
    setActiveWorkspaceSlug(null);
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

          {organizations?.data.length === 0 && (
            <div className="mx-2 flex flex-col items-center gap-2 rounded-lg border border-dashed border-border/80 px-3 py-4 text-center">
              <p className="text-xs leading-relaxed text-muted-foreground">
                You're not part of any organization yet.
              </p>
              <Link
                to="/organizations"
                className="flex items-center gap-1 text-xs font-medium text-foreground/80 transition-colors hover:text-foreground"
              >
                <Plus className="size-3" strokeWidth={2.5} />
                Create organization
              </Link>
            </div>
          )}

          {organizations?.data.map((org) => {
            const orgColor = getIdentityColor(org.id);
            const isActive = org.id === activeOrganization?.id;

            return (
              <DropdownMenuItem
                key={org.id}
                className="group flex items-center justify-between gap-2 rounded-md px-2 py-2 cursor-pointer focus:bg-accent"
                onClick={() => handleSwitch(org.slug)}
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
          <DropdownMenuItem
            onClick={() => navigate("/organizations")}
            className="flex items-center gap-2.5 rounded-md px-2 py-2 cursor-pointer text-muted-foreground hover:text-foreground focus:bg-accent"
          >
            <div className="flex size-7 shrink-0 items-center justify-center rounded-md border border-border bg-muted/40 text-muted-foreground">
              <Building2 className="size-3.5" />
            </div>
            <span className="text-sm font-medium text-foreground">
              View all organizations
            </span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default OrganizationSwitcher;
