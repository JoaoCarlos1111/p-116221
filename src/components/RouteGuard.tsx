
import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { permissions } from '@/constants/permissions';
import { useAuth } from '@/hooks/useAuth';

interface RouteGuardProps {
  children: ReactNode;
  requiredDepartment?: string;
}

export const RouteGuard = ({ children, requiredDepartment }: RouteGuardProps) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredDepartment) {
    const userDepartment = user.mainDepartment;
    const isAdmin = userDepartment === 'admin';
    const hasAccess = isAdmin || permissions[userDepartment]?.pages.includes(location.pathname);

    if (!hasAccess) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <>{children}</>;
};
