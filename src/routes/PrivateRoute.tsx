import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore, useIsAdmin } from "@/stores/authStore";

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isAdmin = useIsAdmin();

  if (!isAuthenticated && !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
