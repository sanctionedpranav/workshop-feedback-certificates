import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import type { JSX } from "react";

interface Props {
  children: JSX.Element;
  allowedRoles?: string[];
}

export const ProtectedRoute = ({ children, allowedRoles = ["admin"] }: Props) => {
  const { user, role, loading } = useAuth();

  if (loading) return <p>Loading...</p>;
  if (!user) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(role || "")) return <p>Access Denied </p>;

  return children;
};
