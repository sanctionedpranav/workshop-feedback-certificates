import AdminDashboard from "../pages/AdminDashboard";
import { ProtectedRoute } from "../auth/ProtectedRoute";
import type { RouteObject } from "react-router-dom";
import Register from "../pages/Register";
import Login from "../pages/Login";

export const appRoutes: RouteObject[] = [
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },
];
