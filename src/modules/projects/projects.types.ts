import { CreateProjectPayload, UpdateProjectPayload } from "./projects.schemas";

export interface CreateProjectInput extends CreateProjectPayload {
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

export interface UpdateProjectInput extends UpdateProjectPayload {
  projectId: string;
  workspaceId: string;
}
