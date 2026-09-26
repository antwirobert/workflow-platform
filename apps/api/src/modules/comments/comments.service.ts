import { ForbiddenError, NotFoundError } from "../../common/errors";
import { Comment, OrgRole, User } from "../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { deleteCache, deleteCacheByPattern } from "../../redis/cache";
import { CacheKeys } from "../../redis/cacheKeys";
import { CommentResult, CreateCommentInput } from "./comments.types";

export class CommentsService {
  async create(input: CreateCommentInput): Promise<CommentResult> {
    const { body, taskId, authorId } = input;

    const comment = await prisma.comment.create({
      data: {
        body,
        taskId,
        authorId,
      },
      include: { author: true },
    });

    await this.invalidateTaskCache(taskId);

    return this.buildCommentResult(comment, comment.author);
  }

  async list(taskId: string): Promise<CommentResult[]> {
    const comments = await prisma.comment.findMany({
      where: { taskId },
      orderBy: { createdAt: "asc" },
      include: { author: true },
    });

    return comments.map((comment) =>
      this.buildCommentResult(comment, comment.author),
    );
  }

  async delete(
    commentId: string,
    taskId: string,
    userId: string,
    orgRole: OrgRole,
  ) {
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment || comment.taskId !== taskId)
      throw new NotFoundError("Comment");

    const isPriviledged = ["OWNER", "ADMIN"].includes(orgRole);
    const isCreator = comment.authorId === userId;

    if (!isPriviledged && !isCreator) {
      throw new ForbiddenError(
        "You do not have permission to perform this action.",
      );
    }

    await prisma.comment.delete({ where: { id: commentId } });
    await this.invalidateTaskCache(taskId);
  }

  private async invalidateTaskCache(taskId: string): Promise<void> {
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      select: {
        project: {
          select: {
            id: true,
            workspace: {
              select: { id: true, organizationId: true },
            },
          },
        },
      },
    });

    if (!task) return;

    const { project } = task;
    const { id: workspaceId, organizationId } = project.workspace;

    await Promise.all([
      deleteCacheByPattern(
        `organizations:${organizationId}:workspaces:${workspaceId}:projects:${project.id}:tasks:page=*`,
      ),
      deleteCache(
        CacheKeys.task(organizationId, workspaceId, project.id, taskId),
      ),
    ]);
  }

  private buildCommentResult(comment: Comment, user: User): CommentResult {
    return {
      id: comment.id,
      body: comment.body,
      taskId: comment.taskId,
      author: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    };
  }
}

export const commentsService = new CommentsService();
