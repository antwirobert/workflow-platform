import { TaskStatusBadge } from "@/features/tasks/components/TaskStatusBadge";
import type { Task } from "@/types/task";
import { createColumnHelper } from "@tanstack/react-table";

const columnHelper = createColumnHelper<Task>();

export const taskColumns = [
  columnHelper.accessor("title", {
    header: "Task",
    cell: (info) => {
      const value = info.getValue();

      return (
        <span
          className={
            value
              ? "block max-w-120 truncate font-medium text-foreground"
              : "text-muted-foreground"
          }
        >
          {value}
        </span>
      );
    },
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: (info) => <TaskStatusBadge status={info.getValue()} />,
  }),
];
