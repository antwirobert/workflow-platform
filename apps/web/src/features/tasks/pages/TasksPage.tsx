import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TasksListView from "../components/TasksListView";
import { useTasks } from "../hooks/useTasks";
import { useParams } from "react-router-dom";
import { useState } from "react";
import type { Priority, TaskStatus } from "@/types/task";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import TaskFilters from "../components/TaskFilters";

const LIMIT = 20;

const TasksPage = () => {
  const { orgSlug, workspaceSlug, projectSlug } = useParams<{
    orgSlug: string;
    workspaceSlug: string;
    projectSlug: string;
  }>();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<TaskStatus | "ALL">("ALL");
  const [priority, setPriority] = useState<Priority | "ALL">("ALL");

  const { data, isLoading, isFetching, isError } = useTasks(
    orgSlug ?? null,
    workspaceSlug ?? null,
    projectSlug ?? null,
    {
      page,
      limit: LIMIT,
      status: status === "ALL" ? undefined : status,
      priority: priority === "ALL" ? undefined : priority,
    },
  );

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
          {!isError && (data?.data.length ?? 0) > 0 && (
            <>
              <TasksListView
                tasks={data!.data}
                isLoading={isLoading}
                isFetching={isFetching}
              />
              <div className="flex justify-between mt-6">
                <p>
                  Page {data?.meta.page} of {data?.meta.totalPages} (
                  {data?.meta.total} total)
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setPage((prev) => prev - 1)}
                    disabled={page <= 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setPage((prev) => prev + 1)}
                    disabled={!data || page >= data.meta.totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TasksPage;
