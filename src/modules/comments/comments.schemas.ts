import z from "zod";

export const createCommentSchema = z.object({
  body: z.string().trim().min(1).max(2000),
});

export const taskIdParamSchema = z.object({
  taskId: z.string().uuid("Invalid taskId format"),
  commentId: z.string().uuid("Invalid commentId format"),
});

export const commentIdParamSchema = z.object({
  commentId: z.string().uuid("Invalid commentId format"),
});

export const taskCommentParamsSchema = z.object({
  taskId: z.string().uuid("Invalid taskId format"),
  projectId: z.string().uuid("Invalid projectId format"),
});

export const commentTaskParamsSchema = z.object({
  workspaceId: z.string().uuid("Invalid workspaceId format"),
  projectId: z.string().uuid("Invalid projectId format"),
  taskId: z.string().uuid("Invalid taskId format"),
  orgId: z.string().uuid("Invalid orgId format"),
});

export const commentDetailParamsSchema = z.object({
  workspaceId: z.string().uuid("Invalid workspaceId format"),
  projectId: z.string().uuid("Invalid projectId format"),
  taskId: z.string().uuid("Invalid taskId format"),
  orgId: z.string().uuid("Invalid orgId format"),
  commentId: z.string().uuid("Invalid commentId format"),
});

export type CreateCommentBody = z.infer<typeof createCommentSchema>;
export type TaskIdParamInput = z.infer<typeof taskIdParamSchema>;
export type CommentTaskParamsInput = z.infer<typeof commentTaskParamsSchema>;
export type TaskCommentParamsInput = z.infer<typeof taskCommentParamsSchema>;
export type commentIdParamInput = z.infer<typeof commentIdParamSchema>;
