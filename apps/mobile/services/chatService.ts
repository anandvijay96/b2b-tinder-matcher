import type { Message, MessageType } from '@/models';
import { trpc } from './trpcClient';
import { toIso } from './companyService';

function mapDbMessageToMobile(db: Record<string, unknown>): Message {
  const messageType = (db.messageType as string) ?? 'text';
  // Map API message types to mobile types
  const typeMap: Record<string, MessageType> = {
    text: 'text',
    rfq_template: 'rfq_template',
    capability_deck: 'capability_deck',
    meeting_proposal: 'system',
    meeting_accepted: 'system',
    meeting_declined: 'system',
    attachment: 'attachment',
  };

  return {
    id: db.id as string,
    matchId: db.matchId as string,
    senderId: db.senderId as string,
    senderCompanyId: '', // API doesn't track this separately; resolved client-side
    content: db.content as string,
    type: typeMap[messageType] ?? 'text',
    isRead: !!db.readAt,
    createdAt: toIso(db.createdAt as Date | string | number),
  };
}

export const chatService = {
  getMessages: async (matchId: string): Promise<Message[]> => {
    try {
      const results = await trpc.message.listByMatch.query({ matchId });
      return results.map((r: unknown) =>
        mapDbMessageToMobile(r as Record<string, unknown>),
      );
    } catch {
      return [];
    }
  },

  sendMessage: async (
    matchId: string,
    _senderId: string,
    _senderCompanyId: string,
    content: string,
    type: MessageType = 'text',
  ): Promise<Message> => {
    // Map mobile MessageType to API messageType
    const apiTypeMap: Record<string, string> = {
      text: 'text',
      rfq_template: 'rfq_template',
      capability_deck: 'capability_deck',
      system: 'text',
      attachment: 'text',
    };

    const result = await trpc.message.send.mutate({
      matchId,
      content,
      messageType: (apiTypeMap[type] ?? 'text') as 'text',
    });
    return mapDbMessageToMobile(result as unknown as Record<string, unknown>);
  },

  markAsRead: async (matchId: string, _userId: string): Promise<boolean> => {
    try {
      // Fetch unread messages for the match and mark them all as read
      const messages = await trpc.message.listByMatch.query({ matchId });
      const unreadIds = messages
        .filter((m: unknown) => !(m as Record<string, unknown>).readAt)
        .map((m: unknown) => (m as Record<string, unknown>).id as string);

      if (unreadIds.length > 0) {
        await trpc.message.markRead.mutate({ messageIds: unreadIds });
      }
      return true;
    } catch {
      return false;
    }
  },
};
