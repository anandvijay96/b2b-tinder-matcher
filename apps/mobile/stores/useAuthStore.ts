import type { User } from '@/models';
import { authService } from '@/services';
import { create } from 'zustand';
import { useCompanyStore } from './useCompanyStore';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  requestOtp: (email: string) => Promise<boolean>;
  verifyOtp: (email: string, otp: string) => Promise<boolean>;
  loginWithLinkedIn: () => Promise<boolean>;
  devBypass: () => void;
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

  devBypass: () => {
    const mockUser: User = {
      id: 'dev-bypass-user',
      email: 'dev@nmqmatch.com',
      name: 'Dev User',
      companyId: 'dev-company-001',
      role: 'owner',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    set({ user: mockUser, isAuthenticated: true, isLoading: false, error: null });
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await authService.logout();
      await useCompanyStore.getState().clearCompany();
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
