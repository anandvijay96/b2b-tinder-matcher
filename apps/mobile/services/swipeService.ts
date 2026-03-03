import type { SwipeCandidate, SwipeDirection } from '@/models';
import { DEMO_MODE } from '@/constants';
import { trpc } from './trpcClient';
import { parseJsonArray } from './companyService';
import { DEMO_CANDIDATES } from './mockData/demoCandidates';

let demoRightSwipeCount = 0;

function mapDbCompanyToCandidate(db: Record<string, unknown>): SwipeCandidate {
  return {
    company: {
      id: db.id as string,
      brandName: (db.brandName as string) ?? (db.legalName as string),
      legalName: db.legalName as string,
      logoUrl: db.logoUrl as string | undefined,
      industry: db.industry as string,
      hqLocation: db.hqLocation as string,
      employeeRange: (db.employeeRange as string) ?? '1-10',
      description: (db.description as string) ?? '',
      offerings: parseJsonArray(db.offerings as string),
      needs: parseJsonArray(db.needs as string),
      offeringSummary: (db.offeringSummary as string) ?? '',
      needsSummary: (db.needsSummary as string) ?? '',
      verificationBadges: [],
      responseSpeed: 'moderate',
      geographies: parseJsonArray(db.geographies as string),
    },
    matchReasons: [
      { icon: '🤝', label: 'Potential Synergy', description: 'Complementary offerings and needs' },
    ],
    matchScore: 75,
  };
}

function directionToAction(direction: SwipeDirection): 'like' | 'pass' | 'super_like' {
  if (direction === 'right') return 'like';
  if (direction === 'left') return 'pass';
  return 'super_like';
}

export const swipeService = {
  getCandidates: async (
    _companyId: string,
    limit = 20,
  ): Promise<SwipeCandidate[]> => {
    if (DEMO_MODE) {
      await new Promise((r) => setTimeout(r, 300));
      return DEMO_CANDIDATES.slice(0, limit);
    }
    try {
      const result = await trpc.company.getCandidates.query({ limit });
      return (result.items ?? []).map((item: unknown) =>
        mapDbCompanyToCandidate(item as Record<string, unknown>),
      );
    } catch {
      return DEMO_CANDIDATES;
    }
  },

  recordSwipe: async (
    _swiperCompanyId: string,
    targetCompanyId: string,
    direction: SwipeDirection,
  ): Promise<{ matched: boolean; matchId?: string }> => {
    if (DEMO_MODE) {
      await new Promise((r) => setTimeout(r, 150));
      if (direction === 'right') {
        demoRightSwipeCount++;
        if (demoRightSwipeCount % 3 === 0) {
          return { matched: true, matchId: `demo-match-live-${Date.now()}` };
        }
      }
      return { matched: false };
    }
    try {
      const result = await trpc.match.recordSwipe.mutate({
        targetCompanyId,
        action: directionToAction(direction),
      });
      return {
        matched: !!result.match,
        matchId: result.match?.id ?? undefined,
      };
    } catch {
      if (direction === 'right') {
        demoRightSwipeCount++;
        if (demoRightSwipeCount % 3 === 0) {
          return { matched: true, matchId: `demo-match-live-${Date.now()}` };
        }
      }
      return { matched: false };
    }
  },
};
