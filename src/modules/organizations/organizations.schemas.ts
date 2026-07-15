import z from "zod";

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

export const orgIdParamSchema = z.object({
  orgId: z.string().uuid("Invalid orgId format"),
});

export type CreateOrganizationBody = z.infer<typeof createOrganizationSchema>;
export type OrgIdParamInput = z.infer<typeof orgIdParamSchema>;
