import { cn, getIdentityColor } from "@/lib/utils";
import { Hash } from "lucide-react";

interface WorkspaceCardProps {
  id: string;
  name: string;
}

const WorkspaceCard = ({ id, name }: WorkspaceCardProps) => {
  const color = getIdentityColor(id);

  return (
    <div className="group relative flex flex-col gap-3 rounded-xl border border-border/60 bg-card p-4 shadow-sm transition-all hover:border-border hover:shadow-md">
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
      <p className="text-xs text-muted-foreground">3 active projects</p>
      <div className="mt-1 flex flex-col gap-1.5">
        <span className="flex items-center gap-2 text-xs text-muted-foreground">
          <Hash className="size-3.5 shrink-0 opacity-70" />
          <span className="truncate">Core Platform</span>
        </span>
        <span className="flex items-center gap-2 text-xs text-muted-foreground">
          <Hash className="size-3.5 shrink-0 opacity-70" />
          <span className="truncate">Design System</span>
        </span>
        <span className="flex items-center gap-2 text-xs text-muted-foreground">
          <Hash className="size-3.5 shrink-0 opacity-70" />
          <span className="truncate">Mobile Client v2</span>
        </span>
      </div>
    </div>
  );
};

export default WorkspaceCard;
