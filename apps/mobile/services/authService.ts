import type { User } from '@/models';

const MOCK_USER: User = {
  id: 'user-001',
  email: 'john@acmecorp.com',
  name: 'John Mitchell',
  avatarUrl: undefined,
  companyId: 'company-001',
  role: 'owner',
  linkedInId: 'john-mitchell-12345',
  createdAt: '2026-01-15T10:00:00Z',
  updatedAt: '2026-01-15T10:00:00Z',
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const authService = {
  loginWithEmail: async (email: string): Promise<User | null> => {
    await delay(800);
    if (email) {
      return { ...MOCK_USER, email };
    }
    return null;
  },

  loginWithLinkedIn: async (): Promise<User | null> => {
    await delay(1200);
    return MOCK_USER;
  },

  logout: async (): Promise<void> => {
    await delay(300);
  },

  getCurrentUser: async (): Promise<User | null> => {
    await delay(500);
    return null;
  },
};
