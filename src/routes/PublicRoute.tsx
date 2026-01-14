import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore, useIsAdmin } from "@/stores/authStore";

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isCustomer = useAuthStore((s) => s.user?.role?.name === "customer");
  const isAdmin = useIsAdmin();

  if (isAuthenticated && !isAdmin && !isCustomer) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;
