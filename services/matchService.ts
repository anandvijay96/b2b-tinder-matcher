import type { Match } from '@/models';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const matchService = {
  getMatches: async (_companyId: string): Promise<Match[]> => {
    await delay(600);
    return [];
  },

  getMatch: async (_matchId: string): Promise<Match | null> => {
    await delay(400);
    return null;
  },

  createMatch: async (
    _companyAId: string,
    _companyBId: string
  ): Promise<Match | null> => {
    await delay(500);
    return null;
  },

  updateMatchStatus: async (
    _matchId: string,
    _status: Match['status']
  ): Promise<boolean> => {
    await delay(300);
    return true;
  },
};
