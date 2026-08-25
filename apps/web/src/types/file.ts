export interface TaskFile {
  id: string;
  createdAt: Date;
  taskId: string;
  filename: string;
  storedName: string;
  mimeType: string;
  size: number;
  path: string;
  uploadedById: string;
  uploadedBy: {
    id: true;
    name: true;
    email: true;
  };
}
