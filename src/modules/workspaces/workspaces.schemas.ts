import z from "zod";

export const workspaceCreateSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  slug: z
    .string()
    .trim()
    .min(2, "Slug must be at least 2 characters")
    .max(50)
    .regex(
      /^[a-z0-9-]+$/,
      "Slug can only contain lowercase letters, numbers, and hyphens",
    ),
});

export const workspaceUpdateSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .optional(),
    slug: z
      .string()
      .trim()
      .min(2, "Slug must be at least 2 characters")
      .max(50)
      .regex(
        /^[a-z0-9-]+$/,
        "Slug can only contain lowercase letters, numbers, and hyphens",
      )
      .optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required to update a workspace",
  });

export const orgIdParamSchema = z.object({
  orgId: z.string().uuid("Invalid orgId format"),
});

export const workspaceIdParamSchema = z
  .object({
    workspaceId: z.string().uuid("Invalid workspaceId format"),
  })
  .passthrough();

export const workspaceDetailParamsSchema = z.object({
  orgId: z.string().uuid("Invalid orgId format"),
  workspaceId: z.string().uuid("Invalid workspaceId format"),
});

export type CreateWorkspaceBody = z.infer<typeof workspaceCreateSchema>;
export type UpdateWorkspaceBody = z.infer<typeof workspaceUpdateSchema>;
export type OrgIdParamInput = z.infer<typeof orgIdParamSchema>;
export type WorkspaceIdParamInput = z.infer<typeof workspaceIdParamSchema>;
export type WorkspaceDetailParamsInput = z.infer<
  typeof workspaceDetailParamsSchema
>;
