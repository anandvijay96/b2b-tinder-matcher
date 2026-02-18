import type { Message } from '@/models';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const chatService = {
  getMessages: async (_matchId: string): Promise<Message[]> => {
    await delay(500);
    return [];
  },

  sendMessage: async (
    _matchId: string,
    _senderId: string,
    _senderCompanyId: string,
    _content: string
  ): Promise<Message | null> => {
    await delay(300);
    return null;
  },

  markAsRead: async (_matchId: string, _userId: string): Promise<boolean> => {
    await delay(200);
    return true;
  },
};
