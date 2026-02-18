import type { MeetingSlot, MeetingStatus } from '@/models';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const schedulingService = {
  proposeMeeting: async (
    _matchId: string,
    _proposedBy: string,
    _slots: { startTimeUtc: string; endTimeUtc: string; timezone: string }[]
  ): Promise<MeetingSlot | null> => {
    await delay(600);
    return null;
  },

  respondToMeeting: async (
    _meetingId: string,
    _status: MeetingStatus,
    _selectedSlotId?: string
  ): Promise<boolean> => {
    await delay(400);
    return true;
  },

  getMeetings: async (_matchId: string): Promise<MeetingSlot[]> => {
    await delay(500);
    return [];
  },
};
