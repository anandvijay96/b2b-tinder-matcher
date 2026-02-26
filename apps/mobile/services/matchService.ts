import type { Match, MatchStatus } from '@/models';
import { trpc } from './trpcClient';
import { mapDbCompanyToMobile, toIso } from './companyService';

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

function mapDbMatchToMobile(
  db: Record<string, unknown>,
  myCompanyId: string,
): Match {
  const companyAId = db.companyAId as string;
  const companyBId = db.companyBId as string;
  const partnerId = companyAId === myCompanyId ? companyBId : companyAId;

  return {
    id: db.id as string,
    companyAId,
    companyBId,
    matchedCompany: {
      id: partnerId,
      brandName: 'Loading…',
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

async function hydrateMatchCompany(match: Match): Promise<Match> {
  try {
    const result = await trpc.company.getById.query({ id: match.matchedCompany.id });
    const company = mapDbCompanyToMobile(result as unknown as Record<string, unknown>);
    return {
      ...match,
      matchedCompany: {
        id: company.id,
        brandName: company.brandName,
        industry: company.industry,
        hqLocation: company.hqLocation,
        logoUrl: company.logoUrl,
        offeringSummary: company.offeringSummary,
        needsSummary: company.needsSummary,
        verificationBadges: company.verificationBadges,
      },
    };
  } catch {
    return match;
  }
}

async function getMyCompanyId(): Promise<string | null> {
  try {
    const result = await trpc.company.getMyCompany.query();
    return result ? (result as unknown as Record<string, unknown>).id as string : null;
  } catch {
    return null;
  }
}

export const matchService = {
  getMatches: async (_companyId: string): Promise<Match[]> => {
    try {
      const [results, myCompanyId] = await Promise.all([
        trpc.match.listMatches.query(),
        getMyCompanyId(),
      ]);
      const cid = myCompanyId ?? _companyId;
      const matchList = results.map((r: unknown) =>
        mapDbMatchToMobile(r as Record<string, unknown>, cid),
      );
      const hydrated = await Promise.all(matchList.map(hydrateMatchCompany));
      return hydrated;
    } catch {
      return [];
    }
  },

  getMatch: async (matchId: string): Promise<Match | null> => {
    try {
      const [result, myCompanyId] = await Promise.all([
        trpc.match.getById.query({ id: matchId }),
        getMyCompanyId(),
      ]);
      const match = mapDbMatchToMobile(
        result as unknown as Record<string, unknown>,
        myCompanyId ?? '',
      );
      return hydrateMatchCompany(match);
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
