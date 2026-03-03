import type { Match, MatchStatus } from '@/models';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DEMO_MODE } from '@/constants';
import { trpc } from './trpcClient';
import { mapDbCompanyToMobile, toIso } from './companyService';
import { DEMO_MATCHES } from './mockData/demoCandidates';

const DEMO_MATCHES_KEY = '@nmq_demo_matches';

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
  if (DEMO_MODE) return match;
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
  if (DEMO_MODE) return 'dev-company-001';
  try {
    const result = await trpc.company.getMyCompany.query();
    return result ? (result as unknown as Record<string, unknown>).id as string : null;
  } catch {
    return null;
  }
}

async function loadDemoMatches(): Promise<Match[]> {
  try {
    const raw = await AsyncStorage.getItem(DEMO_MATCHES_KEY);
    if (raw) {
      const saved: Match[] = JSON.parse(raw);
      return saved;
    }
  } catch { /* ignore */ }
  return [];
}

async function saveDemoMatches(matches: Match[]): Promise<void> {
  try {
    await AsyncStorage.setItem(DEMO_MATCHES_KEY, JSON.stringify(matches));
  } catch { /* ignore */ }
}

export const matchService = {
  getMatches: async (_companyId: string): Promise<Match[]> => {
    if (DEMO_MODE) {
      await new Promise((r) => setTimeout(r, 200));
      const saved = await loadDemoMatches();
      // Merge saved live matches with static demo matches (dedupe by id)
      const ids = new Set(saved.map((m) => m.id));
      const merged = [...saved, ...DEMO_MATCHES.filter((m) => !ids.has(m.id))];
      return merged;
    }
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
      return DEMO_MATCHES;
    }
  },

  getMatch: async (matchId: string): Promise<Match | null> => {
    if (DEMO_MODE) {
      const saved = await loadDemoMatches();
      const all = [...saved, ...DEMO_MATCHES];
      return all.find((m) => m.id === matchId) ?? null;
    }
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
      return DEMO_MATCHES.find((m) => m.id === matchId) ?? null;
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
    if (DEMO_MODE) {
      // Update status in local storage
      const saved = await loadDemoMatches();
      const idx = saved.findIndex((m) => m.id === matchId);
      if (idx >= 0) {
        saved[idx].status = status;
        await saveDemoMatches(saved);
      }
      return true;
    }
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

  /** Called by swipe deck when a demo match is created — persist locally */
  saveDemoMatch: async (match: Match): Promise<void> => {
    const saved = await loadDemoMatches();
    saved.unshift(match);
    await saveDemoMatches(saved);
  },
};
