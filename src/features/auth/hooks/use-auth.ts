import { LS_KEY_ACCESS_TOKEN } from "@/constants/ls-key.constant";
import { useAuthStore } from "@/features/auth/store";
import { IUser } from "@/types/user";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { getProfileApi } from "../apis/auth.api";

type LoginFn = () => Promise<{ token: string }>;

export function useAuth() {
  const queryClient = useQueryClient();
  const { setUser, setIsLoading } = useAuthStore();

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

  // Sync user data with Zustand store
  useEffect(() => {
    setUser(user);
  }, [user, setUser]);

  // Sync loading state with Zustand store
  useEffect(() => {
    setIsLoading(isLoading);
  }, [isLoading, setIsLoading]);

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

  const logout = () => {
    localStorage.removeItem(LS_KEY_ACCESS_TOKEN);
    queryClient.setQueryData(["profile"], null);
    setUser(null);
  };

  return {
    login,
    logout,
    refreshUser,
  };
}
