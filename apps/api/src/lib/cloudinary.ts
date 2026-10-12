import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import crypto from "crypto";
import path from "path";

export function uploadToCloudinary(
  file: Express.Multer.File,
  folder = "uploads",
): Promise<UploadApiResponse> {
  const ext = path.extname(file.originalname);
  const randomName = crypto.randomBytes(16).toString("hex");

  const isImage = file.mimetype.startsWith("image/");
  const publicId = isImage ? randomName : `${randomName}${ext}`;

  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder,
          public_id: publicId,
          resource_type: "auto",
        },
        (error, result) => {
          if (error || !result) return reject(error);
          resolve(result);
        },
      )
      .end(file.buffer);
  });
}

export function deleteFromCloudinary(
  publicId: string,
  resourceType: "image" | "raw" | "video" = "image",
) {
  return cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
}
