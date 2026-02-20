import type { Company } from '@/models';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

const COMPANY_STORAGE_KEY = '@nmq_company_profile';
const ONBOARDING_DRAFT_KEY = '@nmq_onboarding_draft';

export interface OnboardingDraft {
  currentStep: number;
  legalName: string;
  website: string;
  industry: string;
  employeeRange: string;
  hqLocation: string;
  offeringSummary: string;
  offerings: string[];
  needsSummary: string;
  needs: string[];
  dealSizeMin?: number;
  dealSizeMax?: number;
  geographies: string[];
  engagementModels: string[];
  logoUrl: string;
  description: string;
}

const EMPTY_DRAFT: OnboardingDraft = {
  currentStep: 1,
  legalName: '',
  website: '',
  industry: '',
  employeeRange: '',
  hqLocation: '',
  offeringSummary: '',
  offerings: [],
  needsSummary: '',
  needs: [],
  dealSizeMin: undefined,
  dealSizeMax: undefined,
  geographies: [],
  engagementModels: [],
  logoUrl: '',
  description: '',
};

interface CompanyState {
  company: Company | null;
  isLoading: boolean;
  error: string | null;
  hasCompletedOnboarding: boolean;
  onboardingDraft: OnboardingDraft;
  setCompany: (company: Company) => void;
  updateCompany: (updates: Partial<Company>) => void;
  clearCompany: () => void;
  setOnboardingDraft: (updates: Partial<OnboardingDraft>) => void;
  resetOnboardingDraft: () => void;
  persistDraft: () => Promise<void>;
  loadDraft: () => Promise<void>;
  completeOnboarding: (company: Company) => Promise<void>;
  loadCompany: () => Promise<void>;
}

export const useCompanyStore = create<CompanyState>((set, get) => ({
  company: null,
  isLoading: false,
  error: null,
  hasCompletedOnboarding: false,
  onboardingDraft: { ...EMPTY_DRAFT },

  setCompany: (company: Company) =>
    set({ company, hasCompletedOnboarding: true }),

  updateCompany: (updates: Partial<Company>) =>
    set((state) => ({
      company: state.company ? { ...state.company, ...updates } : null,
    })),

  clearCompany: () =>
    set({ company: null, hasCompletedOnboarding: false }),

  setOnboardingDraft: (updates: Partial<OnboardingDraft>) =>
    set((state) => ({
      onboardingDraft: { ...state.onboardingDraft, ...updates },
    })),

  resetOnboardingDraft: () =>
    set({ onboardingDraft: { ...EMPTY_DRAFT } }),

  persistDraft: async () => {
    try {
      const { onboardingDraft } = get();
      await AsyncStorage.setItem(
        ONBOARDING_DRAFT_KEY,
        JSON.stringify(onboardingDraft)
      );
    } catch {
      // Silent fail for draft persistence
    }
  },

  loadDraft: async () => {
    try {
      const stored = await AsyncStorage.getItem(ONBOARDING_DRAFT_KEY);
      if (stored) {
        const draft = JSON.parse(stored) as OnboardingDraft;
        set({ onboardingDraft: { ...EMPTY_DRAFT, ...draft } });
      }
    } catch {
      // Silent fail
    }
  },

  completeOnboarding: async (company: Company) => {
    set({ company, hasCompletedOnboarding: true, isLoading: false });
    try {
      await AsyncStorage.setItem(COMPANY_STORAGE_KEY, JSON.stringify(company));
      await AsyncStorage.removeItem(ONBOARDING_DRAFT_KEY);
    } catch {
      // Silent fail
    }
    set({ onboardingDraft: { ...EMPTY_DRAFT } });
  },

  loadCompany: async () => {
    set({ isLoading: true });
    try {
      const stored = await AsyncStorage.getItem(COMPANY_STORAGE_KEY);
      if (stored) {
        const company = JSON.parse(stored) as Company;
        set({ company, hasCompletedOnboarding: true, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch {
      set({ isLoading: false });
    }
  },
}));

export default useCompanyStore;
