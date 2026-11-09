import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import apiService from '../services/api';
import {
  SESSION_EXPIRED_EVENT,
  getToken,
  loadSession,
  saveSession,
  clearSession,
  updateStoredUser,
} from '../services/session';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  // Restore the saved session straight away so a refresh never shows the login screen.
  const [user, setUser] = useState(() => loadSession()?.user ?? null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [accountStatus, setAccountStatus] = useState(null);
  const [onHoldMessage, setOnHoldMessage] = useState(null);

  const resetState = useCallback(() => {
    setUser(null);
    setError(null);
    setAccountStatus(null);
    setOnHoldMessage(null);
  }, []);

  // Check the restored session with the server in the background.
  // Only a rejected token logs the admin out (handled by the session-expired
  // event); a network error or server hiccup keeps them signed in.
  useEffect(() => {
    if (!getToken()) return;

    let cancelled = false;
    apiService
      .verifyToken()
      .then((response) => {
        if (cancelled || !response?.success || !response.user) return;
        setUser((current) => {
          if (!current) return current;
          const refreshed = {
            ...current,
            email: response.user.email || current.email,
            role: response.user.role || current.role,
            name: response.user.name || current.name,
          };
          updateStoredUser(refreshed);
          return refreshed;
        });
      })
      .catch((err) => {
        if (!err?.isAuthError) {
          console.warn('⚠️ Could not verify admin session, keeping it for now:', err?.message);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Log out when any API call finds the token rejected, and keep tabs in sync:
  // logging out (or in) in one tab updates the others.
  useEffect(() => {
    const handleExpired = () => {
      resetState();
      setError('Your session has expired. Please sign in again.');
    };

    const handleStorage = (event) => {
      if (event.key !== null && event.key !== 'admin_token' && event.key !== 'admin_user') return;
      const session = loadSession();
      setUser(session ? session.user : null);
    };

    window.addEventListener(SESSION_EXPIRED_EVENT, handleExpired);
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener(SESSION_EXPIRED_EVENT, handleExpired);
      window.removeEventListener('storage', handleStorage);
    };
  }, [resetState]);

  // Login function
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      setAccountStatus(null);
      setOnHoldMessage(null);

      const response = await apiService.adminLogin(email, password);

      if (response.success && response.token) {
        const adminUser = {
          email: response.user.email,
          role: response.user.role,
          name: response.user.name || 'Admin User',
          id: response.user.id || 'admin_001'
        };

        saveSession(response.token, adminUser);
        setUser(adminUser);

        console.log('✅ Admin login successful:', email);
        return { success: true };
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (err) {
      console.error('❌ Login error:', err);

      let extractedOnHoldMessage = null;
      let extractedAccountStatus = null;

      if (err.message && err.message.includes('due to some violations')) {
        extractedOnHoldMessage = 'due to some violations your account is on hold Try contacting admin of growsmart';
        extractedAccountStatus = 'inactive';
      }

      setOnHoldMessage(extractedOnHoldMessage);
      setAccountStatus(extractedAccountStatus);
      setError(err.message);
      return { success: false, error: err.message, accountStatus: extractedAccountStatus, onHoldMessage: extractedOnHoldMessage };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = useCallback(() => {
    clearSession();
    resetState();
    console.log('✅ Admin logged out');
  }, [resetState]);

  // Check if user is admin
  const isAdmin = () => {
    return user && user.role === 'admin';
  };

  // Get auth headers for API calls
  const getAuthHeaders = () => {
    const token = getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const value = {
    user,
    loading,
    error,
    accountStatus,
    onHoldMessage,
    login,
    logout,
    isAdmin,
    getAuthHeaders,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
