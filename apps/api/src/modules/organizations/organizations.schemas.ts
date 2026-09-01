import z from "zod";
import { OrgRole } from "../../generated/prisma/enums";

export const createOrganizationSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  slug: z
    .string()
    .min(2)
    .max(50)
    .regex(
      /^[a-z0-9-]+$/,
      "Slug can only contain lowercase letters, numbers, and hyphens",
    ),
});

export const updateOrganizationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .optional(),
  slug: z
    .string()
    .min(2)
    .max(50)
    .regex(
      /^[a-z0-9-]+$/,
      "Slug can only contain lowercase letters, numbers, and hyphens",
    )
    .optional(),
});

export const orgSlugParamSchema = z.object({
  orgSlug: z.string().min(1),
});

export const listOrganizationsQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(12),
  role: z.nativeEnum(OrgRole).optional(),
  q: z.string().min(1).max(100).optional(),
});

export type CreateOrganizationPayload = z.infer<
  typeof createOrganizationSchema
>;
export type UpdateOrganizationPayload = z.infer<
  typeof updateOrganizationSchema
>;
export type OrganizationSlugParams = z.infer<typeof orgSlugParamSchema>;
export type ListOrganizationsQueryInput = z.infer<
  typeof listOrganizationsQuerySchema
>;
