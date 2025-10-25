import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";
import AdminSidebar from "../components/admin/Sidebar";
import AdminTopbar from "../components/admin/Topbar";
import AdminFooter from "../components/admin/Footer";
import DashboardViewport from "../components/admin";
import { useAuth } from "../auth/AuthContext";

export default function AdminDashboard() {
  const { user } = useAuth();

  return (
    <>
      <div className="flex min-h-screen bg-gray-100">
        <AdminSidebar role="admin" />
        <div className="flex flex-col flex-1">
          <AdminTopbar />
          <main className="p-6 flex-1">
            <DashboardViewport>
              <h2>Welcome, {user?.email}</h2>
              <Link to="/admin/templates" className="bg-blue-500 text-white p-6 rounded-lg shadow hover:bg-blue-600">
                Manage Certificate Templates
              </Link>

              <Link to="/admin/preview-certificate" className="bg-green-500 text-white p-6 rounded-lg shadow hover:bg-green-600">
                Generate & Preview Certificates
              </Link>
            </DashboardViewport>
          </main>
          <AdminFooter />
        </div>
      </div>

    </>
  );
}
