import { Navigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

// Wrap any page that needs a logged-in user. Everyone else is sent to /login.
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted text-sm">
        Loading your account…
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default ProtectedRoute;
