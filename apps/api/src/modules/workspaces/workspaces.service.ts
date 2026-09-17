import { prisma } from "../../lib/prisma";
import { ConflictError, NotFoundError } from "../../common/errors";
import { Prisma, Workspace } from "../../generated/prisma/client";
import {
  CreateWorkspaceInput,
  listWorkspacesQuery,
  ListWorkspacesQueryResult,
  UpdateWorkspaceInput,
  WorkspaceResult,
} from "./workspaces.types";
import { TaskResult } from "../tasks/tasks.types";
import { deleteCacheByPattern, getCache, setCache } from "../../redis/cache";
import { CacheKeys } from "../../redis/cacheKeys";

export class WorkspacesService {
  async create(input: CreateWorkspaceInput): Promise<WorkspaceResult> {
    const { name, slug, organizationId } = input;

    // Check for duplicate slug within the same organization
    const existing = await prisma.workspace.findUnique({
      where: {
        organizationId_slug: {
          organizationId,
          slug,
        },
      },
    });

    if (existing) {
      throw new ConflictError(
        "Workspace slug already exists in this organization",
      );
    }

    const workspace = await prisma.workspace.create({
      data: {
        name,
        slug,
        organizationId,
      },
    });

    await this.invalidateOrganizationCaches(organizationId);

    return this.buildWorkspaceResult(workspace);
  }

