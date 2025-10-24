import { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { ROLE } from '../constants/role';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    userId: null,
    role: null,
    accessToken: null,
    isAuthenticated: false,
    isLoading: true
  });

  useEffect(() => {
    const initializeAuth = () => {
      const token = localStorage.getItem('accessToken');
      
      if (token) {
        try {
          const decoded = jwtDecode(token);
          const currentTime = Date.now() / 1000;
          
          if (decoded.exp > currentTime) {
            setAuth({
              userId: decoded.userId,
              role: decoded.role,
              accessToken: token,
              isAuthenticated: true,
              isLoading: false
            });
          } else {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            setAuth(prev => ({ ...prev, isLoading: false }));
          }
        } catch (error) {
          console.error('Invalid token:', error);
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          setAuth(prev => ({ ...prev, isLoading: false }));
        }
      } else {
        setAuth(prev => ({ ...prev, isLoading: false }));
      }
    };

    initializeAuth();
  }, []);

  const login = (userData) => {
    setAuth({
      userId: userData.userId,
      role: userData.role,
      accessToken: userData.accessToken,
      isAuthenticated: true,
      isLoading: false
    });
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setAuth({
      userId: null,
      role: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false
    });
  };

  const isAdmin = () => {
    return auth.role === ROLE.ADMIN;
  };

  const value = {
    auth,
    setAuth: login,
    logout,
    isAdmin,
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;