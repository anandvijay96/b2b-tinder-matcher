import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Match, SwipeCandidate, SwipeDirection } from '@/models';
import { useSwipeStore, useMatchStore } from '@/stores';
import { swipeService } from '@/services';

export function useSwipeDeck(myCompanyId = 'my_company') {
  const {
    candidates,
    currentIndex,
    dailySwipeCount,
    dailySwipeLimit,
    filters,
    setCandidates,
    recordSwipe,
    setFilters,
    resetDailyCount,
    hasReachedLimit,
  } = useSwipeStore();

  const { addMatch } = useMatchStore();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastMatchId, setLastMatchId] = useState<string | null>(null);
  const hasFetched = useRef(false);

  const loadCandidates = useCallback(async () => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    setIsLoading(true);
    setError(null);
    try {
      const data = await swipeService.getCandidates(myCompanyId);
      setCandidates(data);
    } catch {
      setError('Failed to load candidates. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [myCompanyId, setCandidates]);

  useEffect(() => {
    loadCandidates();
  }, [loadCandidates]);

  const filteredRemaining = useMemo((): SwipeCandidate[] => {
    const remaining = candidates.slice(currentIndex);
    const noFilters =
      filters.industries.length === 0 &&
      filters.companySizes.length === 0 &&
      filters.geographies.length === 0 &&
      !filters.verificationLevel;
    if (noFilters) return remaining;
    return remaining.filter((candidate) => {
      const c = candidate.company;
      if (filters.industries.length > 0 && !filters.industries.includes(c.industry)) return false;
      if (filters.companySizes.length > 0 && !filters.companySizes.includes(c.employeeRange)) return false;
      if (filters.geographies.length > 0 && !c.geographies.some((g) => filters.geographies.includes(g))) return false;
      if (filters.verificationLevel === 'verified' && c.verificationBadges.length === 0) return false;
      return true;
    });
  }, [candidates, currentIndex, filters]);

  const visibleCandidates = filteredRemaining.slice(0, 3);

  const handleSwipe = useCallback(
    async (
      direction: SwipeDirection,
      candidate?: SwipeCandidate
    ): Promise<{ matched: boolean; matchId?: string }> => {
      if (hasReachedLimit()) return { matched: false };

      const current = candidate ?? filteredRemaining[0] ?? null;
      if (!current) return { matched: false };

      recordSwipe(direction);

      try {
        const result = await swipeService.recordSwipe(
          myCompanyId,
          current.company.id,
          direction
        );
        if (result.matched && result.matchId) {
          setLastMatchId(result.matchId);
          const match: Match = {
            id: result.matchId,
            companyAId: myCompanyId,
            companyBId: current.company.id,
            matchedCompany: {
              id: current.company.id,
              brandName: current.company.brandName,
              logoUrl: current.company.logoUrl,
              industry: current.company.industry,
              hqLocation: current.company.hqLocation,
              offeringSummary: current.company.offeringSummary,
              needsSummary: current.company.needsSummary,
              verificationBadges: current.company.verificationBadges,
            },
            matchReasons: current.matchReasons,
            matchScore: current.matchScore,
            status: 'new',
            unreadCount: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          addMatch(match);
        }
        return result;
      } catch {
        return { matched: false };
      }
    },
    [hasReachedLimit, filteredRemaining, recordSwipe, myCompanyId, addMatch]
  );

  const refresh = useCallback(() => {
    hasFetched.current = false;
    setCandidates([]);
    loadCandidates();
  }, [loadCandidates, setCandidates]);

  return {
    candidates,
    visibleCandidates,
    currentIndex,
    dailySwipeCount,
    dailySwipeLimit,
    isLoading,
    error,
    filters,
    lastMatchId,
    hasReachedLimit: hasReachedLimit(),
    handleSwipe,
    setFilters,
    resetDailyCount,
    refresh,
  };
}
