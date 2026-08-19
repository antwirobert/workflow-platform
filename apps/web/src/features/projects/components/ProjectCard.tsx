import { useState } from "react";
import { Link } from "react-router-dom";
import { cn, getIdentityColor, getInitials } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ellipsis, Lock, Pencil, Trash2 } from "lucide-react";
import { ROLES_MANAGEMENT } from "@/constants";
import EditProjectDialog from "./EditProjectDialog";
import DeleteProjectDialog from "./DeleteProjectDialog";

interface ProjectCardProps {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  targetOrgSlug: string;
  targetWorkspaceSlug: string;
  role?: string;
  taskCount?: number;
}

const ProjectCard = ({
  id,
  slug,
  name,
  description,
  targetOrgSlug,
  targetWorkspaceSlug,
  role,
  taskCount,
}: ProjectCardProps) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const color = getIdentityColor(id);

  return (
    <div className="min-w-0 h-full">
      <Link
        to={`/organizations/${targetOrgSlug}/workspaces/${targetWorkspaceSlug}/projects/${slug}`}
        className="group relative h-full flex flex-col gap-3 rounded-xl border border-border/60 bg-card p-4 shadow-sm transition-all hover:border-border hover:shadow-md"
      >
        <div className="flex items-center justify-between gap-3">
          <div
            className={cn(
              "flex size-9 shrink-0 items-center justify-center rounded-lg text-xs font-semibold",
              color.bg,
              color.text,
            )}
          >
            {getInitials(name)}
          </div>
          <div className="flex flex-col">
            <div
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 shrink-0 data-[state=open]:opacity-100"
                    >
                      <Ellipsis className="size-4" />
                    </Button>
                  }
                />
                <DropdownMenuContent className="w-52 p-1" align="end">
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      onClick={() => setIsEditOpen(true)}
                      disabled={!ROLES_MANAGEMENT.includes(role!)}
                      className="cursor-pointer gap-2 rounded-md px-2 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-100"
                    >
                      {ROLES_MANAGEMENT.includes(role!) ? (
                        <>
                          <Pencil className="size-3.5 text-muted-foreground" />
                          Edit project
                        </>
                      ) : (
                        <div className="flex items-start gap-2 py-0.5">
                          <Lock className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
                          <div className="flex flex-col gap-0.5">
                            <span className="text-sm text-muted-foreground">
                              Edit project
                            </span>
                            <span className="text-[11px] leading-snug text-muted-foreground/70">
                              Only the creator, an admin, or the owner can edit
                              this project
                            </span>
                          </div>
                        </div>
                      )}
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => setIsDeleteOpen(true)}
                      disabled={!ROLES_MANAGEMENT.includes(role!)}
                      className={
                        ROLES_MANAGEMENT.includes(role!)
                          ? "cursor-pointer gap-2 rounded-md px-2 py-1.5 text-sm text-destructive focus:bg-destructive/10 focus:text-destructive [&_svg]:text-destructive"
                          : "cursor-not-allowed gap-2 rounded-md px-2 py-1.5 text-sm disabled:opacity-100"
                      }
                      variant="destructive"
                    >
                      {ROLES_MANAGEMENT.includes(role!) ? (
                        <>
                          <Trash2 className="size-3.5" />
                          Delete project
                        </>
                      ) : (
                        <div className="flex items-start gap-2 py-0.5">
                          <Lock className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
                          <div className="flex flex-col gap-0.5">
                            <span className="text-sm text-muted-foreground">
                              Delete project
                            </span>
                            <span className="text-[11px] leading-snug text-muted-foreground/70">
                              Only the creator, an admin, or the owner can
                              delete this project
                            </span>
                          </div>
                        </div>
                      )}
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <span className="text-[11px] text-muted-foreground tabular-nums">
              2h ago
            </span>
          </div>
        </div>
        <div className="flex min-w-0 flex-col gap-1">
          <h3 className="truncate text-sm font-semibold tracking-tight text-foreground">
            {name}
          </h3>
          <Badge
            variant="secondary"
            className="h-5 w-fit rounded-md px-1.5 text-[11px] font-medium text-muted-foreground"
          >
            {slug}
          </Badge>
          {description && (
            <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
              {description}
            </p>
          )}
          <p className="text-xs text-muted-foreground">{taskCount} tasks</p>
        </div>
      </Link>

      <EditProjectDialog
        name={name}
        description={description ?? ""}
        projectSlug={slug}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
      />

      <DeleteProjectDialog
        name={name}
        projectSlug={slug}
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
      />
    </div>
  );
};

export default ProjectCard;
