import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "@/hooks/useAuthContext";

const RequireAuth = () => {
  const { user, isLoading } = useAuthContext();

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Loading...</div>
      </div>
    );
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default RequireAuth;