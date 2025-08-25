import { IUser } from "@/types/user";
import { DefinedUseQueryResult, useMutation, UseMutationResult, useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, ReactNode, useMemo, use } from "react";
import { getProfileApi, googleLoginApi, loginApi, LoginDto, signupApi, SignupDto } from "./apis/auth.api";

import { LS_KEY_ACCESS_TOKEN } from "@/constants/ls-key.constant";

export interface AuthContextType {
  getUserQuery: DefinedUseQueryResult<IUser | null>;
  loginMutation: UseMutationResult<unknown, unknown, LoginDto>;
  googleLoginMutation: UseMutationResult<unknown, unknown, string>;
  signupMutation: UseMutationResult<unknown, unknown, SignupDto>;
  logoutMutation: UseMutationResult<unknown, unknown, void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  const getUserQuery = useQuery<IUser | null>({
    queryKey: ["/auth/profile"],
    queryFn: async () => {
      const storedToken = localStorage.getItem(LS_KEY_ACCESS_TOKEN);
      if (!storedToken)
        return null;
      const data = await getProfileApi();
      return data;
    },
    initialData: null,
  });

  const handleSuccessLogin = (data: { accessToken: string }) => {
    localStorage.setItem(LS_KEY_ACCESS_TOKEN, data.accessToken);
    getUserQuery.refetch();
  };

  const loginMutation = useMutation({
    mutationFn: async (dto: LoginDto) => loginApi(dto),
    onSuccess: handleSuccessLogin,
  });

  const googleLoginMutation = useMutation({
    mutationFn: async (code: string) => googleLoginApi(code),
    onSuccess: handleSuccessLogin,
  });

  const signupMutation = useMutation({
    mutationFn: async (dto: SignupDto) => signupApi(dto),
    onSuccess: handleSuccessLogin,
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      localStorage.removeItem(LS_KEY_ACCESS_TOKEN);
      queryClient.setQueryData(["/auth/me"], null);
    },
  });

  const authContextValue = useMemo<AuthContextType>(
    () => ({
      getUserQuery,
      loginMutation,
      googleLoginMutation,
      signupMutation,
      logoutMutation,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [getUserQuery],
  );

  return (
    <AuthContext value={authContextValue}>
      {children}
    </AuthContext>
  );
};

export function useAuth() {
  const context = use(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
