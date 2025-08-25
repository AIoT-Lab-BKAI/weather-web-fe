import { apiService } from "@/services/api.service";
import { IUser } from "@/types/user";

export interface LoginDto {
  username: string;
  password: string;
}

export async function loginApi(credentials: LoginDto) {
  interface ResponseData {
    accessToken: string;
    user: IUser;
  }

  return apiService.post<ResponseData>("/auth/sign-in", credentials);
}

export async function googleLoginApi(code: string) {
  interface ResponseData {
    accessToken: string;
    user: IUser;
  }

  return apiService.post<ResponseData>("/auth/google", { code });
}

export async function getProfileApi() {
  return apiService.get<IUser>("/auth/me");
}

export interface SignupDto {
  name: string;
  email: string;
  password: string;
}

export async function signupApi(credentials: SignupDto) {
  interface ResponseData {
    accessToken: string;
    user: IUser;
  }

  return apiService.post<ResponseData>("/auth/sign-up", credentials);
}
