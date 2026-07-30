import z from "zod";

export const fileTaskParamsSchema = z.object({
  taskId: z.string().uuid("Invalid taskId format"),
  fileId: z.string().uuid("Invalid fileId format"),
});

export const taskFileParamsSchema = z.object({
  orgId: z.string().uuid("Invalid orgId format"),
  workspaceId: z.string().uuid("Invalid workspaceId format"),
  projectId: z.string().uuid("Invalid projectId format"),
  taskId: z.string().uuid("Invalid taskId format"),
});

export type fileTaskParams = z.infer<typeof fileTaskParamsSchema>;
