import AdminDashboard from "../pages/AdminDashboard";
import { ProtectedRoute } from "../auth/ProtectedRoute";
import type { RouteObject } from "react-router-dom";
import Register from "../pages/Register";
import Login from "../pages/Login";
import FormList from "../pages/admin/FormList";
import FormBuilder from "../pages/admin/FormBuilder";
import { PublicFormPage } from "../pages/PublicFormPage";
import { ThankYouPage } from "../pages/ThankYouPage";

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
    path: "/admin/forms",
    element: (
      <ProtectedRoute>
        <FormList />
      </ProtectedRoute>)
  },
  {
    path: "/admin/forms/create",
    element: (
      <ProtectedRoute>
        <FormBuilder />
      </ProtectedRoute>)
  },
  {
    path:"/form/:formId",
     element: (<PublicFormPage />)
  },
  {
    path:"/thank-you",
     element:(<ThankYouPage />)
  },
  {
    path: "/admin/dashboard",
    element: (
      <ProtectedRoute>
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },
];
