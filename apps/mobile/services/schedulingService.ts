import type { MeetingSlot, MeetingStatus, ProposedSlot } from '@/models';
import { trpc } from './trpcClient';
import { toIso } from './companyService';

function parseSlotsToProposed(raw: unknown, durationMinutes: number, timezone: string): ProposedSlot[] {
  let arr: string[] = [];
  if (typeof raw === 'string') {
    try {
      arr = JSON.parse(raw);
    } catch {
      arr = [];
    }
  } else if (Array.isArray(raw)) {
    arr = raw as string[];
  }

  return arr.map((startIso, i) => {
    const start = new Date(startIso);
    const end = new Date(start.getTime() + durationMinutes * 60 * 1000);
    return {
      id: `slot_${i}`,
      startTimeUtc: start.toISOString(),
      endTimeUtc: end.toISOString(),
      timezone,
    };
  });
}

function mapDbMeetingToMobile(db: Record<string, unknown>): MeetingSlot {
  const durationMinutes = (db.durationMinutes as number) ?? 30;
  const timezone = (db.timezone as string) ?? 'UTC';
  const statusMap: Record<string, MeetingStatus> = {
    pending: 'proposed',
    accepted: 'accepted',
    declined: 'rejected',
    cancelled: 'cancelled',
  };

  return {
    id: db.id as string,
    matchId: db.matchId as string,
    proposedBy: db.proposedBy as string,
    slots: parseSlotsToProposed(db.slots, durationMinutes, timezone),
    selectedSlotId: db.selectedSlot ? 'slot_0' : undefined,
    status: statusMap[(db.status as string)] ?? 'proposed',
    notes: db.notes as string | undefined,
    createdAt: toIso(db.createdAt as Date | string | number),
    updatedAt: toIso(db.updatedAt as Date | string | number),
  };
}

export const schedulingService = {
  getMeetings: async (matchId: string): Promise<MeetingSlot[]> => {
    try {
      const results = await trpc.scheduling.listByMatch.query({ matchId });
      return results.map((r: unknown) =>
        mapDbMeetingToMobile(r as Record<string, unknown>),
      );
    } catch {
      return [];
    }
  },

  proposeMeeting: async (
    matchId: string,
    _proposedBy: string,
    slots: { startTimeUtc: string; endTimeUtc: string; timezone: string }[],
  ): Promise<MeetingSlot> => {
    // API expects slots as ISO datetime strings, timezone, and optional duration
    const timezone = slots[0]?.timezone ?? 'UTC';
    const slotTimes = slots.map((s) => s.startTimeUtc);
    // Calculate duration from first slot
    const durationMinutes = slots[0]
      ? Math.round((new Date(slots[0].endTimeUtc).getTime() - new Date(slots[0].startTimeUtc).getTime()) / 60000)
      : 30;

    const result = await trpc.scheduling.propose.mutate({
      matchId,
      slots: slotTimes,
      durationMinutes,
      timezone,
    });
    return mapDbMeetingToMobile(result as unknown as Record<string, unknown>);
  },

  respondToMeeting: async (
    meetingId: string,
    status: MeetingStatus,
    selectedSlotId?: string,
  ): Promise<boolean> => {
    try {
      const action = status === 'accepted' ? 'accept' : 'decline';
      await trpc.scheduling.respond.mutate({
        meetingSlotId: meetingId,
        action,
        selectedSlot: selectedSlotId,
      });
      return true;
    } catch {
      return false;
    }
  },
};
