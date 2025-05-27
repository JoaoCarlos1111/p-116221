import { Navigate, useNavigate } from 'react-router-dom';
import { useMemo, useState, useEffect } from 'react';

// Mock AuthService (replace with your actual AuthService)
const AuthService = {
  getToken: () => localStorage.getItem('token'),
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
  verifyToken: async () => {
    // Simulate token verification - replace with actual API call
    return new Promise((resolve, reject) => {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');

      if (token && userStr) {
        try {
          const user = JSON.parse(userStr);
          resolve(user);
        } catch {
          reject("Invalid user data");
        }

      } else {
        reject("No token found");
      }
    });
  },
  login: async (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthContext = React.createContext<{
  isAuthenticated: boolean;
  currentUser: any;
  isLoading: boolean;
  login: (token: string, user: any) => void;
  logout: () => void;
}>({
  isAuthenticated: false,
  currentUser: null,
  isLoading: true,
  login: () => {},
  logout: () => {}
});

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        // Check if user is already authenticated
        const token = AuthService.getToken();
        const savedUser = AuthService.getCurrentUser();

        if (token && savedUser) {
          setCurrentUser(savedUser);
          setIsAuthenticated(true);
          setIsLoading(false);
          return;
        }

        // If no token, redirect to login
        setIsAuthenticated(false);
        navigate('/login');
      } catch (error) {
        console.error('Auth verification failed:', error);
        setIsAuthenticated(false);
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };

    verifyAuth();
  }, [navigate]);

  const login = async (token: string, user: any) => {
    await AuthService.login(token, user);
    setCurrentUser(user);
    setIsAuthenticated(true);
    navigate('/dashboard');
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
    [isAuthenticated, currentUser, isLoading, login, logout]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

interface RouteGuardProps {
  children: React.ReactNode;
  requiredDepartment?: string | string[];
}

export function RouteGuard({ children, requiredDepartment }: RouteGuardProps) {
  const { isAuthenticated, currentUser, isLoading } = React.useContext(AuthContext);

  if (isLoading) {
    return <div>Loading...</div>; // Or a loading spinner
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredDepartment && !currentUser.isAdmin) {
    const departments = Array.isArray(requiredDepartment) ? requiredDepartment : [requiredDepartment];
    // Check if user has access
    const hasAccess = currentUser?.isAdmin ||
      currentUser?.departments?.some(dept => departments.includes(dept)) ||
      (currentUser?.isClient && departments.includes('client'));

    if (!currentUser || !hasAccess) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
}