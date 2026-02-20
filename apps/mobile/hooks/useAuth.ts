import { useAuthStore } from '@/stores';

export function useAuth() {
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    loginWithLinkedIn,
    logout,
    checkAuth,
    clearError,
  } = useAuthStore();

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    loginWithLinkedIn,
    logout,
    checkAuth,
    clearError,
  };
}
