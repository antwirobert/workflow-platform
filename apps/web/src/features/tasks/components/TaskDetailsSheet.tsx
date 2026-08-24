import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { Task } from "@/types/task";
import { Calendar, Ellipsis, Flag, Send, User, X } from "lucide-react";
import { TaskStatusBadge } from "./TaskStatusBadge";
import { TaskPriorityBadge } from "./TaskPriorityBadge";
import { Textarea } from "@/components/ui/textarea";

interface TaskDetailsSheetProps {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TaskDetailsSheet = ({
  task,
  open,
  onOpenChange,
}: TaskDetailsSheetProps) => {
  if (!task) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        showCloseButton={false}
        className="flex w-full flex-col gap-0 p-0 sm:max-w-md"
      >
        <SheetHeader className="space-y-0 p-0 text-left">
          <div className="flex items-center justify-between px-4 py-3">
            <TaskStatusBadge status={task.status} />
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="size-8">
                <Ellipsis className="size-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="size-8"
                onClick={() => onOpenChange(false)}
              >
                <X className="size-4" />
              </Button>
            </div>
          </div>

          <Separator />

          <div className="px-4 py-4">
            <SheetTitle className="text-lg font-semibold tracking-tight leading-snug">
              {task.title}
            </SheetTitle>
          </div>

          <Separator />

          <div className="flex flex-col gap-3 px-4 py-4">
            <div className="flex items-center gap-3">
              <span className="flex w-28 shrink-0 items-center gap-2 text-xs text-muted-foreground">
                <User className="size-3.5 opacity-70" />
                Assignee
              </span>
              <div className="flex gap-2">
                <span className="text-sm">Jordan Smith</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="flex w-28 shrink-0 items-center gap-2 text-xs text-muted-foreground">
                <Flag className="size-3.5 opacity-70" />
                Priority
              </span>
              <TaskPriorityBadge priority={task.priority} />
            </div>

            <div className="flex items-center gap-3">
              <span className="flex w-28 shrink-0 items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="size-3.5 opacity-70" />
                Due date
              </span>
              <span className="text-sm tabular-nums text-muted-foreground">
                {task.dueDate
                  ? new Date(task.dueDate).toLocaleDateString()
                  : "—"}
              </span>
            </div>
          </div>

          <Separator />

          <div className="px-4 py-4">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Description
            </p>
            <SheetDescription className="text-sm leading-relaxed text-foreground">
              {task.description || (
                <span className="text-muted-foreground">No description</span>
              )}
            </SheetDescription>
          </div>
        </SheetHeader>

        <SheetFooter className="mt-auto gap-2 border-t px-4 py-3 sm:flex-row sm:items-end">
          <Textarea
            placeholder="Write a comment..."
            className="min-h-18 resize-none text-sm"
          />
          <Button size="sm" className="shrink-0 gap-1.5">
            <Send className="size-3.5" />
            Send
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default TaskDetailsSheet;
