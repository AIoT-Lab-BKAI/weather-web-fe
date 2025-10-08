import { useAuthStore } from "@/features/auth/store";
import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export function useRequireAuth() {
  const { user, isLoading } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate({ to: "/login" });
    }
  }, [isLoading, user, navigate]);

  return {
    isAuthenticated: !!user,
    user,
    isLoading,
  };
}
