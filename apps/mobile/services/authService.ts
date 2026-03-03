import type { User } from '@/models';
import { DEMO_MODE, DEMO_OTP_CODE } from '@/constants';
import { trpc, setSessionToken, clearSessionToken } from './trpcClient';

function demoUser(email: string): User {
  return {
    id: `demo-user-${Date.now()}`,
    email,
    name: email.split('@')[0],
    companyId: '',
    role: 'owner',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export const authService = {
  requestOtp: async (email: string): Promise<{ success: boolean }> => {
    if (DEMO_MODE) {
      // Simulate network delay
      await new Promise((r) => setTimeout(r, 600));
      return { success: true };
    }
    const result = await trpc.auth.requestOtp.mutate({ email });
    return result;
  },

  verifyOtp: async (email: string, otp: string): Promise<User | null> => {
    if (DEMO_MODE) {
      await new Promise((r) => setTimeout(r, 500));
      if (otp === DEMO_OTP_CODE) {
        return demoUser(email);
      }
      return null;
    }
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
    if (DEMO_MODE) {
      // Emulate LinkedIn OAuth flow with brief delay
      await new Promise((r) => setTimeout(r, 800));
      return demoUser('demo.linkedin@company.com');
    }
    // TODO Phase 7: Implement LinkedIn OAuth via Better-Auth
    throw new Error('LinkedIn OAuth not yet implemented');
  },

  logout: async (): Promise<void> => {
    if (DEMO_MODE) return;
    try {
      await trpc.auth.signOut.mutate();
    } finally {
      await clearSessionToken();
    }
  },

  getCurrentUser: async (): Promise<User | null> => {
    if (DEMO_MODE) return null;
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
