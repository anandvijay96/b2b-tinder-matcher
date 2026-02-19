import type { SwipeCandidate, SwipeDirection } from '@/models';
import mockCandidates from './mockData/candidates.json';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const swipeService = {
  getCandidates: async (
    _companyId: string,
    limit = 20
  ): Promise<SwipeCandidate[]> => {
    await delay(700);
    return (mockCandidates as SwipeCandidate[]).slice(0, limit);
  },

  recordSwipe: async (
    _swiperCompanyId: string,
    targetCompanyId: string,
    direction: SwipeDirection
  ): Promise<{ matched: boolean; matchId?: string }> => {
    await delay(300);
    const matched = direction === 'right' && Math.random() > 0.6;
    return {
      matched,
      matchId: matched ? `match_${targetCompanyId}_${Date.now()}` : undefined,
    };
  },
};
