import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Task } from "@/types/task";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import TaskDetailsSheet from "./TaskDetailsSheet";
import { useState } from "react";
import { columns } from "./columns";

interface TasksListViewProps {
  tasks: Task[];
  isLoading: boolean;
  isFetching: boolean;
}

const TasksListView = ({
  tasks,
  isLoading,
  isFetching,
}: TasksListViewProps) => {
  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const table = useReactTable({
    data: tasks,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) {
    return (
      <div className="flex h-full w-full flex-col overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm">
        <div className="flex-1 overflow-auto">
          <Table className="min-w-160">
            <TableHeader>
              <TableRow className="border-b border-border/60 hover:bg-transparent">
                <TableHead className="h-10 bg-muted/40 px-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Task
                </TableHead>
                <TableHead className="h-10 bg-muted/40 px-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Priority
                </TableHead>
                <TableHead className="h-10 bg-muted/40 px-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Status
                </TableHead>
                <TableHead className="h-10 bg-muted/40 px-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Due
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {Array.from({ length: 6 }).map((_, i) => (
                <TableRow
                  key={i}
                  className="border-b border-border/40 hover:bg-transparent"
                >
                  <TableCell className="px-4 py-3">
                    <Skeleton className="h-4 w-48" />
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <Skeleton className="h-5 w-20 rounded-md" />
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  const handleRowClick = (task: Task): void => {
    setIsSheetOpen(true);
    setSelectedTask(task);
  };

  return (
    <div
      className={cn(
        "flex h-full w-full flex-col overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm",
        isFetching ? "opacity-60 transition-opacity" : "",
      )}
    >
      <div className="flex-1 overflow-auto">
        <Table className="min-w-160">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="border-b border-border/60 hover:bg-transparent"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="h-10 bg-muted/40 px-4 text-xs font-medium uppercase tracking-wider text-muted-foreground"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="border-b border-border/40 transition-colors hover:bg-muted/30 cursor-pointer"
                  onClick={() => handleRowClick(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-4 py-3">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center text-sm text-muted-foreground"
                >
                  No tasks yet
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <TaskDetailsSheet
        task={selectedTask}
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
      />
    </div>
  );
};

export default TasksListView;
