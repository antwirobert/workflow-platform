import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserTaskFilters from "../components/UserTaskFilters";
import { useParams } from "react-router-dom";
import { useOrganizationTasks } from "@/features/organizations/hooks/useOrganizationTasks";
import { usePagination } from "@/hooks/usePagination";
import { useUserTaskFilters } from "../hooks/useUserTaskFilters";
import TasksTable from "../components/TasksTable";
import { useState } from "react";
import PaginationControls from "@/components/PaginationControls";
import { CheckSquare } from "lucide-react";

const UserTasksPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { orgSlug } = useParams<{ orgSlug: string }>();
  const { page, limit, onPageChange, onPageSizeChange } = usePagination();

  const {
    search,
    status,
    priority,
    activeTab,
    onSearchChange,
    onStatusChange,
    onPriorityChange,
    onTabChange,
  } = useUserTaskFilters();

  const {
    data: tasks,
    isLoading,
    isError,
    isFetching,
    refetch,
    isPlaceholderData,
  } = useOrganizationTasks(
    orgSlug ?? null,
    {
      page,
      limit,
      status: status === "ALL" ? undefined : status,
      priority: priority === "ALL" ? undefined : priority,
      tab: activeTab,
    },
    search || undefined,
  );

  return (
    <section className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 max-w-xl space-y-1.5">
          <h1 className="truncate text-xl font-semibold tracking-tight text-foreground">
            My Tasks
          </h1>

          <p className="text-sm leading-relaxed text-muted-foreground">
            Everything on your plate across projects.
          </p>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={onTabChange}
          defaultValue="assigned-to-me"
          className="flex h-full flex-col"
        >
          <TabsList variant="line" className="w-fit">
            <TabsTrigger value="assigned">Assigned to me</TabsTrigger>
            <TabsTrigger value="created">Created by me</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>

          <Separator className="-mt-2" />

          <UserTaskFilters
            search={search}
            onSearchChange={(value) => onSearchChange(value)}
            status={status}
            onStatusChange={(value) => onStatusChange(value)}
            priority={priority}
            onPriorityChange={(value) => onPriorityChange(value)}
          />

          {!isError && !isLoading && tasks?.data.length === 0 && (
            <div className="flex min-h-32 items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 px-6 text-center">
              <div className="flex flex-col items-center justify-center">
                <CheckSquare className="text-muted-foreground text-center mb-3" />
                <p className="text-sm font-medium text-foreground">
                  Nothing matches these filters
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Try clearing a filter or switching tabs.
                </p>
              </div>
            </div>
          )}

          <TabsContent value={activeTab} className="flex-1 overflow-auto">
            {!isError && !isLoading && (tasks?.data.length ?? 0) > 0 && (
              <>
                <TasksTable
                  tasks={tasks?.data ?? []}
                  isError={isError}
                  isFetching={isFetching}
                  refetch={refetch}
                  open={isOpen}
                  onOpenChange={setIsOpen}
                  isClickable
                />

                <PaginationControls
                  currentPage={page}
                  limit={limit}
                  onPageChange={(newPage) => onPageChange(newPage)}
                  onPageSizeChange={(newLimit) => onPageSizeChange(newLimit)}
                  totalItems={tasks?.meta.total ?? 0}
                  totalPages={tasks?.meta.totalPages ?? 0}
                  isPlaceholderData={isPlaceholderData}
                />
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default UserTasksPage;
