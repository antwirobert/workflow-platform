export const CacheKeys = {
  organizations: (userId: string, query: string) =>
    `organizations:users:${userId}:${query}`,
  members: (organizationId: string, query: string) =>
    `organizations:${organizationId}:members:${query}`,
  organization: (organizationId: string, userId: string) =>
    `organizations:${organizationId}:users:${userId}`,
  workspaces: (organizationId: string, query: string) =>
    `organizations:${organizationId}:workspaces:${query}`,
  workspace: (organizationId: string, workspaceId: string) =>
    `organizations:${organizationId}:workspaces:${workspaceId}`,
  projects: (organizationId: string, workspaceId: string, query: string) =>
    `organizations:${organizationId}:workspaces:${workspaceId}:projects:${query}`,
  project: (organizationId: string, workspaceId: string, projectId: string) =>
    `organizations:${organizationId}:workspaces:${workspaceId}:projects:${projectId}`,
  tasks: (
    organizationId: string,
    workspaceId: string,
    projectId: string,
    query: string,
  ) =>
    `organizations:${organizationId}:workspaces:${workspaceId}:projects:${projectId}:tasks:${query}`,
  task: (
    organizationId: string,
    workspaceId: string,
    projectId: string,
    taskId: string,
  ) =>
    `organizations:${organizationId}:workspaces:${workspaceId}:projects:${projectId}:tasks:${taskId}`,
  userTasks: (organizationId: string, userId: string, query: string) =>
    `organizations:${organizationId}:users:${userId}:tasks:${query}`,
};
