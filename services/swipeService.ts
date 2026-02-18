import type { SwipeCandidate, SwipeDirection } from '@/models';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const swipeService = {
  getCandidates: async (
    _companyId: string,
    _limit?: number
  ): Promise<SwipeCandidate[]> => {
    await delay(700);
    return [];
  },

  recordSwipe: async (
    _swiperCompanyId: string,
    _targetCompanyId: string,
    _direction: SwipeDirection
  ): Promise<{ matched: boolean; matchId?: string }> => {
    await delay(400);
    return { matched: false };
  },
};
