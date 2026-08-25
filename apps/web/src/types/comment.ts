export interface Comment {
  id: string;
  body: string;
  taskId: string;
  author: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}
