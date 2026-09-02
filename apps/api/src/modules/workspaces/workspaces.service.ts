import { prisma } from "../../lib/prisma";
import { ConflictError, NotFoundError } from "../../common/errors";
import {
  Priority,
  Prisma,
  Task,
  TaskStatus,
  Workspace,
} from "../../generated/prisma/client";
import {
  CreateWorkspaceInput,
  listWorkspacesQuery,
  ListWorkspacesQueryResult,
  UpdateWorkspaceInput,
  WorkspaceResult,
} from "./workspaces.types";
import { TaskResult } from "../tasks/tasks.types";

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

    return this.buildWorkspaceResult(workspace);
  }

  async list(
    query: listWorkspacesQuery,
  ): Promise<ListWorkspacesQueryResult<WorkspaceResult>> {
    const { page, limit, q, organizationId, userId } = query;

    const skip = (page - 1) * limit;

    const searchTerm = q?.trim();

    const where: Prisma.WorkspaceWhereInput = {
      organizationId,
      OR: [
        { name: { contains: searchTerm, mode: "insensitive" } },
        { slug: { contains: searchTerm, mode: "insensitive" } },
      ],
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

    return {
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
  }

  async getById(
    organizationId: string,
    workspaceId: string,
    userId: string,
  ): Promise<WorkspaceResult> {
    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
      include: {
        _count: { select: { projects: true } },
        projects: {
          select: {
            id: true,
            name: true,
            _count: { select: { tasks: { where: { deletedAt: null } } } },
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

    return this.buildWorkspaceResult(
      workspace,
      workspace.organization.members[0].role,
      {
        projectCount: workspace._count.projects,
        taskCount: workspace.projects.reduce(
          (acc, project) => acc + project._count.tasks,
          0,
        ),
        memberCount: workspace.organization._count.members,
      },
    );
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
  }

  async listWorkspaceTasks(
    query: listWorkspacesQuery,
  ): Promise<ListWorkspacesQueryResult<TaskResult>> {
    const { page, limit, workspaceId } = query;

    const skip = (page - 1) * limit;

    const where = {
      deletedAt: null,
      project: { workspaceId },
    };

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),

      prisma.task.count({ where }),
    ]);

    return {
      data: tasks.map((t) => t),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Maps database model to public API response format
  private buildWorkspaceResult(
    workspace: Workspace,
    role?: string,
    counts?: {
      projectCount?: number;
      taskCount?: number;
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
            taskCount: counts.taskCount,
            memberCount: counts.memberCount,
          }
        : {}),
    };
  }
}

export const workspacesService = new WorkspacesService();
