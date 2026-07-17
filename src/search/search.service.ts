import { prisma } from "../lib/prisma";
import { SearchQuery } from "./search.schemas";

export class SearchService {
  async search(searchQuery: SearchQuery, organizationId: string) {
    const { q, type } = searchQuery;

    const formattedQuery = q.trim().split(/\s+/).join(" & ");

    const [tasks, projects, comments] = await Promise.all([
      !type || type === "tasks"
        ? this.searchTasks(organizationId, formattedQuery)
        : [],
      !type || type === "projects"
        ? this.searchProjects(organizationId, formattedQuery)
        : [],
      !type || type === "comments"
        ? this.searchComments(organizationId, formattedQuery)
        : [],
    ]);

    return { tasks, projects, comments };
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
        description: true,
        status: true,
        priority: true,
        project: {
          select: {
            id: true,
            name: true,
            workspace: { select: { id: true, name: true } },
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
        description: true,
        workspace: { select: { id: true, name: true } },
      },
      take: 20,
    });
  }

  private async searchComments(orgId: string, query: string) {
    return prisma.comment.findMany({
      where: {
        task: {
          deletedAt: null,
          project: { workspace: { organizationId: orgId } },
        },
        body: { search: query },
      },
      select: {
        id: true,
        body: true,
        createdAt: true,
        author: { select: { id: true, name: true, email: true } },
        task: {
          select: {
            id: true,
            title: true,
            project: { select: { id: true, name: true } },
          },
        },
      },
      take: 20,
    });
  }
}

export const searchService = new SearchService();
