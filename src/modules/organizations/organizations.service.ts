import {
  createOrganizationInput,
  OrganizationResult,
} from "./organizations.type";
import { prisma } from "../../lib/prisma";
import { ConflictError, NotFoundError } from "../../common/errors";
import {
  Organization,
  OrganizationMember,
} from "../../generated/prisma/client";

export class OrganizationsService {
  async create(input: createOrganizationInput): Promise<OrganizationResult> {
    const { name, slug, userId } = input;

    // Check for global duplicate slug across all organizations
    const existingSlug = await prisma.organization.findUnique({
      where: { slug },
    });

    if (existingSlug) {
      throw new ConflictError("Slug already exists");
    }

    // Atomic transaction to create both organization and initial owner membership
    const result = await prisma.$transaction(async (tx) => {
      const organization = await tx.organization.create({
        data: { name, slug },
      });

      const membership = await tx.organizationMember.create({
        data: {
          organizationId: organization.id,
          userId,
          role: "OWNER",
        },
      });

      return { organization, membership };
    });

    return this.buildOrganizationResult(result.organization, result.membership);
  }

  async listForUser(userId: string): Promise<OrganizationResult[]> {
    const memberships = await prisma.organizationMember.findMany({
      where: {
        userId,
      },
      orderBy: { createdAt: "desc" },
      include: {
        organization: true,
      },
    });

    return memberships.map((m) =>
      this.buildOrganizationResult(m.organization, m),
    );
  }

  async getById(
    organizationId: string,
    userId: string,
  ): Promise<OrganizationResult> {
    // Check composite key to ensure the requesting user belongs to the organization
    const membership = await prisma.organizationMember.findUnique({
      where: {
        organizationId_userId: {
          organizationId,
          userId,
        },
      },
      include: { organization: true },
    });

    if (!membership) {
      throw new NotFoundError("Organization");
    }

    return this.buildOrganizationResult(membership.organization, membership);
  }

  // Combines model and membership records into a unified public API response format
  private buildOrganizationResult(
    organization: Organization,
    membership: OrganizationMember,
  ): OrganizationResult {
    return {
      id: organization.id,
      name: organization.name,
      slug: organization.slug,
      role: membership.role,
      createdAt: organization.createdAt,
    };
  }
}

export const organizationsService = new OrganizationsService();
