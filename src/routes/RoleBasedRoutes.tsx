import { Navigate } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import type React from "react";

type Props = {
  children: React.ReactNode;
  allowedRoles: string[];
};

const RoleBasedRoute = ({ children, allowedRoles }: Props) => {
  const user = useAppSelector((s) => s.auth.user);

  if (!user) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(user.role || '')) return <Navigate to="/unauthorized" replace />;

  return children;
};

export default RoleBasedRoute;
