import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { useKanbanTasks } from "../hooks/useKanbanTasks";
import { useUpdateTaskStatus } from "../hooks/useUpdateTaskStatus";
import { KanbanCard } from "./KanbanCard";
import type { Priority, TaskStatus } from "@/types/task";
import { KanbanColumn } from "./KanbanColumn";
import { DEFAULT_PAGE, DEFAULT_SIDEBAR_LIMIT } from "@/constants";
import TaskDetailsSheet from "./TaskDetailsSheet";

const STATUSES: TaskStatus[] = [
  "TODO",
  "IN_PROGRESS",
  "IN_REVIEW",
  "DONE",
  "CANCELLED",
];

interface KanbanBoardProps {
  status: TaskStatus | "ALL";
  priority: Priority | "ALL";
  assignee: string | "ALL";
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface KanbanRouteParams {
  [key: string]: string | undefined;
  orgSlug: string;
  workspaceSlug: string;
  projectSlug: string;
}

export function KanbanBoard({
  status,
  priority,
  assignee,
  open,
  onOpenChange,
}: KanbanBoardProps) {
  const { orgSlug, workspaceSlug, projectSlug } =
    useParams<KanbanRouteParams>();
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const { columns, isLoading, isPlaceholderData } = useKanbanTasks(
    orgSlug ?? null,
    workspaceSlug ?? null,
    projectSlug ?? null,
    {
      page: DEFAULT_PAGE,
      limit: DEFAULT_SIDEBAR_LIMIT,
      status: status === "ALL" ? undefined : status,
      priority: priority === "ALL" ? undefined : priority,
      assigneeId: assignee === "ALL" ? undefined : assignee,
    },
  );
  const { mutate: updateStatus } = useUpdateTaskStatus(
    orgSlug ?? "",
    workspaceSlug ?? "",
    projectSlug ?? "",
  );

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  function handleDragEnd(event: DragEndEvent): void {
    setActiveTaskId(null);
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as TaskStatus;

    const currentTask = Object.values(columns)
      .flat()
      .find((t) => t.id === taskId);
    if (!currentTask || currentTask.status === newStatus) return;

    updateStatus({ taskId, status: newStatus });
  }

  function handleDragStart(event: DragStartEvent): void {
    setActiveTaskId(event.active.id as string);
  }

  if (isLoading) {
    return (
      <div className="flex h-full gap-4 overflow-x-auto px-1 pb-4">
        {STATUSES.map((status) => (
          <div
            key={status}
            className="flex w-72 shrink-0 flex-col gap-3 rounded-xl border border-border/60 bg-muted/30 p-3"
          >
            <div className="flex items-center justify-between px-1">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-5 w-6 rounded-md" />
            </div>
            <div className="flex flex-col gap-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="flex flex-col gap-2 rounded-lg border border-border/60 bg-card p-3"
                >
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <div className="mt-1 flex items-center justify-between">
                    <Skeleton className="h-5 w-14 rounded-md" />
                    <Skeleton className="size-6 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  const allTasks = Object.values(columns).flat();

  const activeTask = activeTaskId
    ? allTasks.find((t) => t.id === activeTaskId)
    : null;

  const selectedTask = selectedTaskId
    ? allTasks.find((t) => t.id === selectedTaskId)
    : null;

  const handleTaskClick = (taskId: string) => {
    setSelectedTaskId(taskId);
    onOpenChange(true);
  };

  return (
    <>
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex h-full gap-4 overflow-x-auto px-1 pb-4">
          {STATUSES.map((status) => (
            <KanbanColumn
              key={status}
              status={status}
              tasks={columns[status]}
              isPlaceholderData={isPlaceholderData}
              onTaskClick={handleTaskClick}
            />
          ))}
        </div>

        <DragOverlay dropAnimation={null}>
          {activeTask ? (
            <div className="rotate-1 scale-105 opacity-95 shadow-lg">
              <KanbanCard task={activeTask} onTaskClick={() => {}} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <TaskDetailsSheet
        task={selectedTask ?? null}
        open={open}
        onOpenChange={(isOpen) => {
          onOpenChange(isOpen);
          if (!isOpen) setActiveTaskId(null);
        }}
      />
    </>
  );
}
