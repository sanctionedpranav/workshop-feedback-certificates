import { Outlet } from 'react-router-dom'
import AdminSidebar from '../components/admin/Sidebar'
import AdminTopbar from '../components/admin/Topbar'
import AdminFooter from '../components/admin/Footer'

export default function AdminLayout() {
  return (
    <>
      <div className="flex min-h-screen bg-gray-100">
        <AdminSidebar role="admin" />
        <div className="flex flex-col flex-1">
          <AdminTopbar />
          <main className="p-6 flex-1">
            <Outlet />
          </main>
          <AdminFooter />
        </div>
      </div>

    </>
  )
}
