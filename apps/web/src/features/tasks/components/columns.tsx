import type { Task } from "@/types/task";
import { createColumnHelper } from "@tanstack/react-table";
import { TaskPriorityBadge } from "./TaskPriorityBadge";
import { TaskStatusBadge } from "./TaskStatusBadge";
import { formatDueDate } from "@/lib/utils";

const columnHelper = createColumnHelper<Task>();

export const columns = [
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
  columnHelper.accessor("priority", {
    header: "Priority",
    cell: (info) => <TaskPriorityBadge priority={info.getValue()} />,
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: (info) => <TaskStatusBadge status={info.getValue()} />,
  }),
  columnHelper.accessor("dueDate", {
    header: "Due",
    cell: (info) => {
      const value = info.getValue();
      return (
        <div>
          <span className="text-muted-foreground">{formatDueDate(value)}</span>
        </div>
      );
    },
  }),
];
