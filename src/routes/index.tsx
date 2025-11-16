import type { RouteObject } from "react-router-dom";
import { publicRoutes } from "./AppRouter";
import ProtectedRoute from "../components/ProtectedRoutes";
import RoleBasedRoute from "./RoleBasedRoutes";
import { Navigate } from "react-router-dom";

import { useSelector } from "react-redux";
import Dashboard from "../pages/Dashboard";
import AdminPage from "../pages/AdminPage";
import DoctorPage from "../pages/DoctorPage";
import NursePage from "../pages/NursePage";
import PatientPage from "../pages/PatientPage";
import About from "../pages/About";
import NotFound from "../pages/NotFound";
import Home from "../pages/Home";


const RootRedirect = () => {
  const user = useSelector((state: any) => state.auth?.user);
  return user ? <Navigate to="/dashboard" replace /> : <Navigate to="/home" replace />;
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
  { path: "/home", element: <Home /> },
  ...publicRoutes,
  ...protectedRoutes,
  ...roleBasedRoutes,
  { path: "*", element: <NotFound /> },
];
