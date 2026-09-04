import { useState } from "react";
import { Link } from "react-router-dom";
import { getIdentityColor } from "@/lib/utils";
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
import {
  DEFAULT_PAGE,
  DEFAULT_SIDEBAR_LIMIT,
  ROLES_MANAGEMENT,
} from "@/constants";
import EditProjectDialog from "./EditProjectDialog";
import DeleteProjectDialog from "./DeleteProjectDialog";
import { useProjectAssignees } from "../hooks/useProjectAssignees";
import TextAvatar from "@/components/TextAvatar";
import ProgressBar from "@/components/ProgressBar";
import { useActiveOrganization } from "@/features/organizations/hooks/useActiveOrganization";

interface ProjectCardProps {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  targetOrgSlug: string;
  targetWorkspaceSlug: string;
  totalTaskCount?: number;
  completedTaskCount?: number;
}

const ProjectCard = ({
  id,
  slug,
  name,
  description,
  targetOrgSlug,
  targetWorkspaceSlug,
  totalTaskCount,
  completedTaskCount,
}: ProjectCardProps) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const {
    data: projectAssignees,
    isLoading,
    isError,
  } = useProjectAssignees(
    targetOrgSlug ?? null,
    targetWorkspaceSlug ?? null,
    slug ?? null,
    {
      page: DEFAULT_PAGE,
      limit: DEFAULT_SIDEBAR_LIMIT,
    },
  );
  const { activeOrganization } = useActiveOrganization();

  const isPriviledged = ROLES_MANAGEMENT.includes(
    activeOrganization?.role ?? "",
  );

  const color = getIdentityColor(id);
  const completed = completedTaskCount ?? 0;
  const total = totalTaskCount ?? 0;

  const progressPercentage =
    total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="min-w-0">
      <Link
        to={`/organizations/${targetOrgSlug}/workspaces/${targetWorkspaceSlug}/projects/${slug}`}
        className="group relative h-full flex flex-col gap-3 rounded-xl border border-border/60 bg-card px-4 pt-4 shadow-sm transition-all hover:border-border hover:shadow-md"
      >
        <div className="flex items-center justify-between gap-3">
          <TextAvatar
            name={name}
            colorClass={color.bg}
            textClass={color.text}
            className="size-10 rounded-lg text-sm font-semibold"
          />

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
                      disabled={!isPriviledged}
                      className="cursor-pointer gap-2 rounded-md px-2 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-100"
                    >
                      {isPriviledged ? (
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
                      disabled={!isPriviledged}
                      className={
                        isPriviledged
                          ? "cursor-pointer gap-2 rounded-md px-2 py-1.5 text-sm text-destructive focus:bg-destructive/10 focus:text-destructive [&_svg]:text-destructive"
                          : "cursor-not-allowed gap-2 rounded-md px-2 py-1.5 text-sm disabled:opacity-100"
                      }
                      variant="destructive"
                    >
                      {isPriviledged ? (
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
            className="flex gap-[1.2px] h-5 w-fit rounded-md px-1.5 text-[11px] font-medium text-muted-foreground"
          >
            <span>/</span>
            {slug}
          </Badge>
          {description && (
            <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
              {description}
            </p>
          )}
          <div className="flex items-center justify-between gap-2">
            {!isLoading &&
              !isError &&
              (projectAssignees?.data.length ?? 0) > 0 && (
                <div className="flex -space-x-2">
                  {projectAssignees?.data.slice(0, 3).map((assignee) => {
                    const color = getIdentityColor(assignee.id);

                    return (
                      <TextAvatar
                        key={assignee.id}
                        name={assignee.name}
                        colorClass={color.bg}
                        textClass={color.text}
                        className="size-7 rounded-full text-[10px] font-semibold ring-2 ring-card"
                      />
                    );
                  })}

                  {(projectAssignees?.data.length ?? 0) > 3 && (
                    <div className="flex size-7 items-center justify-center rounded-full bg-muted text-[10px] font-medium text-muted-foreground ring-2 ring-card">
                      +{(projectAssignees?.data.length ?? 0) - 3}
                    </div>
                  )}
                </div>
              )}

            <div className="flex items-center gap-1">
              <p className="text-xs text-muted-foreground">
                {totalTaskCount} {totalTaskCount === 1 ? "task" : "tasks"}
              </p>
              <span className="text-muted-foreground/40">•</span>
              <span className="text-[11px] tabular-nums text-muted-foreground">
                {progressPercentage}%
              </span>
            </div>
          </div>
          <div className="mt-2">
            <ProgressBar progress={progressPercentage} />
          </div>
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
