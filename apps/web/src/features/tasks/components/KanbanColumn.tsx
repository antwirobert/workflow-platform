import { useDroppable } from "@dnd-kit/core";
import { KanbanCard } from "./KanbanCard";
import type { Task, TaskStatus } from "@/types/task";
import { cn } from "@/lib/utils";

const statusLabels: Record<TaskStatus, string> = {
  TODO: "Todo",
  IN_PROGRESS: "In Progress",
  IN_REVIEW: "In Review",
  DONE: "Done",
  CANCELLED: "Cancelled",
};

const statusDot: Record<TaskStatus, string> = {
  TODO: "bg-secondary-foreground/40",
  IN_PROGRESS: "bg-blue-500",
  IN_REVIEW: "bg-amber-500",
  DONE: "bg-emerald-500",
  CANCELLED: "bg-muted-foreground/50",
};

interface KanbanColumnProps {
  status: TaskStatus;
  tasks: Task[];
  isPlaceholderData: boolean;
  onTaskClick: (taskId: string) => void;
}

export function KanbanColumn({
  status,
  tasks,
  isPlaceholderData,
  onTaskClick,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex w-72 shrink-0 flex-col rounded-xl border border-border/60 bg-muted/30 p-3 transition-colors",
        isOver && "border-border bg-accent/50 ring-2 ring-ring/20",
      )}
    >
      <div className="mb-3 flex items-center justify-between px-0.5">
        <div className="flex items-center gap-2">
          <span
            className={cn("size-1.5 shrink-0 rounded-full", statusDot[status])}
          />
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {statusLabels[status]}
          </span>
        </div>

        <span className="flex h-5 min-w-5 items-center justify-center rounded-md bg-background/80 px-1.5 text-[11px] font-medium tabular-nums text-muted-foreground">
          {tasks.length}
        </span>
      </div>
      <div
        className={cn(
          "flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto",
          isPlaceholderData ? "opacity-60 pointer-events-none select-none" : "",
        )}
      >
        {tasks.map((task) => (
          <KanbanCard key={task.id} task={task} onTaskClick={onTaskClick} />
        ))}

        {tasks.length === 0 && (
          <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-border/80 px-3 py-8">
            <p className="text-xs text-muted-foreground/70">No tasks</p>
          </div>
        )}
      </div>
    </div>
  );
}
