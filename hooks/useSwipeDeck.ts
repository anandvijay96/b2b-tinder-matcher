import type { SwipeDirection } from '@/models';
import { useSwipeStore } from '@/stores';

export function useSwipeDeck() {
  const {
    candidates,
    currentIndex,
    dailySwipeCount,
    dailySwipeLimit,
    isLoading,
    error,
    filters,
    setCandidates,
    recordSwipe,
    setFilters,
    resetDailyCount,
    getCurrentCandidate,
    hasReachedLimit,
  } = useSwipeStore();

  const handleSwipe = (direction: SwipeDirection) => {
    if (hasReachedLimit()) return;
    recordSwipe(direction);
  };

  return {
    candidates,
    currentIndex,
    dailySwipeCount,
    dailySwipeLimit,
    isLoading,
    error,
    filters,
    currentCandidate: getCurrentCandidate(),
    hasReachedLimit: hasReachedLimit(),
    setCandidates,
    handleSwipe,
    setFilters,
    resetDailyCount,
  };
}
