import fs from "fs";
import { NotFoundError } from "../../common/errors";
import { prisma } from "../../lib/prisma";

export class FilesService {
  async upload(
    taskId: string,
    uploadedById: string,
    file: Express.Multer.File,
  ) {
    return prisma.file.create({
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

  async delete(fileId: string, taskId: string) {
    const file = await prisma.file.findUnique({ where: { id: fileId } });

    if (!file || file.taskId !== taskId) {
      throw new NotFoundError("File");
    }

    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }

    return prisma.file.delete({ where: { id: fileId } });
  }
}

export const filesService = new FilesService();
