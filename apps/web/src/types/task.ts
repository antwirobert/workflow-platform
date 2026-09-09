export type TaskStatus =
  | "TODO"
  | "IN_PROGRESS"
  | "IN_REVIEW"
  | "DONE"
  | "CANCELLED";

export type Priority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export type TaskScope = "assigned" | "created" | "all";

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: Priority;
  projectId: string;
  assignee?: {
    id: string | null;
    name: string | null;
  };
  createdBy?: {
    id: string | null;
    name: string | null;
  };
  dueDate: string | null;
  labels: string[];
  project: {
    slug: string;
    workspace: {
      slug: string;
    };
  };
  createdAt: string;
  updatedAt: string;
  commentCount?: number;
  fileCount?: number;
}
