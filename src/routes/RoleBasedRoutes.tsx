import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type React from "react";

type Props = {
  children: React.ReactNode;
  allowedRoles: string[];
};

const RoleBasedRoute = ({ children, allowedRoles }: Props) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(user.role))
    return <Navigate to="/unauthorized" replace />;

  return children;
};

export default RoleBasedRoute;
