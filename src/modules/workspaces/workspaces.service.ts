import { prisma } from "../../lib/prisma";
import { ConflictError, NotFoundError } from "../../common/errors";
import { Workspace } from "../../generated/prisma/client";
import {
  CreateWorkspaceInput,
  UpdateWorkspaceInput,
  WorkspaceResult,
} from "./workspaces.types";

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

  async list(organizationId: string): Promise<WorkspaceResult[]> {
    const workspaces = await prisma.workspace.findMany({
      where: { organizationId },
      orderBy: { createdAt: "desc" },
    });

    return workspaces.map((w) => this.buildWorkspaceResult(w));
  }

  async getById(
    organizationId: string,
    workspaceId: string,
  ): Promise<Workspace> {
    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
    });

    // Ensure workspace exists and belongs to the specified organization
    if (!workspace || workspace.organizationId !== organizationId) {
      throw new NotFoundError("Workspace");
    }

    return this.buildWorkspaceResult(workspace);
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

  // Maps database model to public API response format
  private buildWorkspaceResult(workspace: Workspace): WorkspaceResult {
    return {
      id: workspace.id,
      name: workspace.name,
      slug: workspace.slug,
      organizationId: workspace.organizationId,
      createdAt: workspace.createdAt,
      updatedAt: workspace.updatedAt,
    };
  }
}

export const workspacesService = new WorkspacesService();
