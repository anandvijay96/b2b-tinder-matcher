import type { Match, MatchStatus } from '@/models';
import { trpc } from './trpcClient';
import { toIso } from './companyService';

function parseMatchReasons(raw: unknown): Match['matchReasons'] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  if (typeof raw === 'string') {
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }
  return [];
}

function mapDbMatchToMobile(db: Record<string, unknown>): Match {
  const companyAId = db.companyAId as string;
  const companyBId = db.companyBId as string;

  return {
    id: db.id as string,
    companyAId,
    companyBId,
    matchedCompany: {
      id: companyBId,
      brandName: 'Partner Company',
      industry: '',
      hqLocation: '',
      offeringSummary: '',
      needsSummary: '',
      verificationBadges: [],
    },
    matchReasons: parseMatchReasons(db.matchReasons),
    matchScore: (db.matchScore as number) ?? 0,
    status: (db.status as MatchStatus) ?? 'new',
    lastMessagePreview: undefined,
    lastMessageAt: undefined,
    unreadCount: 0,
    createdAt: toIso(db.createdAt as Date | string | number),
    updatedAt: toIso(db.updatedAt as Date | string | number),
  };
}

export const matchService = {
  getMatches: async (_companyId: string): Promise<Match[]> => {
    try {
      const results = await trpc.match.listMatches.query();
      return results.map((r: unknown) =>
        mapDbMatchToMobile(r as Record<string, unknown>),
      );
    } catch {
      return [];
    }
  },

  getMatch: async (matchId: string): Promise<Match | null> => {
    try {
      const result = await trpc.match.getById.query({ id: matchId });
      return mapDbMatchToMobile(result as unknown as Record<string, unknown>);
    } catch {
      return null;
    }
  },

  createMatch: async (
    _companyAId: string,
    _companyBId: string,
  ): Promise<Match | null> => {
    // Match creation is handled server-side by recordSwipe when both parties like each other
    return null;
  },

  updateMatchStatus: async (
    matchId: string,
    status: Match['status'],
  ): Promise<boolean> => {
    try {
      await trpc.match.updateStatus.mutate({
        id: matchId,
        status: status as 'chatting' | 'meeting_scheduled' | 'completed' | 'declined',
      });
      return true;
    } catch {
      return false;
    }
  },
};
