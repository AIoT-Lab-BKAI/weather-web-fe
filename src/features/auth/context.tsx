import { IUser } from "@/types/user";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, ReactNode, use, useCallback, useMemo } from "react";
import { getProfileApi } from "./apis/auth.api";

import { LS_KEY_ACCESS_TOKEN } from "@/constants/ls-key.constant";

type LoginFn = () => Promise<{ token: string }>;

export interface AuthContextType {
  user: IUser | null;
  isLoading: boolean;
  refreshUser: () => void;
  login: (fn: LoginFn) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  const {
    data: user,
    isLoading,
    refetch: refreshUser,
  } = useQuery<IUser | null>({
    queryKey: ["profile"],
    queryFn: async () => {
      const storedToken = localStorage.getItem(LS_KEY_ACCESS_TOKEN);
      if (!storedToken) {
        return null;
      }
      return getProfileApi();
    },
    initialData: null,
  });

  const { mutateAsync: login } = useMutation({
    mutationFn: async (fn: LoginFn) => {
      const { token } = await fn();
      localStorage.setItem(LS_KEY_ACCESS_TOKEN, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.refetchQueries({ queryKey: ["profile"] });
    },
  });

  const logout = useCallback(() => {
    localStorage.removeItem(LS_KEY_ACCESS_TOKEN);
    queryClient.setQueryData(["profile"], null);
  }, [queryClient]);

  const authContextValue = useMemo<AuthContextType>(
    () => ({
      user,
      isLoading,
      refreshUser,
      login,
      logout,
    }),
    [user, isLoading, refreshUser, login, logout],
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
