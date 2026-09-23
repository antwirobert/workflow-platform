import { ConflictError, NotFoundError } from "../../common/errors";
import { Prisma, Project } from "../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { deleteCacheByPattern, getCache, setCache } from "../../redis/cache";
import { CacheKeys } from "../../redis/cacheKeys";
import {
  CreateProjectInput,
  ListProjectsQuery,
  ListProjectsQueryResult,
  ProjectAssignneeResult,
  ProjectResult,
  UpdateProjectInput,
} from "./projects.types";

export class ProjectsService {
  async create(input: CreateProjectInput): Promise<ProjectResult> {
    const { name, slug, description, workspaceId, organizationId } = input;

    // Check for duplicate slug within the same workspace
    const existingSlug = await prisma.project.findUnique({
      where: {
        workspaceId_slug: {
          workspaceId,
          slug,
        },
      },
    });

    if (existingSlug) {
      throw new ConflictError("Project slug already exists in this workspace");
    }

    const project = await prisma.project.create({
      data: {
        name,
        slug,
        description,
        workspaceId,
      },
    });

    await this.invalidateWorkspaceCaches(organizationId, workspaceId);

    return this.buildProjectResult(project);
  }

  async list(
    query: ListProjectsQuery,
  ): Promise<ListProjectsQueryResult<ProjectResult>> {
    const { page, limit, q, workspaceId, organizationId } = query;

    const skip = (page - 1) * limit;
    const search = q?.trim();
    const queryString = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      ...(search ? { q: search } : {}),
    }).toString();
    const cacheKey = CacheKeys.projects(
      organizationId ?? "",
      workspaceId ?? "",
      queryString,
    );

    const cached =
      await getCache<ListProjectsQueryResult<ProjectResult>>(cacheKey);
    if (cached) return cached;

    const where: Prisma.ProjectWhereInput = {
      workspaceId,
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { slug: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ],
      }),
    };

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          updatedAt: "desc",
        },
        include: {
          _count: {
            select: {
              tasks: {
                where: {
                  deletedAt: null,
                  status: { notIn: ["CANCELLED"] },
                },
              },
            },
          },
          tasks: {
            where: {
              deletedAt: null,
              status: "DONE",
            },
            select: { id: true },
          },
        },
      }),

      prisma.project.count({ where }),
    ]);

    const result = {
      data: projects.map((project) =>
        this.buildProjectResult(project, {
          totalTaskCount: project._count.tasks,
          completedTaskCount: project.tasks.length,
        }),
      ),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };

    await setCache(cacheKey, result, 300);
    return result;
  }

  async getById(
    organizationId: string,
    workspaceId: string,
    projectId: string,
  ): Promise<ProjectResult> {
    const cacheKey = CacheKeys.project(organizationId, workspaceId, projectId);
    const cached = await getCache<ProjectResult>(cacheKey);
    if (cached) return cached;

    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
      include: {
        _count: {
          select: {
            tasks: {
              where: {
                deletedAt: null,
                status: { notIn: ["CANCELLED"] },
              },
            },
          },
        },
        tasks: {
          where: {
            deletedAt: null,
            status: "DONE",
          },
          select: { id: true },
        },
      },
    });

    // Ensure project exists and belongs to the specified workspace
    if (!project || project.workspaceId !== workspaceId) {
      throw new NotFoundError("Project");
    }

    const result = this.buildProjectResult(project, {
      totalTaskCount: project._count.tasks,
      completedTaskCount: project.tasks.length,
    });

    await setCache(cacheKey, result, 300);
    return result;
  }

  async update(input: UpdateProjectInput): Promise<ProjectResult> {
    const { projectId, workspaceId, organizationId, name, slug, description } =
      input;

    const existing = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
    });

    if (!existing || existing.workspaceId !== workspaceId) {
      throw new NotFoundError("Project");
    }

    // Only validate slug uniqueness if the slug is being changed
    if (slug && slug !== existing.slug) {
      const duplicate = await prisma.project.findUnique({
        where: {
          workspaceId_slug: {
            workspaceId,
            slug,
          },
        },
      });

      if (duplicate) {
        throw new ConflictError(
          "Project slug already exists in this workspace",
        );
      }
    }

    const project = await prisma.project.update({
      where: {
        id: projectId,
      },
      data: {
        // Only update fields that are explicitly provided
        ...(name !== undefined && { name }),
        ...(slug !== undefined && { slug }),
        ...(description !== undefined && { description }),
      },
    });

    await this.invalidateWorkspaceCaches(organizationId, workspaceId);

    return this.buildProjectResult(project);
  }

  async delete(
    workspaceId: string,
    projectId: string,
    organizationId: string,
  ): Promise<void> {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project || project.workspaceId !== workspaceId) {
      throw new NotFoundError("project");
    }

    await prisma.project.delete({ where: { id: projectId } });
    await this.invalidateWorkspaceCaches(organizationId, workspaceId);
  }

  async listProjectAssignees(
    query: ListProjectsQuery,
  ): Promise<ListProjectsQueryResult<ProjectAssignneeResult>> {
    const { page, limit, projectId, organizationId, workspaceId } = query;

    const skip = (page - 1) * limit;
    const queryString = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    }).toString();
    const cacheKey = CacheKeys.projectAssignees(
      organizationId ?? "",
      workspaceId ?? "",
      projectId ?? "",
      queryString,
    );

    const cached =
      await getCache<ListProjectsQueryResult<ProjectAssignneeResult>>(cacheKey);
    if (cached) return cached;
    const where = {
      assignedTasks: {
        some: {
          deletedAt: null,
          projectId,
        },
      },
    };

    const [projectAssignees, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
        },
      }),

      prisma.user.count({ where }),
    ]);

    const result = {
      data: projectAssignees.map((assignee) => assignee),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };

    await setCache(cacheKey, result, 300);
    return result;
  }

  private async invalidateWorkspaceCaches(
    organizationId: string,
    workspaceId: string,
  ) {
    await Promise.all([
      deleteCacheByPattern(
        `organizations:${organizationId}:users:*:workspaces:*`,
      ),
      deleteCacheByPattern(
        `organizations:${organizationId}:workspaces:${workspaceId}:users:*`,
      ),
      deleteCacheByPattern(
        `organizations:${organizationId}:workspaces:${workspaceId}:*`,
      ),
    ]);
  }

  // Maps database model to public API response format
  private buildProjectResult(
    project: Project,
    counts?: { totalTaskCount: number; completedTaskCount: number },
  ): ProjectResult {
    return {
      id: project.id,
      name: project.name,
      slug: project.slug,
      description: project.description,
      workspaceId: project.workspaceId,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      ...(counts
        ? {
            totalTaskCount: counts.totalTaskCount,
            completedTaskCount: counts.completedTaskCount,
          }
        : {}),
    };
  }
}

export const projectsService = new ProjectsService();
