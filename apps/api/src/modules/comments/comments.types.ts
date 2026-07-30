import { CreateCommentPayload } from "./comments.schemas";

export interface CreateCommentInput extends CreateCommentPayload {
  taskId: string;
  authorId: string;
}

export interface CommentResult {
  id: string;
  body: string;
  taskId: string;
  author: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
