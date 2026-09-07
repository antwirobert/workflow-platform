import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import type { Task } from "@/types/task";
import { cn, formatDueDate, getIdentityColor } from "@/lib/utils";
import TextAvatar from "@/components/TextAvatar";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Paperclip } from "lucide-react";

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
        {task.title}
      </p>

      {task.labels.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {task.labels.map((label) => (
            <Badge
              key={label}
              variant="secondary"
              className="h-5 rounded-md px-1.5 text-[11px] font-medium text-muted-foreground"
            >
              {label}
            </Badge>
          ))}
        </div>
      )}

      <div className="mt-3 flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <MessageSquare className="size-3.5 opacity-70" />
            {task.commentCount}
          </span>

          <span className="flex items-center gap-1">
            <Paperclip className="size-3.5 opacity-70" />
            {task.fileCount}
          </span>

          {task.dueDate && (
            <span className="tabular-nums">{formatDueDate(task.dueDate)}</span>
          )}
        </div>

        {task.assignee?.name && assigneeColor && (
          <TextAvatar
            name={task.assignee.name}
            colorClass={assigneeColor.bg}
            textClass={assigneeColor.text}
            className="size-6 shrink-0 rounded-full text-[10px] font-semibold"
          />
        )}
      </div>
    </div>
  );
}
