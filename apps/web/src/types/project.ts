export interface Project {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  workspaceId: string;
  createdAt: string;
  updatedAt: string;
}
