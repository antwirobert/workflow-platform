import z from "zod";

export const createProjectSchema = z.object({
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
  description: z
    .string()
    .trim()
    .max(500, "Description cannot exceed 500 characters")
    .optional(),
});

export const updateProjectSchema = z
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
    description: z
      .string()
      .trim()
      .max(500, "Description cannot exceed 500 characters")
      .optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required to update a project",
  });

export const workpaceIdParamSchema = z.object({
  workspaceId: z.string().uuid("Invalid workspaceId format"),
});

export const projectDetailParamsSchema = z.object({
  workspaceId: z.string().uuid("Invalid workspaceId format"),
  projectId: z.string().uuid("Invalid projectId format"),
});

export type CreateProjectBody = z.infer<typeof createProjectSchema>;
export type UpdateProjectBody = z.infer<typeof updateProjectSchema>;
export type WorkspaceIdParamInput = z.infer<typeof workpaceIdParamSchema>;
export type ProjectDetailParamsInput = z.infer<
  typeof projectDetailParamsSchema
>;
