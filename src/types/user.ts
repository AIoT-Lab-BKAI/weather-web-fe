export enum UserRoleEnum {
  ADMIN = "admin",
  USER = "user",
}

export interface IUser {
  id: number;
  username: string;
  email: string;
  role: UserRoleEnum;
  name?: string;
}
