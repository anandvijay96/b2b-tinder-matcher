import { useCallback, useEffect, useRef, useState } from 'react';
import { useChatStore } from '@/stores';
import { useMatchStore } from '@/stores';
import { chatService } from '@/services';

const MY_USER_ID = 'user_me';
const MY_COMPANY_ID = 'my_company';

export function useChat(matchId: string) {
  const { setMessages, addMessage, getMessages, markAsRead } = useChatStore();
  const markMatchRead = useMatchStore((s) => s.markMatchRead);

  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasFetched = useRef(false);

  const loadMessages = useCallback(async () => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    setIsLoading(true);
    setError(null);
    try {
      const data = await chatService.getMessages(matchId);
      setMessages(matchId, data);
      await chatService.markAsRead(matchId, MY_USER_ID);
      markAsRead(matchId);
      markMatchRead(matchId);
    } catch {
      setError('Failed to load messages.');
    } finally {
      setIsLoading(false);
    }
  }, [matchId, setMessages, markAsRead, markMatchRead]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) return;
      setIsSending(true);
      try {
        const message = await chatService.sendMessage(
          matchId,
          MY_USER_ID,
          MY_COMPANY_ID,
          content.trim()
        );
        addMessage(matchId, message);
      } catch {
        setError('Failed to send message.');
      } finally {
        setIsSending(false);
      }
    },
    [matchId, addMessage]
  );

  return {
    messages: getMessages(matchId),
    isLoading,
    isSending,
    error,
    sendMessage,
    myUserId: MY_USER_ID,
  };
}
