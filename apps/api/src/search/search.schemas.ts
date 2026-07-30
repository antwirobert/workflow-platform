import z from "zod";

export const searchSchema = z.object({
  q: z.string().min(1).max(100),
  type: z.enum(["tasks", "projects", "comments"]).optional(),
});

export type SearchQuery = z.infer<typeof searchSchema>;
