import { Navigate } from 'react-router-dom';
import { useMemo } from 'react';

interface RouteGuardProps {
  children: React.ReactNode;
  requiredDepartment?: string | string[];
}

export default function RouteGuard({ children, requiredDepartment }: RouteGuardProps) {
  const auth = useMemo(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (!token || !userStr) {
      return { isAuthenticated: false, user: null };
    }

    try {
      const user = JSON.parse(userStr);
      return { isAuthenticated: true, user };
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return { isAuthenticated: false, user: null };
    }
  }, []);

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredDepartment && !auth.user.isAdmin) {
    const departments = Array.isArray(requiredDepartment) ? requiredDepartment : [requiredDepartment];
    // Check if user has access
    const hasAccess = auth.user?.isAdmin ||
      auth.user?.departments?.some(dept => departments.includes(dept)) ||
      (auth.user?.isClient && departments.includes('client'));

    if (!auth.user || !hasAccess) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
}