import type { Company } from '@/models';
import { create } from 'zustand';

interface CompanyState {
  company: Company | null;
  isLoading: boolean;
  error: string | null;
  setCompany: (company: Company) => void;
  updateCompany: (updates: Partial<Company>) => void;
  clearCompany: () => void;
}

export const useCompanyStore = create<CompanyState>((set) => ({
  company: null,
  isLoading: false,
  error: null,

  setCompany: (company: Company) => set({ company }),

  updateCompany: (updates: Partial<Company>) =>
    set((state) => ({
      company: state.company ? { ...state.company, ...updates } : null,
    })),

  clearCompany: () => set({ company: null }),
}));

export default useCompanyStore;
