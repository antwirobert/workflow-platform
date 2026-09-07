import type { Member } from "@/types/organization";
import type { Project } from "@/types/project";
import type { Task } from "@/types/task";
import type { Workspace } from "@/types/workspace";

export type SearchType = "tasks" | "projects" | "workspaces" | "people";

export interface SearchResults {
  tasks: Task[];
  projects: Project[];
  workspaces: Workspace[];
  people: Member[];
}

export interface SearchParams {
  query: string;
  type?: SearchType;
}
