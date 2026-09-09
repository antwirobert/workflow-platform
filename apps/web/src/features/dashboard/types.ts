import type { Task } from "@/types/task";
import type { Workspace } from "@/types/workspace";

export interface DashboardData {
  assignedTaskCount: number;
  dueThisWeekCount: number;
  completedThisMonthCount: number;
  workspaceCount: number;
  assignedTasks: Task[];
  allWorkspaces: Workspace[];
  dueThisWeek: Task[];
}
