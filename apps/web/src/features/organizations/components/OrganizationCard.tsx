import TextAvatar from "@/components/TextAvatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getIdentityColor } from "@/lib/utils";
import { Ellipsis, Layers, Pencil, Trash2, Users } from "lucide-react";
import { OrgRoleBadge } from "./OrgRoleBadge";
import type { OrgRole } from "@/types/organization";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface OrganizationCardProps {
  id: string;
  name: string;
  slug: string;
  role: OrgRole;
  workspaceCount?: number;
  memberCount?: number;
}

const OrganizationCard = ({
  id,
  name,
  slug,
  role,
  workspaceCount,
  memberCount,
}: OrganizationCardProps) => {
  const color = getIdentityColor(id);

  return (
    <div className="group relative flex items-center justify-between gap-4 rounded-xl border border-border/60 bg-card p-4 shadow-sm transition-all hover:border-border hover:shadow-md">
      <div className="flex min-w-0 items-center gap-3.5">
        <TextAvatar
          name={name}
          colorClass={color.bg}
          textClass={color.text}
          className="size-11 shrink-0 rounded-lg text-sm font-semibold"
        />

        <div className="flex min-w-0 flex-col gap-1.5">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <h3 className="truncate text-sm font-semibold tracking-tight text-foreground">
              {name}
            </h3>
            <OrgRoleBadge role={role} />
            <Badge
              variant="secondary"
              className="h-5 shrink-0 rounded-md px-1.5 text-[11px] font-medium text-muted-foreground"
            >
              {slug}
            </Badge>
          </div>

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Layers className="size-3.5 opacity-70" />
              {workspaceCount}{" "}
              {workspaceCount === 1 ? "workspace" : "workspaces"}
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="size-3.5 opacity-70" />
              {memberCount} {memberCount === 1 ? "member" : "members"}
            </span>
          </div>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1.5">
        <Button
          variant="outline"
          size="sm"
          className="opacity-80 transition-opacity group-hover:opacity-100"
        >
          Manage
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="size-8 opacity-60 transition-opacity group-hover:opacity-100"
              >
                <Ellipsis className="size-4" />
              </Button>
            }
          />
          <DropdownMenuContent className="w-48 p-1" align="end">
            <DropdownMenuGroup>
              <DropdownMenuItem className="cursor-pointer gap-2 rounded-md px-2 py-1.5 text-sm">
                <Pencil className="size-3.5 text-muted-foreground" />
                Edit organization
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                className="cursor-pointer gap-2 rounded-md px-2 py-1.5 text-sm"
              >
                <Trash2 className="size-3.5" />
                Delete organization
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default OrganizationCard;
