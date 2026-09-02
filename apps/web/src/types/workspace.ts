export interface Workspace {
  id: string;
  name: string;
  slug: string;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
  role?: string;
  projectCount?: number;
  openTaskCount?: number;
  completedTaskCount?: number;
  totalTaskCount?: number;
  memberCount?: number;
}
