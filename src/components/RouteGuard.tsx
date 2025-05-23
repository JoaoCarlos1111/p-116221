
import { Navigate } from 'react-router-dom';
import { departments } from '@/services/auth';

interface RouteGuardProps {
  children: React.ReactNode;
  requiredDepartment?: string;
}

export default function RouteGuard({ children, requiredDepartment }: RouteGuardProps) {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');

  if (!token || !userStr) {
    return <Navigate to="/login" replace />;
  }

  try {
    const user = JSON.parse(userStr);

    if (requiredDepartment && !user.isAdmin && !user.departments.includes(requiredDepartment)) {
      return <Navigate to="/" replace />;
    }

    return <>{children}</>;
  } catch (error) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return <Navigate to="/login" replace />;
  }
}
