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

export const workpaceIdParamSchema = z.object({
  workspaceId: z.string().uuid("Invalid workspaceId format"),
});

export type CreateProjectBody = z.infer<typeof createProjectSchema>;
export type WorkspaceIdParamInput = z.infer<typeof workpaceIdParamSchema>;
