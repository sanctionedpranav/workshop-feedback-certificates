import { useAuth } from "../../auth/AuthContext";


export default function AdminTopbar() {
  const { logout } = useAuth();

  return (
    <header className="bg-white shadow px-6 py-3 flex justify-end items-center ">
      <button className="cursor-pointer bg-[#990000] py-2 px-4 text-white rounded" onClick={logout}>
        Logout
      </button>
    </header>
  )
}
