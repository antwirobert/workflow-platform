import z from "zod";

export const fileTaskParamsSchema = z.object({
  taskId: z.string().uuid("Invalid taskId format"),
  fileId: z.string().uuid("Invalid fileId format"),
});

export type fileTaskParams = z.infer<typeof fileTaskParamsSchema>;
