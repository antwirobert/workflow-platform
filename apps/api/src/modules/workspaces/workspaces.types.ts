import {
  CreateWorkspacePayload,
  UpdateWorkspacePayload,
} from "./workspaces.schemas";

export interface CreateWorkspaceInput extends CreateWorkspacePayload {
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

export interface UpdateWorkspaceInput extends UpdateWorkspacePayload {
  organizationId: string;
  workspaceId: string;
}
