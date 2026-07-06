import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";


export default function RequireAdmin() {
  const { user, loading } = useAuthContext();

  if (loading) return null;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "Admin") {
    return <Navigate to="/app" replace />;
  }

  return <Outlet />;
}