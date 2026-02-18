import { useChatStore } from '@/stores';

export function useChat(matchId: string) {
  const { isLoading, error, setMessages, addMessage, getMessages, markAsRead } =
    useChatStore();

  return {
    messages: getMessages(matchId),
    isLoading,
    error,
    setMessages: (messages: Parameters<typeof setMessages>[1]) =>
      setMessages(matchId, messages),
    addMessage: (message: Parameters<typeof addMessage>[1]) =>
      addMessage(matchId, message),
    markAsRead: () => markAsRead(matchId),
  };
}
