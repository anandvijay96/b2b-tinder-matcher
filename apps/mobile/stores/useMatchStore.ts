import type { Match } from '@/models';
import { create } from 'zustand';

interface MatchState {
  matches: Match[];
  selectedMatch: Match | null;
  isLoading: boolean;
  error: string | null;
  setMatches: (matches: Match[]) => void;
  addMatch: (match: Match) => void;
  selectMatch: (match: Match | null) => void;
  updateMatchStatus: (matchId: string, status: Match['status']) => void;
  markMatchRead: (matchId: string) => void;
  getTotalUnread: () => number;
}

export const useMatchStore = create<MatchState>((set, get) => ({
  matches: [],
  selectedMatch: null,
  isLoading: false,
  error: null,

  setMatches: (matches: Match[]) => set({ matches }),

  addMatch: (match: Match) =>
    set((state) => {
      const alreadyExists = state.matches.some(
        (m) =>
          (m.companyAId === match.companyAId && m.companyBId === match.companyBId) ||
          (m.companyAId === match.companyBId && m.companyBId === match.companyAId)
      );
      if (alreadyExists) return state;
      return { matches: [match, ...state.matches] };
    }),

  selectMatch: (match: Match | null) => set({ selectedMatch: match }),

  updateMatchStatus: (matchId: string, status: Match['status']) =>
    set((state) => ({
      matches: state.matches.map((m) =>
        m.id === matchId ? { ...m, status } : m
      ),
    })),

  markMatchRead: (matchId: string) =>
    set((state) => ({
      matches: state.matches.map((m) =>
        m.id === matchId ? { ...m, unreadCount: 0 } : m
      ),
    })),

  getTotalUnread: () => {
    const { matches } = get();
    return matches.reduce((sum, m) => sum + m.unreadCount, 0);
  },
}));

export default useMatchStore;
