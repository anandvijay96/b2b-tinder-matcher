import type { SwipeCandidate, SwipeDirection } from '@/models';
import { create } from 'zustand';

interface SwipeState {
  candidates: SwipeCandidate[];
  currentIndex: number;
  dailySwipeCount: number;
  dailySwipeLimit: number;
  isLoading: boolean;
  error: string | null;
  filters: SwipeFilters;
  setCandidates: (candidates: SwipeCandidate[]) => void;
  recordSwipe: (direction: SwipeDirection) => void;
  setFilters: (filters: Partial<SwipeFilters>) => void;
  resetDailyCount: () => void;
  getCurrentCandidate: () => SwipeCandidate | null;
  hasReachedLimit: () => boolean;
}

export interface SwipeFilters {
  industries: string[];
  companySizes: string[];
  geographies: string[];
  verificationLevel: string | null;
}

const DEFAULT_FILTERS: SwipeFilters = {
  industries: [],
  companySizes: [],
  geographies: [],
  verificationLevel: null,
};

export const useSwipeStore = create<SwipeState>((set, get) => ({
  candidates: [],
  currentIndex: 0,
  dailySwipeCount: 0,
  dailySwipeLimit: 25,
  isLoading: false,
  error: null,
  filters: DEFAULT_FILTERS,

  setCandidates: (candidates: SwipeCandidate[]) =>
    set({ candidates, currentIndex: 0 }),

  recordSwipe: (_direction: SwipeDirection) =>
    set((state) => ({
      currentIndex: state.currentIndex + 1,
      dailySwipeCount: state.dailySwipeCount + 1,
    })),

  setFilters: (filters: Partial<SwipeFilters>) =>
    set((state) => ({
      filters: { ...state.filters, ...filters },
    })),

  resetDailyCount: () => set({ dailySwipeCount: 0 }),

  getCurrentCandidate: () => {
    const { candidates, currentIndex } = get();
    return currentIndex < candidates.length ? candidates[currentIndex] : null;
  },

  hasReachedLimit: () => {
    const { dailySwipeCount, dailySwipeLimit } = get();
    return dailySwipeCount >= dailySwipeLimit;
  },
}));

export default useSwipeStore;
