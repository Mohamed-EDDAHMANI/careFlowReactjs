import type { RouteObject } from "react-router-dom";
import { publicRoutes } from "./PublicRoutes";
import ProtectedRoute from "./ProtectedRoutes";
import RoleBasedRoute from "./RoleBasedRoutes";
import { Navigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import Dashboard from "../pages/Dashboard";
import AdminPage from "../pages/AdminPage";
import DoctorPage from "../pages/DoctorPage";
import NursePage from "../pages/NursePage";
import PatientPage from "../pages/PatientPage";
import About from "../pages/About";
import NotFound from "../pages/NotFound";


const RootRedirect = () => {
  const { user } = useAuth();
  return user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />;
};

const protectedRoutes: RouteObject[] = [
  { path: "/dashboard", element: <ProtectedRoute>{<Dashboard />}</ProtectedRoute> },
  { path: "/about", element: <ProtectedRoute>{<About />}</ProtectedRoute> },
];

const roleBasedRoutes: RouteObject[] = [
  {
    path: "/admin",
    element: (
      <RoleBasedRoute allowedRoles={["admin"]}>{<AdminPage />}</RoleBasedRoute>
    ),
  },
  {
    path: "/doctor",
    element: (
      <RoleBasedRoute allowedRoles={["doctor"]}>{<DoctorPage />}</RoleBasedRoute>
    ),
  },
  {
    path: "/nurse",
    element: (
      <RoleBasedRoute allowedRoles={["nurse"]}>{<NursePage />}</RoleBasedRoute>
    ),
  },
  {
    path: "/patient",
    element: (
      <RoleBasedRoute allowedRoles={["patient"]}>{<PatientPage />}</RoleBasedRoute>
    ),
  },
];

export const routes: RouteObject[] = [
  { path: "/", element: <RootRedirect /> }, 
  ...publicRoutes,
  ...protectedRoutes,
  ...roleBasedRoutes,
  { path: "*", element: <NotFound /> },
];
