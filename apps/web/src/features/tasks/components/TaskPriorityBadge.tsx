import { cn } from "@/lib/utils";
import type { Priority } from "@/types/task";

const priorityConfig: Record<
  Priority,
  { label: string; dot: string; className: string }
> = {
  LOW: {
    label: "Low",
    dot: "bg-muted-foreground/50",
    className: "text-muted-foreground",
  },
  MEDIUM: {
    label: "Medium",
    dot: "bg-blue-500",
    className: "text-blue-600 dark:text-blue-400",
  },
  HIGH: {
    label: "High",
    dot: "bg-orange-500",
    className: "text-orange-600 dark:text-orange-400",
  },
  URGENT: {
    label: "Urgent",
    dot: "bg-red-500",
    className: "text-red-600 dark:text-red-400",
  },
};

export const TaskPriorityBadge = ({ priority }: { priority: Priority }) => {
  const config = priorityConfig[priority];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-xs font-medium",
        config.className,
      )}
    >
      <span className={cn("size-1.5 shrink-0 rounded-full", config.dot)} />
      {config.label}
    </span>
  );
};
