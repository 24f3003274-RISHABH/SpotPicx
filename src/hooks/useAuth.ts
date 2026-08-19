import { useState, useCallback } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { authService, LoginPayload, RegisterPayload } from '../services/authService';
import { UserRole } from '../types';

export const useAuth = () => {
  const {
    user,
    accessToken,
    isAuthenticated,
    isLoading,
    isInitialized,
    setAuth,
    setAccessToken,
    setUser,
    logout: storeLogout,
    hasRole,
  } = useAuthStore();

  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const login = useCallback(
    async (payload: LoginPayload) => {
      setIsSubmitting(true);
      setAuthError(null);
      try {
        const data = await authService.login(payload);
        setAuth(data.user, data.accessToken, data.refreshToken);
        return data;
      } catch (err: any) {
        const message = err.message || 'Login failed. Please check your credentials.';
        setAuthError(message);
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    [setAuth]
  );

  const register = useCallback(
    async (payload: RegisterPayload) => {
      setIsSubmitting(true);
      setAuthError(null);
      try {
        const data = await authService.register(payload);
        setAuth(data.user, data.accessToken, data.refreshToken);
        return data;
      } catch (err: any) {
        const message = err.message || 'Registration failed. Please try again.';
        setAuthError(message);
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    [setAuth]
  );

  const logout = useCallback(async () => {
    try {
      await authService.logout().catch(() => {});
    } finally {
      storeLogout();
    }
  }, [storeLogout]);

  const refreshProfile = useCallback(async () => {
    try {
      const currentUser = await authService.getMe();
      setUser(currentUser);
      return currentUser;
    } catch (err) {
      console.warn('Could not refresh profile:', err);
      return null;
    }
  }, [setUser]);

  const checkPermission = useCallback(
    (roles: UserRole | UserRole[]) => {
      return hasRole(roles);
    },
    [hasRole]
  );

  return {
    user,
    accessToken,
    isAuthenticated,
    isLoading: isLoading || isSubmitting,
    isInitialized,
    authError,
    setAuthError,
    login,
    register,
    logout,
    refreshProfile,
    hasRole: checkPermission,
  };
};
