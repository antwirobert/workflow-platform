import type { Task } from "@/types/task";
import { createColumnHelper } from "@tanstack/react-table";
import { TaskPriorityBadge } from "./TaskPriorityBadge";
import { TaskStatusBadge } from "./TaskStatusBadge";
import { formatDueDate, getIdentityColor } from "@/lib/utils";
import TextAvatar from "@/components/TextAvatar";

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
      const dueDate = info.getValue();
      const assignee = info.row.original.assignee;
      const color = getIdentityColor(assignee?.id ?? "");

      return (
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">
            {formatDueDate(dueDate)}
          </span>
          {assignee?.name && (
            <TextAvatar
              name={assignee?.name ?? ""}
              colorClass={color.bg}
              textClass={color.text}
              className="size-6 text-[10px] rounded-full"
            />
          )}
        </div>
      );
    },
  }),
];
