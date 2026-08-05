import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { TaskStatus } from "@/types/task";

const statusConfig: Record<TaskStatus, { label: string; className: string }> = {
  TODO: {
    label: "Todo",
    className: "bg-secondary text-secondary-foreground border-transparent",
  },
  IN_PROGRESS: {
    label: "In Progress",
    className:
      "bg-blue-50 text-blue-700 border-blue-200/60 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800/50",
  },
  IN_REVIEW: {
    label: "In Review",
    className:
      "bg-amber-50 text-amber-700 border-amber-200/60 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800/50",
  },
  DONE: {
    label: "Done",
    className:
      "bg-emerald-50 text-emerald-700 border-emerald-200/60 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800/50",
  },
  CANCELLED: {
    label: "Cancelled",
    className:
      "bg-muted/60 text-muted-foreground border-transparent line-through",
  },
};

export const TaskStatusBadge = ({ status }: { status: TaskStatus }) => {
  const config = statusConfig[status];

  return (
    <Badge
      variant="outline"
      className={cn(
        "h-5 rounded-md px-1.5 text-[11px] font-medium",
        config.className,
      )}
    >
      {config.label}
    </Badge>
  );
};
