import { DEFAULT_PAGE } from "@/constants";
import { useUrlParams } from "@/hooks/useUrlParams";
import type { Priority, TaskStatus } from "@/types/task";

export function useTaskFilters() {
  const { searchParams, updateParams } = useUrlParams();

  const status = (searchParams.get("status") ?? "ALL") as TaskStatus | "ALL";
  const priority = (searchParams.get("priority") ?? "ALL") as Priority | "ALL";
  const assignee = (searchParams.get("assigneeId") ?? "ALL") as string | "ALL";

  function onStatusChange(value: TaskStatus | "ALL") {
    updateParams({ status: value, page: String(DEFAULT_PAGE) });
  }

  function onPriorityChange(value: Priority | "ALL") {
    updateParams({ priority: value, page: String(DEFAULT_PAGE) });
  }

  function onAssigneeChange(value: string | "ALL") {
    updateParams({ assigneeId: value, page: String(DEFAULT_PAGE) });
  }

  return {
    status,
    priority,
    assignee,
    onStatusChange,
    onPriorityChange,
    onAssigneeChange,
  };
}
