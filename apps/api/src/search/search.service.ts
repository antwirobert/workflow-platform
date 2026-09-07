import { prisma } from "../lib/prisma";
import { SearchQuery } from "./search.schemas";

export class SearchService {
  async search(searchQuery: SearchQuery, organizationId: string) {
    const { q, type } = searchQuery;

    const query = q.trim();

    const [tasks, projects, workspaces, people] = await Promise.all([
      !type || type === "tasks" ? this.searchTasks(organizationId, query) : [],
      !type || type === "projects"
        ? this.searchProjects(organizationId, query)
        : [],
      !type || type === "workspaces"
        ? this.searchWorkspaces(organizationId, query)
        : [],
      !type || type === "people"
        ? this.searchPeople(organizationId, query)
        : [],
    ]);

    return { tasks, projects, workspaces, people };
  }

  private async searchTasks(orgId: string, query: string) {
    return prisma.task.findMany({
      where: {
        deletedAt: null,
        project: {
          workspace: { organizationId: orgId },
        },
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
      },
      select: {
        id: true,
        title: true,
        status: true,
        dueDate: true,
        project: {
          select: {
            id: true,
            slug: true,
            workspace: { select: { id: true, slug: true } },
          },
        },
      },
      take: 20,
    });
  }

  private async searchProjects(orgId: string, query: string) {
    return prisma.project.findMany({
      where: {
        workspace: { organizationId: orgId },
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        workspace: { select: { id: true, slug: true } },
      },
      take: 20,
    });
  }

  private async searchWorkspaces(orgId: string, query: string) {
    return prisma.workspace.findMany({
      where: {
        organizationId: orgId,
        name: { contains: query, mode: "insensitive" },
      },
      select: {
        id: true,
        name: true,
        slug: true,
      },
      take: 20,
    });
  }

  private async searchPeople(orgId: string, query: string) {
    return prisma.organizationMember.findMany({
      where: {
        organizationId: orgId,
        user: {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { email: { contains: query, mode: "insensitive" } },
          ],
        },
      },
      select: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        role: true,
      },
      take: 20,
    });
  }
}

export const searchService = new SearchService();
