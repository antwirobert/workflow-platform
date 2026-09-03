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

export const projectSlugParamSchema = z.object({
  projectSlug: z.string().min(1),
});

export const projectDetailParamsSchema = z.object({
  orgSlug: z.string().min(1),
  workspaceSlug: z.string().min(1),
  projectSlug: z.string().min(1),
});

export const listProjectsQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(12),
  q: z.string().min(1).max(100).optional(),
});

export type CreateProjectPayload = z.infer<typeof createProjectSchema>;
export type UpdateProjectPayload = z.infer<typeof updateProjectSchema>;
export type ProjectSlugParam = z.infer<typeof projectSlugParamSchema>;
export type ProjectDetailParams = z.infer<typeof projectDetailParamsSchema>;
export type ListProjectsQueryInput = z.infer<typeof listProjectsQuerySchema>;
