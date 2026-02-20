import type { Message, MessageType } from '@/models';
import mockMessages from './mockData/messages.json';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const messagesData = mockMessages as Record<string, Message[]>;

export const chatService = {
  getMessages: async (matchId: string): Promise<Message[]> => {
    await delay(400);
    return messagesData[matchId] ?? [];
  },

  sendMessage: async (
    matchId: string,
    senderId: string,
    senderCompanyId: string,
    content: string,
    type: MessageType = 'text'
  ): Promise<Message> => {
    await delay(250);
    const message: Message = {
      id: `msg_${Date.now()}`,
      matchId,
      senderId,
      senderCompanyId,
      content,
      type,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    return message;
  },

  markAsRead: async (_matchId: string, _userId: string): Promise<boolean> => {
    await delay(150);
    return true;
  },
};
