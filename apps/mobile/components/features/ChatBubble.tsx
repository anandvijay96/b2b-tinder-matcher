import { Pressable, Text, View } from 'react-native';
import { FileText, Paperclip } from 'lucide-react-native';
import type { Message } from '@/models';

export interface ChatBubbleProps {
  message: Message;
  isOwn: boolean;
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function ChatBubble({ message, isOwn }: ChatBubbleProps) {
  const isAttachment =
    message.type === 'attachment' ||
    message.type === 'capability_deck' ||
    message.type === 'rfq_template';

  return (
    <View
      className={`flex-row mb-2 px-4 ${isOwn ? 'justify-end' : 'justify-start'}`}
    >
      <View className={`max-w-[78%] ${isOwn ? 'items-end' : 'items-start'}`}>
        {isAttachment ? (
          <Pressable
            className={`flex-row items-center gap-2 rounded-2xl px-4 py-3 ${
              isOwn ? 'bg-primary rounded-tr-sm' : 'bg-bgSurface rounded-tl-sm border border-borderLight'
            }`}
          >
            {message.type === 'capability_deck' ? (
              <FileText size={16} color={isOwn ? '#fff' : '#1E3A5F'} />
            ) : (
              <Paperclip size={16} color={isOwn ? '#fff' : '#1E3A5F'} />
            )}
            <View className="flex-1">
              <Text
                className={`text-captionMedium font-semibold ${isOwn ? 'text-textInverse' : 'text-textPrimary'}`}
                numberOfLines={1}
              >
                {message.attachmentName ?? 'Attachment'}
              </Text>
              <Text
                className={`text-small mt-0.5 ${isOwn ? 'text-textInverse/70' : 'text-textMuted'}`}
              >
                {message.type === 'capability_deck'
                  ? 'Capability Deck'
                  : message.type === 'rfq_template'
                  ? 'RFQ Template'
                  : 'File'}
              </Text>
            </View>
          </Pressable>
        ) : (
          <View
            className={`rounded-2xl px-4 py-2.5 ${
              isOwn ? 'bg-primary rounded-tr-sm' : 'bg-bgSurface rounded-tl-sm border border-borderLight'
            }`}
          >
            <Text
              className={`text-body leading-5 ${isOwn ? 'text-textInverse' : 'text-textPrimary'}`}
            >
              {message.content}
            </Text>
          </View>
        )}
        <Text className="text-small text-textMuted mt-1 px-1">
          {formatTime(message.createdAt)}
        </Text>
      </View>
    </View>
  );
}

export default ChatBubble;
