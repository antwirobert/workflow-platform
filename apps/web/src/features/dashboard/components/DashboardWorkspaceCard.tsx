import { cn, getIdentityColor, timeAgo } from "@/lib/utils";

interface DashboardWorkspaceCardProps {
  id: string;
  name: string;
  updatedAt: string;
}

export const DashboardWorkspaceCard = ({
  id,
  name,
  updatedAt,
}: DashboardWorkspaceCardProps) => {
  const color = getIdentityColor(id);

  return (
    <div className="group flex flex-col gap-3 rounded-xl border border-border/60 bg-card p-4 shadow-sm transition-all hover:border-border hover:shadow-md">
      <div className="flex items-center justify-between gap-2">
        <div
          className={cn(
            "size-2.5 shrink-0 rounded-full ring-1 ring-black/5 dark:ring-white/10",
            color.bg,
          )}
        />
        <span className="text-[11px] tabular-nums text-muted-foreground">
          {timeAgo(updatedAt)}
        </span>
      </div>

      <h3 className="truncate text-sm font-semibold tracking-tight text-foreground">
        {name}
      </h3>
    </div>
  );
};
