import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TasksListView from "../components/TasksListView";
import { useTasks } from "../hooks/useTasks";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import TaskFilters from "../components/TaskFilters";
import PaginationControls from "@/components/PaginationControls";
import CreateTaskDialog from "../components/CreateTaskDialog";
import { KanbanBoard } from "../components/KanbanBoard";
import { usePagination } from "@/hooks/usePagination";
import { useTaskFilters } from "../hooks/useTaskFilters";

interface TasksPageProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orgSlug: string;
  workspaceSlug: string;
  projectSlug: string;
}

const TasksPage = ({
  open,
  onOpenChange,
  orgSlug,
  workspaceSlug,
  projectSlug,
}: TasksPageProps) => {
  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);
  const { page, limit, onPageChange, onPageSizeChange } = usePagination();
  const {
    status,
    priority,
    assignee,
    onStatusChange,
    onPriorityChange,
    onAssigneeChange,
  } = useTaskFilters();

  const {
    data: tasks,
    isError,
    isFetching,
    refetch,
    isPlaceholderData,
  } = useTasks(orgSlug ?? null, workspaceSlug ?? null, projectSlug ?? null, {
    page,
    limit,
    status: status === "ALL" ? undefined : status,
    priority: priority === "ALL" ? undefined : priority,
    assigneeId: assignee === "ALL" ? undefined : assignee,
  });

  return (
    <div className="flex h-full flex-col py-4">
      <Tabs defaultValue="kanban-board" className="flex h-full flex-col">
        <div className="flex shrink-0 items-center justify-between gap-4">
          <TabsList variant="line" className="w-fit">
            <TabsTrigger value="kanban-board">Board</TabsTrigger>
            <TabsTrigger value="tasks-list">List</TabsTrigger>
          </TabsList>

          <TaskFilters
            orgSlug={orgSlug}
            status={status}
            onStatusChange={(value) => onStatusChange(value)}
            priority={priority}
            onPriorityChange={(value) => onPriorityChange(value)}
            assignee={assignee}
            onAssigneeChange={(value) => onAssigneeChange(value)}
          />
        </div>

        <Separator />

        <TabsContent value="kanban-board" className="mt-4 flex-1 overflow-auto">
          <KanbanBoard
            status={status}
            priority={priority}
            assignee={assignee}
            open={isSheetOpen}
            onOpenChange={setIsSheetOpen}
          />
        </TabsContent>

        <TabsContent value="tasks-list" className="mt-4 flex-1 overflow-hidden">
          {tasks?.data && tasks.data.length === 0 && (
            <div className="flex min-h-52 items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 px-6 text-center">
              <div className="flex flex-col gap-3">
                <p className="text-sm font-medium text-foreground">
                  No tasks match these filters
                </p>
                <CreateTaskDialog
                  open={open}
                  onOpenChange={onOpenChange}
                  orgSlug={orgSlug}
                  workspaceSlug={workspaceSlug}
                  projectSlug={projectSlug}
                />
              </div>
            </div>
          )}

          {!isError && (tasks?.data.length ?? 0) > 0 && (
            <>
              <TasksListView
                tasks={tasks!.data}
                isError={isError}
                isFetching={isFetching}
                refetch={refetch}
                open={isSheetOpen}
                onOpenChange={setIsSheetOpen}
              />

              <PaginationControls
                currentPage={page}
                limit={limit}
                onPageChange={(newPage) => onPageChange(newPage)}
                onPageSizeChange={(size) => onPageSizeChange(size)}
                totalItems={tasks!.meta.total}
                totalPages={tasks!.meta.totalPages}
                isPlaceholderData={isPlaceholderData}
              />
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TasksPage;
