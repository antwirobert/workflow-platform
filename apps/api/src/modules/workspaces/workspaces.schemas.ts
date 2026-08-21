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

export const workspaceSlugParamSchema = z.object({
  workspaceSlug: z.string().min(1),
});

export const workspaceDetailParamsSchema = z.object({
  orgSlug: z.string().min(1),
  workspaceSlug: z.string().min(1),
});

export const listWorkspacesQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
});

export type CreateWorkspacePayload = z.infer<typeof workspaceCreateSchema>;
export type UpdateWorkspacePayload = z.infer<typeof workspaceUpdateSchema>;
export type WorkspaceSlugParam = z.infer<typeof workspaceSlugParamSchema>;
export type WorkspaceDetailParams = z.infer<typeof workspaceDetailParamsSchema>;
export type listWorkspacesQueryInput = z.infer<
  typeof listWorkspacesQuerySchema
>;
