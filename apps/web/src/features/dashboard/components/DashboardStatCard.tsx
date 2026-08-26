// components/DashboardStatCard.tsx
import type { LucideIcon } from "lucide-react";

interface DashboardStatCardProps {
  label: string;
  value: number;
  hint: string;
  icon: LucideIcon;
}

export const DashboardStatCard = ({
  label,
  value,
  hint,
  icon: Icon,
}: DashboardStatCardProps) => {
  return (
    <div className="rounded-xl border border-border/60 bg-card p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2 text-muted-foreground">
        <Icon className="size-3.5 opacity-70" />
        <span className="text-xs font-medium">{label}</span>
      </div>
      <p className="text-2xl font-semibold tracking-tight tabular-nums">
        {value}
      </p>
      <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>
    </div>
  );
};
