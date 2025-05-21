
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { roleConfig, UserRole } from '@/config/roles';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, userRole } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" />;
  }

  return <>{children}</>;
}
