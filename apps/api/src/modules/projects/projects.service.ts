import { ConflictError, NotFoundError } from "../../common/errors";
import { Project } from "../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import {
  CreateProjectInput,
  ListProjectsQuery,
  ListProjectsQueryResult,
  ProjectResult,
  UpdateProjectInput,
} from "./projects.types";

export class ProjectsService {
  async create(input: CreateProjectInput): Promise<ProjectResult> {
    const { name, slug, description, workspaceId } = input;

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

    return this.buildProjectResult(project);
  }

  async list(
    query: ListProjectsQuery,
  ): Promise<ListProjectsQueryResult<ProjectResult>> {
    const { page, limit, workspaceId } = query;

    const skip = (page - 1) * limit;
    const where = { workspaceId };

    const [projects, total] = await await Promise.all([
      prisma.project.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
        include: { _count: { select: { tasks: true } } },
      }),

      prisma.project.count({ where }),
    ]);

    return {
      data: projects.map((project) =>
        this.buildProjectResult(project, {
          taskCount: project._count.tasks,
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
    workspaceId: string,
    projectId: string,
  ): Promise<ProjectResult> {
    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
    });

    // Ensure project exists and belongs to the specified workspace
    if (!project || project.workspaceId !== workspaceId) {
      throw new NotFoundError("Project");
    }

    return this.buildProjectResult(project);
  }

  async update(input: UpdateProjectInput): Promise<ProjectResult> {
    const { projectId, workspaceId, name, slug, description } = input;

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

    return this.buildProjectResult(project);
  }

  // Maps database model to public API response format
  private buildProjectResult(
    project: Project,
    counts?: { taskCount: number },
  ): ProjectResult {
    return {
      id: project.id,
      name: project.name,
      slug: project.slug,
      description: project.description,
      workspaceId: project.workspaceId,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      ...(counts ? { taskCount: counts.taskCount } : {}),
    };
  }
}

export const projectsService = new ProjectsService();
