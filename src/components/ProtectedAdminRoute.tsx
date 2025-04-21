
import React from "react";
import { useAdminAuth } from "@/components/AdminAuthContext";
import { Navigate } from "react-router-dom";

export default function ProtectedAdminRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useAdminAuth();
  if (!isLoggedIn) {
    return <Navigate to="/adminlogin" />;
  }
  return <>{children}</>;
}
