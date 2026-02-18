import type { Company } from '@/models';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const companyService = {
  getCompany: async (_companyId: string): Promise<Company | null> => {
    await delay(500);
    return null;
  },

  updateCompany: async (
    _companyId: string,
    _updates: Partial<Company>
  ): Promise<Company | null> => {
    await delay(600);
    return null;
  },

  createCompany: async (_data: Partial<Company>): Promise<Company | null> => {
    await delay(800);
    return null;
  },
};
