import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Send } from 'lucide-react-native';
import { useState, useRef } from 'react';
import { ChatBubble } from '@/components/features';
import { useChat } from '@/hooks';
import { useMatchStore } from '@/stores';
import type { Message } from '@/models';

export default function ChatScreen() {
  const { matchId } = useLocalSearchParams<{ matchId: string }>();
  const router = useRouter();
  const flatListRef = useRef<FlatList<Message>>(null);

  const match = useMatchStore((s) =>
    s.matches.find((m) => m.id === matchId)
  );

  const { messages, isLoading, isSending, sendMessage, myUserId } = useChat(
    matchId ?? ''
  );

  const [draft, setDraft] = useState('');

  async function handleSend() {
    if (!draft.trim() || isSending) return;
    const text = draft;
    setDraft('');
    await sendMessage(text);
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 50);
  }

  const companyName = match?.matchedCompany.brandName ?? 'Chat';

  return (
    <SafeAreaView className="flex-1 bg-bgBase" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center gap-3 px-4 py-3 bg-bgSurface border-b border-borderLight">
        <Pressable
          onPress={() => router.back()}
          className="w-9 h-9 items-center justify-center rounded-full"
          hitSlop={8}
        >
          <ArrowLeft size={22} color="#0F172A" />
        </Pressable>
        <View className="flex-1">
          <Text className="text-bodyMedium text-textPrimary font-semibold" numberOfLines={1}>
            {companyName}
          </Text>
          {match && (
            <Text className="text-small text-textMuted">
              {match.matchScore}% match · {match.matchedCompany.industry}
            </Text>
          )}
        </View>
      </View>

      {/* Why this match pinned card */}
      {match && match.matchReasons.length > 0 && (
        <View className="mx-4 mt-3 mb-1 bg-accent-light rounded-xl px-4 py-3 flex-row items-start gap-2">
          <Text className="text-caption text-accent font-bold mt-0.5">⚡</Text>
          <View className="flex-1">
            <Text className="text-captionMedium text-accent-dark font-semibold mb-0.5">
              Why you matched
            </Text>
            <Text className="text-caption text-accent-dark/80" numberOfLines={2}>
              {match.matchReasons
                .slice(0, 2)
                .map((r) => r.label)
                .join(' · ')}
            </Text>
          </View>
        </View>
      )}

      {/* Messages */}
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#1E3A5F" />
          </View>
        ) : messages.length === 0 ? (
          <View className="flex-1 items-center justify-center px-8">
            <Text className="text-heading3 text-center mb-2">👋</Text>
            <Text className="text-bodyMedium text-textPrimary font-semibold text-center">
              Start the conversation
            </Text>
            <Text className="text-body text-textSecondary text-center mt-1">
              Introduce your company or ask a question.
            </Text>
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ChatBubble message={item} isOwn={item.senderId === myUserId} />
            )}
            contentContainerStyle={{ paddingVertical: 12 }}
            onContentSizeChange={() =>
              flatListRef.current?.scrollToEnd({ animated: false })
            }
            showsVerticalScrollIndicator={false}
          />
        )}

        {/* Input bar */}
        <View className="flex-row items-end gap-2 px-4 py-3 bg-bgSurface border-t border-borderLight">
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder="Type a message…"
            placeholderTextColor="#94A3B8"
            multiline
            maxLength={2000}
            style={{
              flex: 1,
              minHeight: 40,
              maxHeight: 120,
              backgroundColor: '#F8FAFC',
              borderRadius: 20,
              paddingHorizontal: 16,
              paddingTop: 10,
              paddingBottom: 10,
              fontSize: 15,
              color: '#0F172A',
              borderWidth: 1,
              borderColor: '#E2E8F0',
            }}
            onSubmitEditing={handleSend}
            blurOnSubmit={false}
          />
          <Pressable
            onPress={handleSend}
            disabled={!draft.trim() || isSending}
            className="w-10 h-10 rounded-full bg-primary items-center justify-center"
            style={{ opacity: !draft.trim() || isSending ? 0.4 : 1 }}
          >
            <Send size={18} color="#fff" />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
