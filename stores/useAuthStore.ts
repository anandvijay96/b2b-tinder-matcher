import type { User } from '@/models';
import { authService } from '@/services';
import { create } from 'zustand';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithLinkedIn: () => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (email: string, _password: string) => {
    set({ isLoading: true, error: null });
    try {
      const user = await authService.loginWithEmail(email);
      if (user) {
        set({ user, isAuthenticated: true, isLoading: false });
        return true;
      }
      set({ error: 'Invalid credentials', isLoading: false });
      return false;
    } catch {
      set({ error: 'Login failed. Please try again.', isLoading: false });
      return false;
    }
  },

  loginWithLinkedIn: async () => {
    set({ isLoading: true, error: null });
    try {
      const user = await authService.loginWithLinkedIn();
      if (user) {
        set({ user, isAuthenticated: true, isLoading: false });
        return true;
      }
      set({ error: 'LinkedIn login failed', isLoading: false });
      return false;
    } catch {
      set({ error: 'LinkedIn login failed. Please try again.', isLoading: false });
      return false;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    await authService.logout();
    set({ user: null, isAuthenticated: false, isLoading: false, error: null });
  },

  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const user = await authService.getCurrentUser();
      set({ user, isAuthenticated: !!user, isLoading: false });
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));

export default useAuthStore;
