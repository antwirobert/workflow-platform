import { CreateProjectBody, UpdateProjectBody } from "./projects.schemas";

export interface CreateProjectInput extends CreateProjectBody {
  workspaceId: string;
}

export interface ProjectResult {
  name: string;
  slug: string;
  description: string | null;
  workspaceId: string;
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateProjectInput extends UpdateProjectBody {
  projectId: string;
  workspaceId: string;
}
