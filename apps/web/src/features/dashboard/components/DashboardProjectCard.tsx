// components/DashboardProjectCard.tsx
import { getIdentityColor, getInitials, timeAgo } from "@/lib/utils";

interface DashboardProjectCardProps {
  id: string;
  name: string;
  description?: string | null;
  updatedAt: string;
  /** 0–100; omit if you don't have progress yet */
  progress?: number;
}

export const DashboardProjectCard = ({
  id,
  name,
  description,
  updatedAt,
  progress,
}: DashboardProjectCardProps) => {
  const color = getIdentityColor(id);

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border/60 bg-card p-4 shadow-sm transition-all hover:border-border hover:shadow-md">
      <div className="flex items-center justify-between gap-2">
        <div
          className={`flex size-6 shrink-0 items-center justify-center rounded-md text-[10px] font-semibold ${color.bg} ${color.text}`}
        >
          {getInitials(name).slice(0, 2)}
        </div>
        <span className="text-[11px] text-muted-foreground">
          {timeAgo(updatedAt)}
        </span>
      </div>

      <div className="min-w-0 space-y-0.5">
        <h3 className="truncate text-sm font-semibold tracking-tight">
          {name}
        </h3>
        {description ? (
          <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
            {description}
          </p>
        ) : (
          <p className="text-xs text-muted-foreground/70">No description</p>
        )}
      </div>

      {typeof progress === "number" && (
        <div className="mt-auto space-y-1.5">
          <div className="h-1.5 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-foreground/80 transition-all"
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
          <p className="text-right text-[11px] tabular-nums text-muted-foreground">
            {progress}%
          </p>
        </div>
      )}
    </div>
  );
};
