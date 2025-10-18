import { useAuth } from "../auth/AuthContext";

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  return (
    <div style={{ textAlign: "center", marginTop: "5rem" }}>
      <h2>Welcome, {user?.email}</h2>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
