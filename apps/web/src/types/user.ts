export interface UserData {
  id: string;
  name: string;
  email: string;
}

export interface User {
  accessToken: string;
  refreshToken: string;
  user: UserData;
}
