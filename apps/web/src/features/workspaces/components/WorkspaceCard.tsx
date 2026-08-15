import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ROLE_OWNER, ROLES_MANAGEMENT } from "@/constants";
import { cn, getIdentityColor } from "@/lib/utils";
import { Ellipsis, Hash, Lock, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";

interface WorkspaceCardProps {
  id: string;
  name: string;
  slug: string;
  role: string;
  projects: {
    count: number;
    names: string[];
  };
}

const WorkspaceCard = ({
  id,
  name,
  slug,
  role,
  projects,
}: WorkspaceCardProps) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const color = getIdentityColor(id);

  return (
    <div className="relative flex flex-col gap-3 rounded-xl border border-border/60 bg-card p-4 shadow-sm transition-all hover:border-border hover:shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div
            className={cn(
              "size-2.5 shrink-0 rounded-full ring-1 ring-black/5 dark:ring-white/10",
              color.bg,
            )}
          />
          <h3 className="truncate text-sm font-semibold tracking-tight text-foreground">
            {name}
          </h3>
        </div>
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
                variant={ROLE_OWNER.includes(role) ? "destructive" : "default"}
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
      </div>
      <Badge
        variant="secondary"
        className="h-5 shrink-0 rounded-md px-1.5 text-[11px] font-medium text-muted-foreground"
      >
        {slug}
      </Badge>
      <p className="text-xs text-muted-foreground">
        {projects.count} active projects
      </p>
      <div className="mt-1 flex flex-col gap-1.5 text-xs text-muted-foreground">
        {projects.names.map((project, index) => (
          <div key={index} className="flex gap-2">
            <Hash className="size-3.5 shrink-0 opacity-70" />
            <span className="truncate">{project}</span>
          </div>
        ))}
        {projects.count === 0 && (
          <p className="text-xs text-muted-foreground">No projects yet</p>
        )}
      </div>
    </div>
  );
};

export default WorkspaceCard;
