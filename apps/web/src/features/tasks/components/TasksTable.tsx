import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { columns } from "./columns";
import type { Task } from "@/types/task";
import TaskDetailsSheet from "./TaskDetailsSheet";
import { useState } from "react";
import ErrorState from "@/components/ErrorState";

interface TasksTableProps {
  tasks: Task[];
  isError: boolean;
  isFetching: boolean;
  isPlaceholderData: boolean;
  refetch: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  isClickable?: boolean;
}

const TasksTable = ({
  tasks,
  isError,
  isFetching,
  isPlaceholderData,
  refetch,
  open,
  onOpenChange,
  isClickable,
}: TasksTableProps) => {
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const table = useReactTable({
    data: tasks,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isError) {
    return (
      <ErrorState
        title="Couldn't load tasks"
        description="Something went wrong fetching tasks for this project."
        onRetry={refetch}
        isRetrying={isFetching}
      />
    );
  }

  const handleRowClick = (id: string): void => {
    onOpenChange?.(true);
    setSelectedTaskId(id);
  };

  const activeTask = tasks.find((t) => t.id === selectedTaskId) || null;

  return (
    <div
      className={cn(
        "flex h-full w-full flex-col overflow-hidden rounded-lg border border-border/60 bg-card shadow-sm",
        isPlaceholderData ? "opacity-60 pointer-events-none" : "",
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
                  className={cn(
                    "border-b border-border/40",
                    isClickable
                      ? "cursor-pointer hover:bg-muted/30 transition-colors"
                      : "cursor-default hover:bg-transparent",
                  )}
                  onClick={() => handleRowClick(row.original.id)}
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

      {open && onOpenChange && (
        <TaskDetailsSheet
          task={activeTask}
          open={open}
          onOpenChange={(isOpen) => {
            onOpenChange(isOpen);
            if (!isOpen) setSelectedTaskId(null);
          }}
        />
      )}
    </div>
  );
};

export default TasksTable;
