export enum UserRoleEnum {
  ADMIN = "admin",
  MEMBER = "member",
}

export interface IUser {
  id: number;
  email: string;
  role: UserRoleEnum;
  username?: string;
  name?: string;
}
