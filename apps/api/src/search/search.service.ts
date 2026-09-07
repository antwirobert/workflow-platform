import { prisma } from "../lib/prisma";
import { SearchQuery } from "./search.schemas";

export class SearchService {
  async search(searchQuery: SearchQuery, organizationId: string) {
    const { q, type } = searchQuery;

    const formattedQuery = q.trim().split(/\s+/).join(" & ");

    const [tasks, projects, workspaces, people] = await Promise.all([
      !type || type === "tasks"
        ? this.searchTasks(organizationId, formattedQuery)
        : [],
      !type || type === "projects"
        ? this.searchProjects(organizationId, formattedQuery)
        : [],
      !type || type === "workspaces"
        ? this.searchWorkspaces(organizationId, formattedQuery)
        : [],
      !type || type === "people"
        ? this.searchPeople(organizationId, formattedQuery)
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
        OR: [{ title: { search: query } }, { description: { search: query } }],
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
        assignee: {
          select: {
            id: true,
            name: true,
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
        OR: [{ name: { search: query } }, { description: { search: query } }],
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
        name: { search: query },
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
          OR: [{ name: { search: query } }, { email: { search: query } }],
        },
      },
      select: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        role: true,
      },
      take: 20,
    });
  }
}

export const searchService = new SearchService();
