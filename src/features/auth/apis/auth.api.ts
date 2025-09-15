import { apiService } from "@/services/api.service";
import { IUser, UserRoleEnum } from "@/types/user";

export interface LoginDto {
  email: string;
  password: string;
}

export async function loginApi(credentials: LoginDto) {
  return apiService.post<
    {
      token: string;
    }
  >("/auth/login", credentials);
}

export async function googleLoginApi(_code: string) {
  throw new Error("Not implemented");
}

export async function getProfileApi(): Promise<IUser> {
  const data = await apiService.get<{
    id: number;
    email: string;
    role: "Admin" | "Member";
  }>("/auth/me");
  const { id, email } = data;
  const role = {
    Admin: UserRoleEnum.ADMIN,
    Member: UserRoleEnum.MEMBER,
  }[data.role];

  return {
    id,
    email,
    role,
  };
}

export interface RegisterDto {
  email: string;
  password: string;
}

export async function registerApi(credentials: RegisterDto) {
  return apiService.post<
    {
      token: string;
    }
  >("/auth/register", credentials);
}
