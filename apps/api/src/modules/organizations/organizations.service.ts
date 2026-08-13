import {
  CreateOrganizationInput,
  ListOrganizationsQuery,
  ListOrganizationsQueryResult,
  OrganizationResult,
  UpdateOrganizationInput,
} from "./organizations.types";
import { prisma } from "../../lib/prisma";
import { ConflictError, NotFoundError } from "../../common/errors";
import {
  Organization,
  OrganizationMember,
} from "../../generated/prisma/client";

export class OrganizationsService {
  async create(input: CreateOrganizationInput): Promise<OrganizationResult> {
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

  async listForUser(
    query: ListOrganizationsQuery,
  ): Promise<ListOrganizationsQueryResult<OrganizationResult>> {
    const { page, limit, userId } = query;

    const skip = (page - 1) * limit;

    const where = {
      userId,
    };

    const [memberships, total] = await Promise.all([
      prisma.organizationMember.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          organization: {
            include: {
              _count: {
                select: {
                  workspaces: true,
                  members: true,
                },
              },
            },
          },
        },
      }),

      prisma.organizationMember.count({ where }),
    ]);

    return {
      data: memberships.map((m) =>
        this.buildOrganizationResult(m.organization, m, {
          workspaceCount: m.organization._count.workspaces,
          memberCount: m.organization._count.members,
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

  async update(input: UpdateOrganizationInput): Promise<OrganizationResult> {
    const { organizationId, name, slug } = input;

    const organization = await prisma.organization.findUnique({
      where: { id: organizationId },
    });

    if (!organization) {
      throw new NotFoundError("Organization");
    }

    // If slug is changing, ensure it's globally unique
    if (slug && slug !== organization.slug) {
      const existing = await prisma.organization.findUnique({
        where: { slug },
      });
      if (existing) {
        throw new ConflictError("Slug already exists");
      }
    }

    const updated = await prisma.organization.update({
      where: { id: organizationId },
      data: {
        ...(name ? { name } : {}),
        ...(slug ? { slug } : {}),
      },
    });

    return this.buildOrganizationResult(updated);
  }

  async delete(organizationId: string): Promise<void> {
    const organization = await prisma.organization.findUnique({
      where: { id: organizationId },
    });

    if (!organization) {
      throw new NotFoundError("Organization");
    }

    await prisma.organization.delete({ where: { id: organizationId } });
  }

  async listMembers(
    query: ListOrganizationsQuery,
  ): Promise<ListOrganizationsQueryResult<OrganizationResult>> {
    const { page, limit, organizationId } = query;

    const skip = (page - 1) * limit;
    const where = { organizationId };

    const [members, total] = await Promise.all([
      prisma.organizationMember.findMany({
        where,
        skip,
        take: limit,
        include: {
          organization: true,
          user: { select: { id: true, name: true, email: true } },
        },
      }),

      prisma.organizationMember.count({ where }),
    ]);

    return {
      data: members.map((member) =>
        this.buildOrganizationResult(member.organization, member, undefined, {
          id: member.user.id,
          name: member.user.name,
          email: member.user.email,
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

  // Combines model and membership records into a unified public API response format
  buildOrganizationResult(
    organization: Organization,
    membership?: OrganizationMember,
    counts?: { workspaceCount: number; memberCount: number },
    user?: { id: string; name: string; email: string },
  ): OrganizationResult {
    return {
      id: organization.id,
      name: organization.name,
      slug: organization.slug,
      role: membership?.role,
      createdAt: organization.createdAt,
      ...(counts
        ? {
            workspaceCount: counts.workspaceCount,
            memberCount: counts.memberCount,
          }
        : {}),
      ...(user ? { user } : {}),
    };
  }
}

export const organizationsService = new OrganizationsService();
