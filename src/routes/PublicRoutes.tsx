import type { RouteObject } from "react-router-dom";
import Login from "../pages/Login";
import NotFound from "../pages/NotFound";
import Unauthorized from "../pages/Unauthorized";

export const publicRoutes: RouteObject[] = [
  { path: "/login", element: <Login /> },
  { path: "/unauthorized", element: <Unauthorized /> },
  { path: "/not-found", element: <NotFound /> },
];
