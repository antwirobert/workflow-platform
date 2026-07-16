import { ConflictError } from "../../common/errors";
import { Project } from "../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { CreateProjectInput, ProjectResult } from "./projects.types";

export class ProjectsService {
  async create(input: CreateProjectInput): Promise<ProjectResult> {
    const { name, slug, description, workspaceId } = input;

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

  private buildProjectResult(project: Project): ProjectResult {
    return {
      id: project.id,
      name: project.name,
      slug: project.slug,
      description: project.description,
      workspaceId: project.workspaceId,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    };
  }
}

export const projectsService = new ProjectsService();
