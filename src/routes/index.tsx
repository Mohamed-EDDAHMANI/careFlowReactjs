import type { RouteObject } from "react-router-dom";
import { publicRoutes } from "./AppRouter";
import ProtectedRoute from "../components/ProtectedRoutes";
import RootRedirect from "../components/RootRedirect";
import DashboardLayout from "../components/DashboardLayout";

import Dashboard from "../pages/Dashboard";
import NotFound from "../pages/NotFound";
import Home from "../pages/Home";

const dashboardRoutes: RouteObject[] = [
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Dashboard /> },
    ],
  },
];

export const routes: RouteObject[] = [
  { path: "/", element: <RootRedirect /> },
  { path: "/home", element: <Home /> },
  ...publicRoutes,
  ...dashboardRoutes,
  { path: "*", element: <NotFound /> },
];
