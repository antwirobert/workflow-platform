import { useRelativeTime } from "@/hooks/useRelativeTime";
import { cn, getIdentityColor } from "@/lib/utils";
import { useWorkspaceStore } from "@/stores/workspaceStore";
import { useNavigate, useParams } from "react-router-dom";

interface DashboardWorkspaceCardProps {
  id: string;
  name: string;
  workspaceSlug: string;
  updatedAt: string;
}

export const DashboardWorkspaceCard = ({
  id,
  name,
  workspaceSlug,
  updatedAt,
}: DashboardWorkspaceCardProps) => {
  const navigate = useNavigate();
  const setActiveWorkspaceSlug = useWorkspaceStore(
    (state) => state.setActiveWorkspaceSlug,
  );
  const { orgSlug } = useParams<{ orgSlug: string }>();
  const relativeText = useRelativeTime(updatedAt);
  const color = getIdentityColor(id);

  return (
    <div
      onClick={() => {
        setActiveWorkspaceSlug(workspaceSlug);
        navigate(`/organizations/${orgSlug}/workspaces/${workspaceSlug}`);
      }}
      className="group flex flex-col gap-3 rounded-xl border border-border/60 bg-card p-4 shadow-sm transition-all hover:border-border hover:shadow-md hover:cursor-pointer"
    >
      <div className="flex items-center justify-between gap-2">
        <div
          className={cn(
            "size-2.5 shrink-0 rounded-full ring-1 ring-black/5 dark:ring-white/10",
            color.bg,
          )}
        />
        <span className="text-[11px] tabular-nums text-muted-foreground">
          {relativeText}
        </span>
      </div>

      <h3 className="truncate text-sm font-semibold tracking-tight text-foreground">
        {name}
      </h3>
    </div>
  );
};
