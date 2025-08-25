import { useAuth } from "@/features/auth/context";
import { useNavigate } from "@tanstack/react-router";
import { ReactNode, useEffect } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { getUserQuery } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!getUserQuery.isLoading && !getUserQuery.data) {
      navigate({ to: "/login" });
    }
  }, [getUserQuery.isLoading, getUserQuery.data, navigate]);

  // Show loading state while checking authentication
  if (getUserQuery.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Don't render children if user is not authenticated
  if (!getUserQuery.data) {
    return null;
  }

  return <>{children}</>;
}
