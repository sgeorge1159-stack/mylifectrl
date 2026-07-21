import { Navigate, Outlet, useLocation } from 'react-router-dom';

/**
 * ProtectedRoute wraps authenticated pages.
 * Redirects to /login if no token is found, preserving the intended destination.
 * Renders the child routes (via <Outlet />) when authenticated.
 */
export default function ProtectedRoute() {
  const token = localStorage.getItem('token');
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return <Outlet />;
}
