import type { Comment } from "@/types/comment";
import type { Project } from "@/types/project";
import type { Task } from "@/types/task";

export type SearchType = "tasks" | "projects" | "comments";

export interface SearchResults {
  tasks: Task[];
  projects: Project[];
  comments: Comment[];
}

export interface SearchParams {
  query: string;
  type?: SearchType;
}
