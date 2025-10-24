import { NavLink } from 'react-router-dom'

interface SidebarProps {
  role: 'admin' | 'vendor' | 'customer'
}

const menuConfig: Record<string, { name: string; path: string }[]> = {
  admin: [
    { name: 'Dashboard', path: '/admin/dashboard' },
    { name: 'All Forms', path: '/admin/forms/create' },
    { name: 'Create Forms', path: '/admin/forms' },

  ],
}

export default function AdminSidebar({ role }: SidebarProps) {
  const items = menuConfig[role]

  return (
    <aside className="w-60 bg-gray-900 text-white p-6">
      <h1 className="text-xl font-semibold mb-6 capitalize">{role} Panel</h1>
      <ul className="flex flex-col gap-3">
        {items.map((item) => (
          <li key={item.name}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                isActive ? 'text-blue-400 font-bold' : 'hover:text-blue-300'
              }
            >
              {item.name}
            </NavLink>
          </li>
        ))}

      </ul>
    </aside>
  )
}
