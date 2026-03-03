import type { Message, MessageType } from '@/models';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DEMO_MODE } from '@/constants';
import { trpc } from './trpcClient';
import { toIso } from './companyService';
import { DEMO_MESSAGES } from './mockData/demoCandidates';

const DEMO_CHAT_PREFIX = '@nmq_demo_chat_';

function mapDbMessageToMobile(db: Record<string, unknown>): Message {
  const messageType = (db.messageType as string) ?? 'text';
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
    senderCompanyId: '',
    content: db.content as string,
    type: typeMap[messageType] ?? 'text',
    isRead: !!db.readAt,
    createdAt: toIso(db.createdAt as Date | string | number),
  };
}

async function loadDemoMessages(matchId: string): Promise<Message[]> {
  try {
    const raw = await AsyncStorage.getItem(`${DEMO_CHAT_PREFIX}${matchId}`);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return [];
}

async function saveDemoMessages(matchId: string, messages: Message[]): Promise<void> {
  try {
    await AsyncStorage.setItem(`${DEMO_CHAT_PREFIX}${matchId}`, JSON.stringify(messages));
  } catch { /* ignore */ }
}

export const chatService = {
  getMessages: async (matchId: string): Promise<Message[]> => {
    if (DEMO_MODE) {
      // Merge static demo messages with any user-sent messages from AsyncStorage
      const staticMsgs = DEMO_MESSAGES[matchId] ?? [];
      const savedMsgs = await loadDemoMessages(matchId);
      // Dedupe by id
      const ids = new Set(savedMsgs.map((m) => m.id));
      return [...staticMsgs.filter((m) => !ids.has(m.id)), ...savedMsgs]
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    }
    try {
      const results = await trpc.message.listByMatch.query({ matchId });
      return results.map((r: unknown) =>
        mapDbMessageToMobile(r as Record<string, unknown>),
      );
    } catch {
      return DEMO_MESSAGES[matchId] ?? [];
    }
  },

  sendMessage: async (
    matchId: string,
    senderId: string,
    senderCompanyId: string,
    content: string,
    type: MessageType = 'text',
  ): Promise<Message> => {
    if (DEMO_MODE) {
      await new Promise((r) => setTimeout(r, 200));
      const newMsg: Message = {
        id: `demo-msg-${Date.now()}`,
        matchId,
        senderId,
        senderCompanyId,
        content,
        type,
        isRead: true,
        createdAt: new Date().toISOString(),
      };
      // Persist to AsyncStorage
      const existing = await loadDemoMessages(matchId);
      existing.push(newMsg);
      await saveDemoMessages(matchId, existing);
      return newMsg;
    }
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
    if (DEMO_MODE) return true;
    try {
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
