import { UpdateUserBody } from "./users.schemas";

export interface UserResult {
  id: string;
  name: string;
  email: string;
}

export interface UpdateUserInput extends UpdateUserBody {
  userId: string;
}
