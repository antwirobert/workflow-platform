import fs from "fs";
import { ForbiddenError, NotFoundError } from "../../common/errors";
import { prisma } from "../../lib/prisma";
import { OrgRole } from "../../generated/prisma/enums";
import { deleteCache, deleteCacheByPattern } from "../../redis/cache";
import { CacheKeys } from "../../redis/cacheKeys";

export class FilesService {
  async upload(
    taskId: string,
    uploadedById: string,
    file: Express.Multer.File,
  ) {
    const createdFile = await prisma.file.create({
      data: {
        filename: file.originalname,
        storedName: file.filename,
        mimeType: file.mimetype,
        size: file.size,
        path: file.path,
        taskId,
        uploadedById,
      },
      include: {
        uploadedBy: { select: { id: true, name: true, email: true } },
      },
    });

    await this.invalidateTaskCache(taskId);
    return createdFile;
  }

  async list(taskId: string) {
    return prisma.file.findMany({
      where: { taskId },
      orderBy: { createdAt: "desc" },
      include: {
        uploadedBy: { select: { id: true, name: true, email: true } },
      },
    });
  }

  async getById(taskId: string, fileId: string) {
    const file = await prisma.file.findUnique({
      where: { id: fileId },
    });

    if (!file || file.taskId !== taskId) {
      throw new NotFoundError("File");
    }

    return file;
  }

  async delete(
    fileId: string,
    taskId: string,
    userId: string,
    orgRole: OrgRole,
  ) {
    const file = await prisma.file.findUnique({ where: { id: fileId } });

    if (!file || file.taskId !== taskId) {
      throw new NotFoundError("File");
    }

    const isPriviledged = ["OWNER", "ADMIN"].includes(orgRole);
    const isCreator = file.uploadedById === userId;

    if (!isPriviledged && !isCreator) {
      throw new ForbiddenError(
        "You do not have permission to perform this action.",
      );
    }

    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }

    const deletedFile = await prisma.file.delete({ where: { id: fileId } });
    await this.invalidateTaskCache(taskId);
    return deletedFile;
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
}

export const filesService = new FilesService();
