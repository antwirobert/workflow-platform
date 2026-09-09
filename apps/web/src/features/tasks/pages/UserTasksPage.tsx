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
import { Skeleton } from "@/components/ui/skeleton";

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

  if (isLoading) {
    return (
      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 max-w-xl space-y-2">
            <Skeleton className="h-6 w-28" />
            <Skeleton className="h-4 w-56" />
          </div>

          <div className="flex items-center gap-4">
            <Skeleton className="h-8 w-28 rounded-md" />
            <Skeleton className="h-8 w-28 rounded-md" />
            <Skeleton className="h-8 w-16 rounded-md" />
          </div>
          <Skeleton className="mt-0 h-px w-full" />

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Skeleton className="h-9 w-48 rounded-md" />
            <Skeleton className="h-9 w-28 rounded-md" />
            <Skeleton className="h-9 w-28 rounded-md" />
          </div>

          <div className="mt-4 overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm">
            <div className="flex items-center gap-4 border-b border-border/60 bg-muted/40 px-4 py-2.5">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-16" />
              <Skeleton className="ml-auto h-3 w-14" />
            </div>

            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-4 border-b border-border/40 px-4 py-3 last:border-0"
              >
                <Skeleton className="h-4 w-48 flex-1" />
                <Skeleton className="h-5 w-16 rounded-md" />
                <Skeleton className="h-5 w-20 rounded-md" />
                <Skeleton className="h-3 w-16" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

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
