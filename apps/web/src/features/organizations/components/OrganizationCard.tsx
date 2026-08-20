import TextAvatar from "@/components/TextAvatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getIdentityColor } from "@/lib/utils";
import { Ellipsis, Layers, Lock, Pencil, Trash2, Users } from "lucide-react";
import { OrgRoleBadge } from "./OrgRoleBadge";
import type { OrgRole } from "@/types/organization";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import EditOrganizationDialog from "./EditOrganizationDialog";
import DeleteOrganizationDialog from "./DeleteOrganizationDialog";
import { ROLE_OWNER, ROLES_MANAGEMENT } from "@/constants";
import { Link } from "react-router-dom";

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
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const color = getIdentityColor(id);

  return (
    <>
      <div className="group relative flex items-center justify-between gap-4 border-b border-border/40 p-4 transition-all hover:bg-muted/30 last:border-0">
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
                className="flex gap-[0.6px] h-5 shrink-0 rounded-md px-1.5 text-[11px] font-medium text-muted-foreground"
              >
                <span>/</span>
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
          <Link to={`/organizations/${slug}/members`}>
            <Button
              variant="outline"
              size="sm"
              className="opacity-80 transition-opacity group-hover:opacity-100"
            >
              Manage
            </Button>
          </Link>
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
                <DropdownMenuItem
                  onClick={() => setIsEditOpen(true)}
                  className="cursor-pointer gap-2 rounded-md px-2 py-1.5 text-sm"
                  disabled={!ROLES_MANAGEMENT.includes(role)}
                >
                  {ROLES_MANAGEMENT.includes(role) ? (
                    <>
                      <Pencil className="size-3.5 text-muted-foreground" />
                      Edit organization
                    </>
                  ) : (
                    <div className="flex items-start gap-2 py-0.5">
                      <Lock className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm text-muted-foreground">
                          Edit organization
                        </span>
                        <span className="text-[11px] leading-snug text-muted-foreground/70">
                          Only an owner or admin can edit
                        </span>
                      </div>
                    </div>
                  )}
                </DropdownMenuItem>

                <DropdownMenuItem
                  variant={
                    ROLE_OWNER.includes(role) ? "destructive" : "default"
                  }
                  className="cursor-pointer gap-2 rounded-md px-2 py-1.5 text-sm"
                  onClick={() => setIsDeleteOpen(true)}
                  disabled={!ROLE_OWNER.includes(role)}
                >
                  {ROLES_MANAGEMENT.includes(role) ? (
                    <>
                      <Trash2 className="size-3.5" />
                      Delete organization
                    </>
                  ) : (
                    <div className="flex items-start gap-2 py-0.5">
                      <Lock className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm text-muted-foreground">
                          Delete organization
                        </span>
                        <span className="text-[11px] leading-snug text-muted-foreground/70">
                          Only the owner can delete
                        </span>
                      </div>
                    </div>
                  )}
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <EditOrganizationDialog
            slug={slug}
            name={name}
            open={isEditOpen}
            onOpenChange={setIsEditOpen}
          />

          <DeleteOrganizationDialog
            name={name}
            slug={slug}
            open={isDeleteOpen}
            onOpenChange={setIsDeleteOpen}
          />
        </div>
      </div>
    </>
  );
};

export default OrganizationCard;
