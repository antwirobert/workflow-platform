import { CreateWorkspaceBody, UpdateWorkspaceBody } from "./workspaces.schemas";

export interface CreateWorkspaceInput extends CreateWorkspaceBody {
  organizationId: string;
}

export interface WorkspaceResult {
  id: string;
  name: string;
  slug: string;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateWorkspaceInput extends UpdateWorkspaceBody {
  organizationId: string;
  workspaceId: string;
}
