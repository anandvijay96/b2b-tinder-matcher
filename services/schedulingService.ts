import type { MeetingSlot, MeetingStatus, ProposedSlot } from '@/models';
import mockMeetings from './mockData/meetings.json';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const meetingsData = mockMeetings as Record<string, MeetingSlot[]>;

export const schedulingService = {
  getMeetings: async (matchId: string): Promise<MeetingSlot[]> => {
    await delay(400);
    return meetingsData[matchId] ?? [];
  },

  proposeMeeting: async (
    matchId: string,
    proposedBy: string,
    slots: { startTimeUtc: string; endTimeUtc: string; timezone: string }[]
  ): Promise<MeetingSlot> => {
    await delay(500);
    const meeting: MeetingSlot = {
      id: `meeting_${Date.now()}`,
      matchId,
      proposedBy,
      slots: slots.map((s, i): ProposedSlot => ({
        id: `slot_${Date.now()}_${i}`,
        ...s,
      })),
      status: 'proposed',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return meeting;
  },

  respondToMeeting: async (
    _meetingId: string,
    _status: MeetingStatus,
    _selectedSlotId?: string
  ): Promise<boolean> => {
    await delay(350);
    return true;
  },
};
