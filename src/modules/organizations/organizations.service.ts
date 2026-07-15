import {
  createOrganizationInput,
  OrganizationResult,
} from "./organizations.type";
import { prisma } from "../../lib/prisma";
import { ConflictError } from "../../common/errors";
import {
  Organization,
  OrganizationMember,
} from "../../generated/prisma/client";

export class OrganizationsService {
  async create(input: createOrganizationInput): Promise<OrganizationResult> {
    const { name, slug, userId } = input;

    const existingSlug = await prisma.organization.findUnique({
      where: { slug },
    });

    if (existingSlug) {
      throw new ConflictError("Slug already exists");
    }

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
      include: {
        organization: true,
      },
    });

    return memberships.map((m) =>
      this.buildOrganizationResult(m.organization, m),
    );
  }

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
