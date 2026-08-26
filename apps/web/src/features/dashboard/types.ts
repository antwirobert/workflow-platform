import type { Project } from "@/types/project";
import type { Task } from "@/types/task";

export interface DashboardData {
  assignedTaskCount: number;
  projectCount: number;
  assignedTasks: Task[];
  projectsAcrossWorkspaces: Project[];
}
