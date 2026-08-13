import z from "zod";

export const createCommentSchema = z.object({
  body: z.string().trim().min(1).max(2000),
});

export const commentDetailParamsSchema = z.object({
  taskId: z.string().uuid("Invalid taskId format"),
  commentId: z.string().uuid("Invalid commentId format"),
});

export type CreateCommentPayload = z.infer<typeof createCommentSchema>;
export type CommentDetailParams = z.infer<typeof commentDetailParamsSchema>;
