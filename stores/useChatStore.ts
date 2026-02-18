import type { Message } from '@/models';
import { create } from 'zustand';

interface ChatState {
  messages: Record<string, Message[]>;
  isLoading: boolean;
  error: string | null;
  setMessages: (matchId: string, messages: Message[]) => void;
  addMessage: (matchId: string, message: Message) => void;
  getMessages: (matchId: string) => Message[];
  markAsRead: (matchId: string) => void;
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
}));

export default useChatStore;