  async list(
    query: listWorkspacesQuery,
  ): Promise<ListWorkspacesQueryResult<WorkspaceResult>> {
    const { page, limit, q, organizationId, userId } = query;

    const skip = (page - 1) * limit;

    const searchTerm = q?.trim();
    const queryString = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      ...(searchTerm ? { q: searchTerm } : {}),
    }).toString();
    const cacheKey = CacheKeys.workspaces(
      organizationId ?? "",
      userId ?? "",
      queryString,
    );

    const cached =
      await getCache<ListWorkspacesQueryResult<WorkspaceResult>>(cacheKey);
    if (cached) return cached;

    const where: Prisma.WorkspaceWhereInput = {
      organizationId,
      ...(searchTerm && {
        OR: [
          { name: { contains: searchTerm, mode: "insensitive" } },
          { slug: { contains: searchTerm, mode: "insensitive" } },
        ],
      }),
    };

    const [workspaces, total] = await Promise.all([
      prisma.workspace.findMany({
        where,
        skip,
        take: limit,
        orderBy: { updatedAt: "desc" },
        include: {
          _count: { select: { projects: true } },
          organization: {
            select: { members: { where: { userId }, select: { role: true } } },
          },
        },
      }),

      prisma.workspace.count({ where }),
    ]);

    const result = {
      data: workspaces.map((w) =>
        this.buildWorkspaceResult(w, w.organization.members[0].role, {
          projectCount: w._count.projects,
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
    userId: string,
  ): Promise<WorkspaceResult> {
    const cacheKey = CacheKeys.workspace(organizationId, workspaceId, userId);
    const cached = await getCache<WorkspaceResult>(cacheKey);
    if (cached) return cached;

    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
      include: {
        _count: { select: { projects: true } },
        projects: {
          select: {
            id: true,
            name: true,
            _count: {
              select: {
                tasks: {
                  where: {
                    deletedAt: null,
                    status: { notIn: ["CANCELLED", "DONE"] },
                  },
                },
              },
            },
            tasks: {
              where: { deletedAt: null, status: "DONE" },
              select: { id: true },
            },
          },
        },
        organization: {
          select: {
            _count: { select: { members: true } },
            members: {
              where: { userId },
              select: { role: true },
            },
          },
        },
      },
    });

    // Ensure workspace exists and belongs to the specified organization
    if (!workspace || workspace.organizationId !== organizationId) {
      throw new NotFoundError("Workspace");
    }

    const openTaskCount = workspace.projects.reduce(
      (acc, project) => acc + project._count.tasks,
      0,
    );

    const completedTaskCount = workspace.projects.reduce(
      (acc, project) => acc + project.tasks.length,
      0,
    );

    const result = this.buildWorkspaceResult(
      workspace,
      workspace.organization.members[0].role,
      {
        projectCount: workspace._count.projects,
        openTaskCount,
        completedTaskCount,
        totalTaskCount: openTaskCount + completedTaskCount,
        memberCount: workspace.organization._count.members,
      },
    );

    await setCache(cacheKey, result, 300);
    return result;
  }

  async update(input: UpdateWorkspaceInput): Promise<WorkspaceResult> {
    const { name, slug, organizationId, workspaceId } = input;

    const existing = await prisma.workspace.findUnique({
      where: { id: workspaceId },
    });

    if (!existing || existing.organizationId !== organizationId) {
      throw new NotFoundError("Workspace");
    }

    // Only validate slug uniqueness if the slug is being changed
    if (slug && slug !== existing.slug) {
      const duplicate = await prisma.workspace.findUnique({
        where: {
          organizationId_slug: {
            organizationId,
            slug,
          },
        },
      });

      if (duplicate) {
        throw new ConflictError(
          "Workspace slug already exists in this organization",
        );
      }
    }

    const workspace = await prisma.workspace.update({
      where: { id: workspaceId },
      data: {
        // Only update fields that are explicitly provided
        ...(name !== undefined && { name }),
        ...(slug !== undefined && { slug }),
      },
    });

    await this.invalidateWorkspaceCaches(organizationId, workspaceId);

    return this.buildWorkspaceResult(workspace);
  }

  async delete(organizationId: string, workspaceId: string): Promise<void> {
    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
    });

    if (!workspace || workspace.organizationId !== organizationId) {
      throw new NotFoundError("Workspace");
    }

    await prisma.workspace.delete({ where: { id: workspaceId } });
    await this.invalidateWorkspaceCaches(organizationId, workspaceId);
  }

  async listWorkspaceTasks(
    query: listWorkspacesQuery,
  ): Promise<ListWorkspacesQueryResult<TaskResult>> {
    const { page, limit, workspaceId } = query;

    const skip = (page - 1) * limit;
    const queryString = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    }).toString();
    const cacheKey = CacheKeys.workspaceTasks(
      query.organizationId ?? "",
      workspaceId ?? "",
      queryString,
    );

    const cached =
      await getCache<ListWorkspacesQueryResult<TaskResult>>(cacheKey);
    if (cached) return cached;

    const where = {
      deletedAt: null,
      project: { workspaceId },
    };

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        skip,
        take: limit,
        orderBy: [
          { dueDate: { sort: "asc", nulls: "last" } },
          { createdAt: "desc" },
        ],
      }),

      prisma.task.count({ where }),
    ]);

    const result = {
      data: tasks.map((t) => t),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };

    await setCache(cacheKey, result, 120);
    return result;
  }

  async listWorkspaceMembers(query: listWorkspacesQuery) {
    const { page, limit, organizationId, workspaceId } = query;
    const skip = (page - 1) * limit;
    const queryString = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    }).toString();
    const cacheKey = CacheKeys.workspaceMembers(
      organizationId ?? "",
      workspaceId ?? "",
      queryString,
    );

    const cached = await getCache(cacheKey);
    if (cached) return cached;

    const where = {
      organizationId,
    };

    const [members, total] = await Promise.all([
      prisma.organizationMember.findMany({
        where,
        skip,
        take: limit,
        select: {
          role: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              _count: {
                select: {
                  assignedTasks: {
                    where: {
                      deletedAt: null,
                      status: { notIn: ["CANCELLED", "DONE"] },
                      project: { workspaceId },
                    },
                  },
                },
              },
            },
          },
        },
        orderBy: { user: { assignedTasks: { _count: "desc" } } },
      }),

      prisma.organizationMember.count({ where }),
    ]);

    const result = {
      data: members.map(({ role, user }) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role,
        assignedTaskCount: user._count.assignedTasks,
      })),
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

  private async invalidateOrganizationCaches(organizationId: string) {
    await Promise.all([
      deleteCacheByPattern(`organizations:${organizationId}:users:*`),
      deleteCacheByPattern(`organizations:${organizationId}:workspaces:*`),
    ]);
  }

  private async invalidateWorkspaceCaches(
    organizationId: string,
    workspaceId: string,
  ) {
    await Promise.all([
      this.invalidateOrganizationCaches(organizationId),
      deleteCacheByPattern(
        `organizations:${organizationId}:workspaces:${workspaceId}:*`,
      ),
    ]);
  }

  // Maps database model to public API response format
  private buildWorkspaceResult(
    workspace: Workspace,
    role?: string,
    counts?: {
      projectCount?: number;
      openTaskCount?: number;
      totalTaskCount?: number;
      completedTaskCount?: number;
      memberCount?: number;
    },
  ): WorkspaceResult {
    return {
      id: workspace.id,
      name: workspace.name,
      slug: workspace.slug,
      organizationId: workspace.organizationId,
      createdAt: workspace.createdAt,
      updatedAt: workspace.updatedAt,
      role,
      ...(counts
        ? {
            projectCount: counts.projectCount,
            openTaskCount: counts.openTaskCount,
            completedTaskCount: counts.completedTaskCount,
            totalTaskCount: counts.totalTaskCount,
            memberCount: counts.memberCount,
          }
        : {}),
    };
  }
}

export const workspacesService = new WorkspacesService();
