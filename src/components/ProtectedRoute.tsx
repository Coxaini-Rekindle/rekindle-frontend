import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

import { useAuthStatus } from "../hooks/useAuthStatus";

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuthStatus();

  // Show loading state while checking authentication
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate replace to="/login" />;
  }

  // Render children if authenticated
  return <>{children}</>;
};
