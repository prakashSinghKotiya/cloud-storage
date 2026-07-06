import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";

export default function AuthGuard() {
  const { isAuthenticated, isAuthLoading } = useAuthContext();

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-[#0d1117] text-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}