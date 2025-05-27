import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { AuthService, User } from '@/services/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  currentUser: User | null;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  currentUser: null,
  isLoading: true,
  login: () => {},
  logout: () => {}
});

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const token = AuthService.getToken();
        const savedUser = AuthService.getCurrentUser();

        if (token && savedUser) {
          const isValid = await AuthService.verifyToken();
          if (isValid) {
            setCurrentUser(savedUser);
            setIsAuthenticated(true);
          } else {
            AuthService.logout();
            setIsAuthenticated(false);
          }
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Auth verification failed:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    verifyAuth();
  }, []);

  const login = async (token: string, user: User) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
  };

  const logout = () => {
    AuthService.logout();
    setCurrentUser(null);
    setIsAuthenticated(false);
    navigate('/login');
  };

  const value = useMemo(
    () => ({
      isAuthenticated,
      currentUser,
      isLoading,
      login,
      logout,
    }),
    [isAuthenticated, currentUser, isLoading]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface RouteGuardProps {
  children: React.ReactNode;
  requiredDepartment?: string | string[];
}

export function RouteGuard({ children, requiredDepartment }: RouteGuardProps) {
  const { isAuthenticated, currentUser, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredDepartment && !currentUser?.isAdmin) {
    const departments = Array.isArray(requiredDepartment) ? requiredDepartment : [requiredDepartment];
    const hasAccess = currentUser?.isAdmin ||
      currentUser?.departments?.some(dept => departments.includes(dept)) ||
      (currentUser?.isClient && departments.includes('client'));

    if (!currentUser || !hasAccess) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
}

export default RouteGuard;