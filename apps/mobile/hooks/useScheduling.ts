import { schedulingService } from '@/services';
import type { MeetingSlot, ProposedSlot } from '@/models';
import { useCallback, useEffect, useRef, useState } from 'react';

const MY_USER_ID = 'user_me';

export function useScheduling(matchId: string) {
  const [meetings, setMeetings] = useState<MeetingSlot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasFetched = useRef(false);

  const fetchMeetings = useCallback(async () => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    setIsLoading(true);
    setError(null);
    try {
      const data = await schedulingService.getMeetings(matchId);
      setMeetings(data);
    } catch {
      setError('Failed to load meetings.');
    } finally {
      setIsLoading(false);
    }
  }, [matchId]);

  useEffect(() => {
    fetchMeetings();
  }, [fetchMeetings]);

  const proposeMeeting = useCallback(
    async (
      slots: Pick<ProposedSlot, 'startTimeUtc' | 'endTimeUtc' | 'timezone'>[]
    ): Promise<MeetingSlot | null> => {
      setIsSubmitting(true);
      setError(null);
      try {
        const meeting = await schedulingService.proposeMeeting(
          matchId,
          MY_USER_ID,
          slots
        );
        setMeetings((prev) => [meeting, ...prev]);
        return meeting;
      } catch {
        setError('Failed to propose meeting.');
        return null;
      } finally {
        setIsSubmitting(false);
      }
    },
    [matchId]
  );

  const acceptSlot = useCallback(
    async (meetingId: string, slotId: string): Promise<boolean> => {
      setIsSubmitting(true);
      try {
        const ok = await schedulingService.respondToMeeting(
          meetingId,
          'accepted',
          slotId
        );
        if (ok) {
          setMeetings((prev) =>
            prev.map((m) =>
              m.id === meetingId
                ? { ...m, status: 'accepted', selectedSlotId: slotId }
                : m
            )
          );
        }
        return ok;
      } catch {
        setError('Failed to respond to meeting.');
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    []
  );

  const activeMeeting = meetings.find(
    (m) => m.status === 'proposed' || m.status === 'accepted'
  ) ?? null;

  return {
    meetings,
    activeMeeting,
    isLoading,
    isSubmitting,
    error,
    proposeMeeting,
    acceptSlot,
    refresh: fetchMeetings,
  };
}
