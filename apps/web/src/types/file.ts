export interface TaskFile {
  id: string;
  createdAt: string;
  taskId: string;
  filename: string;
  mimeType: string;
  size: number;
  url: string;
  publicId: string;
  resourceType: string;
  uploadedById: string;
  uploadedBy: {
    id: string;
    name: string;
    email: string;
  };
}
