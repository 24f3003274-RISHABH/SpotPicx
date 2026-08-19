import { create } from 'zustand';
import { User, UserRole } from '../types';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;

  setAuth: (user: User, accessToken: string, refreshToken?: string) => void;
  setAccessToken: (accessToken: string) => void;
  setUser: (user: User) => void;
  logout: () => void;
  setInitialized: (val: boolean) => void;
  hasRole: (roles: UserRole | UserRole[]) => boolean;
}

const ACCESS_TOKEN_KEY = 'spotpicks_access_token';
const REFRESH_TOKEN_KEY = 'spotpicks_refresh_token';
const USER_KEY = 'spotpicks_user';

// Safely retrieve initial cached state from storage
const getInitialState = () => {
  try {
    const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    const storedUser = localStorage.getItem(USER_KEY);
    const user = storedUser ? JSON.parse(storedUser) : null;

    return {
      accessToken,
      refreshToken,
      user,
      isAuthenticated: !!(accessToken && user),
    };
  } catch {
    return {
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
    };
  }
};

const initial = getInitialState();

export const useAuthStore = create<AuthState>((set, get) => ({
  user: initial.user,
  accessToken: initial.accessToken,
  refreshToken: initial.refreshToken,
  isAuthenticated: initial.isAuthenticated,
  isLoading: false,
  isInitialized: false,

  setAuth: (user: User, accessToken: string, refreshToken?: string) => {
    try {
      localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      if (refreshToken) {
        localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
      }
    } catch (err) {
      console.warn('Could not persist auth to localStorage:', err);
    }

    set({
      user,
      accessToken,
      refreshToken: refreshToken || get().refreshToken,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  setAccessToken: (accessToken: string) => {
    try {
      localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    } catch (err) {
      console.warn('Could not update access token:', err);
    }
    set({ accessToken });
  },

  setUser: (user: User) => {
    try {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch (err) {
      console.warn('Could not update user object:', err);
    }
    set({ user });
  },

  logout: () => {
    try {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } catch (err) {
      console.warn('Could not clear auth tokens:', err);
    }

    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },

  setInitialized: (val: boolean) => set({ isInitialized: val }),

  hasRole: (roles: UserRole | UserRole[]): boolean => {
    const currentUser = get().user;
    if (!currentUser) return false;
    const roleList = Array.isArray(roles) ? roles : [roles];
    return roleList.includes(currentUser.role);
  },
}));
