import fs from "fs";
import { ForbiddenError, NotFoundError } from "../../common/errors";
import { prisma } from "../../lib/prisma";
import { OrgRole } from "../../generated/prisma/enums";
import { deleteCache, deleteCacheByPattern } from "../../redis/cache";
import { CacheKeys } from "../../redis/cacheKeys";
import { deleteFromCloudinary, uploadToCloudinary } from "../../lib/cloudinary";

export class FilesService {
  async upload(
    taskId: string,
    uploadedById: string,
    file: Express.Multer.File,
  ) {
    const result = await uploadToCloudinary(file, `tasks/${taskId}`);

    try {
      const createdFile = await prisma.file.create({
        data: {
          filename: file.originalname,
          mimeType: file.mimetype,
          size: file.size,
          url: result.secure_url,
          publicId: result.public_id,
          resourceType: result.resource_type,
          taskId,
          uploadedById,
        },
        include: {
          uploadedBy: { select: { id: true, name: true, email: true } },
        },
      });

      await this.invalidateTaskCache(taskId);
      return createdFile;
    } catch (err) {
      await deleteFromCloudinary(
        result.public_id,
        result.resource_type as "image" | "raw" | "video",
      ).catch(() => {});
      throw err;
    }
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

    const isPrivileged = ["OWNER", "ADMIN"].includes(orgRole);
    const isCreator = file.uploadedById === userId;

    if (!isPrivileged && !isCreator) {
      throw new ForbiddenError(
        "You do not have permission to perform this action.",
      );
    }

    const deletedFile = await prisma.file.delete({ where: { id: fileId } });

    try {
      await deleteFromCloudinary(
        file.publicId,
        file.resourceType as "image" | "raw" | "video",
      );
    } catch (err) {
      console.error(`Failed to delete Cloudinary asset ${file.publicId}`, err);
    }

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
