import type { User } from '@/models';
import { trpc, setSessionToken, clearSessionToken } from './trpcClient';

export const authService = {
  requestOtp: async (email: string): Promise<{ success: boolean }> => {
    const result = await trpc.auth.requestOtp.mutate({ email });
    return result;
  },

  verifyOtp: async (email: string, otp: string): Promise<User | null> => {
    const result = await trpc.auth.verifyOtp.mutate({ email, otp });
    if (result.success && result.user) {
      if (result.token) {
        await setSessionToken(result.token);
      }
      return {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name ?? '',
        avatarUrl: result.user.image ?? undefined,
        companyId: '',
        role: 'owner',
        createdAt: result.user.createdAt?.toString() ?? new Date().toISOString(),
        updatedAt: result.user.updatedAt?.toString() ?? new Date().toISOString(),
      };
    }
    return null;
  },

  loginWithLinkedIn: async (): Promise<User | null> => {
    // TODO Phase 7: Implement LinkedIn OAuth via Better-Auth
    throw new Error('LinkedIn OAuth not yet implemented');
  },

  logout: async (): Promise<void> => {
    try {
      await trpc.auth.signOut.mutate();
    } finally {
      await clearSessionToken();
    }
  },

  getCurrentUser: async (): Promise<User | null> => {
    try {
      const session = await trpc.auth.getSession.query();
      if (session?.user) {
        return {
          id: session.user.id,
          email: session.user.email,
          name: session.user.name ?? '',
          avatarUrl: session.user.image ?? undefined,
          companyId: '',
          role: 'owner',
          createdAt: session.user.createdAt?.toString() ?? new Date().toISOString(),
          updatedAt: session.user.updatedAt?.toString() ?? new Date().toISOString(),
        };
      }
    } catch {
      // No valid session
    }
    return null;
  },
};
