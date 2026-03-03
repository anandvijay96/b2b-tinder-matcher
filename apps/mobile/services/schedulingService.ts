import type { MeetingSlot, MeetingStatus, ProposedSlot } from '@/models';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DEMO_MODE } from '@/constants';
import { trpc } from './trpcClient';
import { toIso } from './companyService';

const DEMO_MEETINGS_PREFIX = '@nmq_demo_meetings_';

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

async function loadDemoMeetings(matchId: string): Promise<MeetingSlot[]> {
  try {
    const raw = await AsyncStorage.getItem(`${DEMO_MEETINGS_PREFIX}${matchId}`);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return [];
}

async function saveDemoMeetings(matchId: string, meetings: MeetingSlot[]): Promise<void> {
  try {
    await AsyncStorage.setItem(`${DEMO_MEETINGS_PREFIX}${matchId}`, JSON.stringify(meetings));
  } catch { /* ignore */ }
}

export const schedulingService = {
  getMeetings: async (matchId: string): Promise<MeetingSlot[]> => {
    if (DEMO_MODE) {
      return loadDemoMeetings(matchId);
    }
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
    proposedBy: string,
    slots: { startTimeUtc: string; endTimeUtc: string; timezone: string }[],
  ): Promise<MeetingSlot> => {
    if (DEMO_MODE) {
      await new Promise((r) => setTimeout(r, 300));
      const timezone = slots[0]?.timezone ?? 'UTC';
      const durationMinutes = slots[0]
        ? Math.round((new Date(slots[0].endTimeUtc).getTime() - new Date(slots[0].startTimeUtc).getTime()) / 60000)
        : 30;
      const newMeeting: MeetingSlot = {
        id: `demo-meeting-${Date.now()}`,
        matchId,
        proposedBy,
        slots: slots.map((s, i) => ({
          id: `slot_${i}`,
          startTimeUtc: s.startTimeUtc,
          endTimeUtc: s.endTimeUtc,
          timezone: s.timezone,
        })),
        status: 'proposed',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const existing = await loadDemoMeetings(matchId);
      existing.push(newMeeting);
      await saveDemoMeetings(matchId, existing);
      return newMeeting;
    }
    const timezone = slots[0]?.timezone ?? 'UTC';
    const slotTimes = slots.map((s) => s.startTimeUtc);
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
    if (DEMO_MODE) {
      // Find meeting across all match keys and update
      // For demo, just return success — the UI handles the visual state
      return true;
    }
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
