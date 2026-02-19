import { useCallback, useEffect, useRef, useState } from 'react';
import { useMatchStore } from '@/stores';
import { matchService } from '@/services';

export function useMatches(companyId = 'my_company') {
  const {
    matches,
    selectedMatch,
    setMatches,
    addMatch,
    selectMatch,
    updateMatchStatus,
    getTotalUnread,
  } = useMatchStore();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasFetched = useRef(false);

  const loadMatches = useCallback(async () => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    setIsLoading(true);
    setError(null);
    try {
      const data = await matchService.getMatches(companyId);
      setMatches(data);
    } catch {
      setError('Failed to load matches.');
    } finally {
      setIsLoading(false);
    }
  }, [companyId, setMatches]);

  useEffect(() => {
    loadMatches();
  }, [loadMatches]);

  return {
    matches,
    selectedMatch,
    isLoading,
    error,
    totalUnread: getTotalUnread(),
    addMatch,
    selectMatch,
    updateMatchStatus,
    refresh: () => {
      hasFetched.current = false;
      loadMatches();
    },
  };
}
