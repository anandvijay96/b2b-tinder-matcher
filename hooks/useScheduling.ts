import { schedulingService } from '@/services';
import type { MeetingSlot } from '@/models';
import { useCallback, useState } from 'react';

export function useScheduling(matchId: string) {
  const [meetings, setMeetings] = useState<MeetingSlot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMeetings = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await schedulingService.getMeetings(matchId);
      setMeetings(data);
    } catch {
      setError('Failed to load meetings');
    } finally {
      setIsLoading(false);
    }
  }, [matchId]);

  return {
    meetings,
    isLoading,
    error,
    fetchMeetings,
  };
}
