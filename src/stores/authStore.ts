import { create } from 'zustand';

interface AuthUser {
  role: 'parent' | 'admin' | 'teacher';
  name: string;
  email: string;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  setAuth: (user: AuthUser, token: string, refreshToken?: string) => void;
  setToken: (token: string) => void;
  logout: () => void;
  restoreSession: () => void;
}

function readPersistedAuth(): { user: AuthUser; token: string; refreshToken: string | null } | null {
  try {
    const token = localStorage.getItem('kt_session_token');
    const refreshToken = localStorage.getItem('kt_refresh_token');
    const saved = localStorage.getItem('kt_logged_in_user');
    if (token && saved) {
      return { user: JSON.parse(saved) as AuthUser, token, refreshToken };
    }
  } catch {
    // corrupted payload — fall through to logged-out defaults
  }
  return null;
}

const persisted = typeof window !== 'undefined' ? readPersistedAuth() : null;

export const useAuthStore = create<AuthState>((set) => ({
  user: persisted?.user ?? null,
  token: persisted?.token ?? null,
  refreshToken: persisted?.refreshToken ?? null,
  isAuthenticated: persisted !== null,

  setAuth: (user, token, refreshToken) => {
    localStorage.setItem('kt_session_token', token);
    if (refreshToken) {
      localStorage.setItem('kt_refresh_token', refreshToken);
    }
    localStorage.setItem('kt_logged_in_user', JSON.stringify(user));
    set({ user, token, refreshToken: refreshToken || null, isAuthenticated: true });
  },

  setToken: (token) => {
    localStorage.setItem('kt_session_token', token);
    set({ token });
  },

  logout: () => {
    localStorage.removeItem('kt_session_token');
    localStorage.removeItem('kt_refresh_token');
    localStorage.removeItem('kt_logged_in_user');
    set({ user: null, token: null, refreshToken: null, isAuthenticated: false });
  },

  restoreSession: () => {
    const token = localStorage.getItem('kt_session_token');
    const refreshToken = localStorage.getItem('kt_refresh_token');
    const saved = localStorage.getItem('kt_logged_in_user');
    if (token && saved) {
      try {
        const user = JSON.parse(saved) as AuthUser;
        set({ user, token, refreshToken, isAuthenticated: true });
      } catch {
        set({ user: null, token: null, refreshToken: null, isAuthenticated: false });
      }
    }
  },
}));

export type { AuthUser };

// Granular selectors — components only re-render when their specific slice changes
export const useUser = () => useAuthStore((s) => s.user);
export const useIsAuthenticated = () => useAuthStore((s) => s.isAuthenticated);
export const useLogout = () => useAuthStore((s) => s.logout);
export const useSetAuth = () => useAuthStore((s) => s.setAuth);
