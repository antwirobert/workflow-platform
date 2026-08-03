import { cn, getIdentityColor, getInitials } from "@/lib/utils";
import { Link } from "react-router-dom";

interface ProjectCardProps {
  id: string;
  name: string;
  description: string | null;
  targetOrgId: string;
  targetWorkspaceId: string;
}

const ProjectCard = ({
  id,
  name,
  description,
  targetOrgId,
  targetWorkspaceId,
}: ProjectCardProps) => {
  const color = getIdentityColor(id);

  return (
    <Link
      to={`/organizations/${targetOrgId}/workspaces/${targetWorkspaceId}/projects/${id}`}
      className="group relative flex flex-col gap-3 rounded-xl border border-border/60 bg-card p-4 shadow-sm transition-all hover:border-border hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-lg text-xs font-semibold",
            color.bg,
            color.text,
          )}
        >
          {getInitials(name)}
        </div>
        <span className="text-[11px] text-muted-foreground tabular-nums">
          2h ago
        </span>
      </div>
      <div className="flex min-w-0 flex-col gap-1">
        <h3 className="truncate text-sm font-semibold tracking-tight text-foreground">
          {name}
        </h3>

        {description && (
          <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}
      </div>
    </Link>
  );
};

export default ProjectCard;
