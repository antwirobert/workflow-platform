export interface TaskFile {
  id: string;
  createdAt: string;
  taskId: string;
  filename: string;
  storedName: string;
  mimeType: string;
  size: number;
  path: string;
  uploadedById: string;
  uploadedBy: {
    id: string;
    name: string;
    email: string;
  };
}
