import { useAuth } from "@/features/auth/context";
import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export function useRequireAuth() {
  const { getUserQuery } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!getUserQuery.isLoading && !getUserQuery.data) {
      navigate({ to: "/login" });
    }
  }, [getUserQuery.isLoading, getUserQuery.data, navigate]);

  return {
    isAuthenticated: !!getUserQuery.data,
    user: getUserQuery.data,
    isLoading: getUserQuery.isLoading,
  };
}

export function useRequireGuest() {
  const { getUserQuery } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!getUserQuery.isLoading && getUserQuery.data) {
      navigate({ to: "/dashboard" });
    }
  }, [getUserQuery.isLoading, getUserQuery.data, navigate]);

  return {
    isGuest: !getUserQuery.data,
    isLoading: getUserQuery.isLoading,
  };
}
