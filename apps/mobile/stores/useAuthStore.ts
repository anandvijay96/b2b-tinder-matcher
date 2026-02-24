import type { User } from '@/models';
import { authService } from '@/services';
import { create } from 'zustand';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  requestOtp: (email: string) => Promise<boolean>;
  verifyOtp: (email: string, otp: string) => Promise<boolean>;
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

  requestOtp: async (email: string) => {
    set({ isLoading: true, error: null });
    try {
      await authService.requestOtp(email);
      set({ isLoading: false });
      return true;
    } catch {
      set({ error: 'Failed to send OTP. Please try again.', isLoading: false });
      return false;
    }
  },

  verifyOtp: async (email: string, otp: string) => {
    set({ isLoading: true, error: null });
    try {
      const user = await authService.verifyOtp(email, otp);
      if (user) {
        set({ user, isAuthenticated: true, isLoading: false });
        return true;
      }
      set({ error: 'Invalid or expired OTP', isLoading: false });
      return false;
    } catch {
      set({ error: 'Verification failed. Please try again.', isLoading: false });
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
      set({ error: 'LinkedIn login not yet available.', isLoading: false });
      return false;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await authService.logout();
    } finally {
      set({ user: null, isAuthenticated: false, isLoading: false, error: null });
    }
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
