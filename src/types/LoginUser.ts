import type { LoginUserId } from "./Id";

export interface LoginUser {
  id: LoginUserId;
  name: string;
  username: string;
  password: string;
  email: string;
}
