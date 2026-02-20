export interface Message {
  id: string;
  matchId: string;
  senderId: string;
  senderCompanyId: string;
  content: string;
  type: MessageType;
  attachmentUrl?: string;
  attachmentName?: string;
  isRead: boolean;
  createdAt: string;
}

export type MessageType =
  | 'text'
  | 'attachment'
  | 'rfq_template'
  | 'capability_deck'
  | 'system';
