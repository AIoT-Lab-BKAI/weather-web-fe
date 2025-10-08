import { IUser } from "@/types/user";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface AuthState {
  user: IUser | null;
  setUser: (user: IUser | null) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      set => ({
        user: null,
        setUser: user => set({ user }),
        isLoading: false,
        setIsLoading: isLoading => set({ isLoading }),
      }),
      { name: "AuthStore" },
    ),
  ),
);
