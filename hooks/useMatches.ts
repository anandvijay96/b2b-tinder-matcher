import { useMatchStore } from '@/stores';

export function useMatches() {
  const {
    matches,
    selectedMatch,
    isLoading,
    error,
    setMatches,
    addMatch,
    selectMatch,
    updateMatchStatus,
    getTotalUnread,
  } = useMatchStore();

  return {
    matches,
    selectedMatch,
    isLoading,
    error,
    totalUnread: getTotalUnread(),
    setMatches,
    addMatch,
    selectMatch,
    updateMatchStatus,
  };
}
