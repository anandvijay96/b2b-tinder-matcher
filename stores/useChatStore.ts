import type { Message } from '@/models';
import { create } from 'zustand';

const MY_USER_ID = 'user_me';

interface ChatState {
  messages: Record<string, Message[]>;
  isLoading: boolean;
  error: string | null;
  setMessages: (matchId: string, messages: Message[]) => void;
  addMessage: (matchId: string, message: Message) => void;
  getMessages: (matchId: string) => Message[];
  markAsRead: (matchId: string) => void;
  getTotalUnreadMessages: () => number;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: {},
  isLoading: false,
  error: null,

  setMessages: (matchId: string, messages: Message[]) =>
    set((state) => ({
      messages: { ...state.messages, [matchId]: messages },
    })),

  addMessage: (matchId: string, message: Message) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [matchId]: [...(state.messages[matchId] || []), message],
      },
    })),

  getMessages: (matchId: string) => {
    return get().messages[matchId] || [];
  },

  markAsRead: (matchId: string) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [matchId]: (state.messages[matchId] || []).map((m) => ({
          ...m,
          isRead: true,
        })),
      },
    })),

  getTotalUnreadMessages: () => {
    const { messages } = get();
    return Object.values(messages).reduce(
      (total, msgs) =>
        total +
        msgs.filter((m) => !m.isRead && m.senderId !== MY_USER_ID).length,
      0
    );
  },
}));

export default useChatStore;
