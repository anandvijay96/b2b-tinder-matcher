export interface MeetingSlot {
  id: string;
  matchId: string;
  proposedBy: string;
  slots: ProposedSlot[];
  selectedSlotId?: string;
  status: MeetingStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProposedSlot {
  id: string;
  startTimeUtc: string;
  endTimeUtc: string;
  timezone: string;
}

export type MeetingStatus =
  | 'proposed'
  | 'accepted'
  | 'rejected'
  | 'cancelled'
  | 'completed';
