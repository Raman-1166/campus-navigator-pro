import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/auth-store';
import type { UserRole } from '@/types/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRole?: UserRole;
  redirectTo?: string;
}

export function ProtectedRoute({ 
  children, 
  allowedRole,
  redirectTo = '/login'
}: ProtectedRouteProps) {
  const { isAuthenticated, role } = useAuthStore();
  const location = useLocation();

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Role check required and user doesn't have the required role
  if (allowedRole && role !== allowedRole && role !== 'admin') {
    // Admin can access everything, others need exact role match
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
