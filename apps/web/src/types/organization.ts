export type OrgRole = "OWNER" | "ADMIN" | "MEMBER";

export interface Organization {
  id: string;
  name: string;
  slug: string;
  role: OrgRole;
  createdAt: string;
  workspaceCount?: number;
  memberCount?: number;
}

export interface Member {
  user: {
    id: string;
    name: string;
    email: string;
  };
  role: OrgRole;
}
