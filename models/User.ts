export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  companyId: string;
  role: UserRole;
  linkedInId?: string;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = 'owner' | 'member' | 'admin';
