import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  DEFAULT_PAGE,
  DEFAULT_WORKSPACE_PROJECTS_LIMIT,
  ROLES_MANAGEMENT,
} from "@/constants";
import { useActiveOrganization } from "@/features/organizations/hooks/useActiveOrganization";
import { useProjects } from "@/features/projects/hooks/useProjects";
import { cn, getIdentityColor } from "@/lib/utils";
import { Ellipsis, Hash, Lock, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import EditWorkspaceDialog from "./EditWorkspaceDialog";
import DeleteWorkspaceDialog from "./DeleteWorkspaceDialog";

interface WorkspaceCardProps {
  id: string;
  name: string;
  slug: string;
  role?: string;
  projectCount?: number;
}

const WorkspaceCard = ({
  id,
  name,
  slug,
  role,
  projectCount,
}: WorkspaceCardProps) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const color = getIdentityColor(id);
  const { activeOrganization } = useActiveOrganization();
  const { data: projects, isError } = useProjects(
    activeOrganization!.slug,
    slug,
    {
      page: DEFAULT_PAGE,
      limit: DEFAULT_WORKSPACE_PROJECTS_LIMIT,
    },
  );

  return (
    <div className="min-w-0 h-full">
      <Link
        to={`/organizations/${activeOrganization!.slug}/workspaces/${slug}`}
        className="group cursor-pointer relative h-full flex flex-col gap-3 rounded-xl border border-border/60 bg-card p-4 shadow-sm transition-all hover:border-border hover:shadow-md"
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2.5">
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
                        Edit workspace
                      </>
                    ) : (
                      <div className="flex items-start gap-2 py-0.5">
                        <Lock className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
                        <div className="flex flex-col gap-0.5">
                          <span className="text-sm text-muted-foreground">
                            Edit workspace
                          </span>
                          <span className="text-[11px] leading-snug text-muted-foreground/70">
                            Only the creator, an admin, or the owner can edit
                            this workspace
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
                        Delete workspace
                      </>
                    ) : (
                      <div className="flex items-start gap-2 py-0.5">
                        <Lock className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
                        <div className="flex flex-col gap-0.5">
                          <span className="text-sm text-muted-foreground">
                            Delete workspace
                          </span>
                          <span className="text-[11px] leading-snug text-muted-foreground/70">
                            Only the creator, an admin, or the owner can delete
                            this workspace
                          </span>
                        </div>
                      </div>
                    )}
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <Badge
          variant="secondary"
          className="h-5 w-fit rounded-md px-1.5 text-[11px] font-medium text-muted-foreground"
        >
          {slug}
        </Badge>

        <p className="text-xs text-muted-foreground">
          {projectCount}{" "}
          {projectCount === 1 ? "active project" : "active projects"}
        </p>

        <div className="flex flex-col gap-1.5">
          {!isError &&
            (projects?.data.length ?? 0) > 0 &&
            projects?.data.map((project) => (
              <div
                key={project.id}
                className="flex items-center gap-2 text-xs text-muted-foreground"
              >
                <Hash className="size-3.5 shrink-0 opacity-70" />
                <span className="truncate">{project.name}</span>
              </div>
            ))}

          {projectCount === 0 && (
            <p className="text-xs text-muted-foreground/70">No projects yet</p>
          )}
        </div>
      </Link>

      <EditWorkspaceDialog
        name={name}
        workspaceSlug={slug}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
      />

      <DeleteWorkspaceDialog
        name={name}
        workspaceSlug={slug}
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
      />
    </div>
  );
};

export default WorkspaceCard;
