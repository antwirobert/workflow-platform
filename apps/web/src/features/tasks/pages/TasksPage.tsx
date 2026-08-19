import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TasksListView from "../components/TasksListView";
import { useTasks } from "../hooks/useTasks";
import { useState } from "react";
import type { Priority, TaskStatus } from "@/types/task";
import { Separator } from "@/components/ui/separator";
import TaskFilters from "../components/TaskFilters";
import { DEFAULT_PAGE, DEFAULT_TABLE_LIMIT } from "@/constants";
import PaginationControls from "@/components/PaginationControls";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface TasksPageProps {
  orgSlug: string;
  workspaceSlug: string;
  projectSlug: string;
}

const TasksPage = ({ orgSlug, workspaceSlug, projectSlug }: TasksPageProps) => {
  const [page, setPage] = useState(DEFAULT_PAGE);
  const [limit, setLimit] = useState(DEFAULT_TABLE_LIMIT);
  const [status, setStatus] = useState<TaskStatus | "ALL">("ALL");
  const [priority, setPriority] = useState<Priority | "ALL">("ALL");

  const {
    data: tasks,
    isLoading,
    isFetching,
    isError,
  } = useTasks(orgSlug ?? null, workspaceSlug ?? null, projectSlug ?? null, {
    page,
    limit,
    status: status === "ALL" ? undefined : status,
    priority: priority === "ALL" ? undefined : priority,
  });

  function handleFilterChange<T>(setter: (value: T) => void) {
    return (value: T) => {
      setter(value);
      setPage(1);
    };
  }

  return (
    <div className="flex h-full flex-col p-4">
      <Tabs defaultValue="kanban-board" className="flex h-full flex-col">
        <div className="flex shrink-0 items-center justify-between gap-4">
          <TabsList variant="line" className="w-fit">
            <TabsTrigger value="kanban-board">Board</TabsTrigger>
            <TabsTrigger value="tasks-list">List</TabsTrigger>
          </TabsList>

          <TaskFilters
            status={status}
            onStatusChange={handleFilterChange(setStatus)}
            priority={priority}
            onPriorityChange={handleFilterChange(setPriority)}
          />
        </div>

        <Separator />

        <TabsContent value="kanban-board" className="mt-4 flex-1 overflow-auto">
          Make changes to your account here.
        </TabsContent>

        <TabsContent value="tasks-list" className="mt-4 flex-1 overflow-hidden">
          {tasks?.data && tasks.data.length === 0 && (
            <div className="flex min-h-52 items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 px-6 text-center">
              <div>
                <p className="text-sm font-medium text-foreground">
                  No tasks match these filters
                </p>
                <Button className="mt-2">
                  <Plus className="size-4" /> New task
                </Button>
              </div>
            </div>
          )}

          {!isError && (tasks?.data.length ?? 0) > 0 && (
            <>
              <TasksListView
                tasks={tasks!.data}
                isLoading={isLoading}
                isFetching={isFetching}
              />
              <PaginationControls
                currentPage={tasks!.meta.page}
                totalPages={tasks!.meta.totalPages}
                totalItems={tasks!.meta.total}
                onPageChange={setPage}
                onPageSizeChange={setLimit}
              />
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TasksPage;
