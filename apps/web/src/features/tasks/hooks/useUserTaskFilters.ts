import { DEFAULT_PAGE } from "@/constants";
import { useUrlParams } from "@/hooks/useUrlParams";
import type { Priority, TaskScope, TaskStatus } from "@/types/task";

export function useUserTaskFilters() {
  const { searchParams, updateParams } = useUrlParams();

  const search = searchParams.get("q") ?? "";
  const status = (searchParams.get("status") ?? "ALL") as TaskStatus | "ALL";
  const priority = (searchParams.get("priority") ?? "ALL") as Priority | "ALL";
  const project = (searchParams.get("projectId") ?? "ALL") as string | "ALL";
  const activeTab = (searchParams.get("tab") ?? "assigned") as
    | TaskScope
    | "assigned";

  function onSearchChange(value: string) {
    updateParams({ q: value, page: String(DEFAULT_PAGE) });
  }

  function onStatusChange(value: TaskStatus | "ALL") {
    updateParams({ status: value, page: String(DEFAULT_PAGE) });
  }

  function onPriorityChange(value: Priority | "ALL") {
    updateParams({ priority: value, page: String(DEFAULT_PAGE) });
  }

  function onProjectChange(value: string) {
    updateParams({ projectId: value, page: String(DEFAULT_PAGE) });
  }

  function onTabChange(value: TaskScope | "assigned") {
    updateParams({ tab: value, page: String(DEFAULT_PAGE) });
  }

  return {
    search,
    status,
    priority,
    project,
    activeTab,
    onSearchChange,
    onStatusChange,
    onPriorityChange,
    onProjectChange,
    onTabChange,
  };
}
