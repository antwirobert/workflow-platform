import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import type { Task } from "@/types/task";
import { TaskPriorityBadge } from "./TaskPriorityBadge";
import { cn, getIdentityColor, getInitials } from "@/lib/utils";

interface KanbanCardProps {
  task: Task;
  onTaskClick: (taskId: string) => void;
}

export function KanbanCard({ task, onTaskClick }: KanbanCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: task.id });

  const style = transform
    ? { transform: CSS.Translate.toString(transform) }
    : undefined;

  const assigneeColor = task.assignee?.id
    ? getIdentityColor(task.assignee.id)
    : null;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={() => {
        if (isDragging) return;
        onTaskClick(task.id);
      }}
      className={cn(
        "group cursor-grab touch-none rounded-lg border border-border/60 bg-card p-3 shadow-sm transition-all",
        "hover:border-border hover:shadow-md",
        "active:cursor-grabbing",
        isDragging && "opacity-40 shadow-none",
      )}
    >
      <p className="mb-2.5 line-clamp-2 text-sm font-medium leading-snug text-foreground">
        {task.title || "Untitled task"}
      </p>

      <div className="flex items-center justify-between gap-2">
        <TaskPriorityBadge priority={task.priority} />

        {task.assignee?.name && assigneeColor && (
          <div
            className={cn(
              "flex size-6 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold",
              assigneeColor.bg,
              assigneeColor.text,
            )}
            title={task.assignee.name}
          >
            {getInitials(task.assignee.name)}
          </div>
        )}
      </div>
    </div>
  );
}
