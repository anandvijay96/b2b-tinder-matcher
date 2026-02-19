import { useCallback, useEffect, useRef, useState } from 'react';
import type { SwipeCandidate, SwipeDirection } from '@/models';
import { useSwipeStore } from '@/stores';
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
    getCurrentCandidate,
    hasReachedLimit,
  } = useSwipeStore();

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

  const handleSwipe = useCallback(
    async (direction: SwipeDirection): Promise<{ matched: boolean; matchId?: string }> => {
      if (hasReachedLimit()) return { matched: false };

      const current = getCurrentCandidate();
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
        }
        return result;
      } catch {
        return { matched: false };
      }
    },
    [hasReachedLimit, getCurrentCandidate, recordSwipe, myCompanyId]
  );

  const refresh = useCallback(() => {
    hasFetched.current = false;
    setCandidates([]);
    loadCandidates();
  }, [loadCandidates, setCandidates]);

  const visibleCandidates = ((): SwipeCandidate[] => {
    return candidates.slice(currentIndex, currentIndex + 3);
  })();

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
    currentCandidate: getCurrentCandidate(),
    hasReachedLimit: hasReachedLimit(),
    handleSwipe,
    setFilters,
    resetDailyCount,
    refresh,
  };
}
