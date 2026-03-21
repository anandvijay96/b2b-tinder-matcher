import { FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MessageCircle } from 'lucide-react-native';
import { Avatar } from '@/components/ui';
import { useMatches } from '@/hooks';
import type { Match } from '@/models';

function timeAgo(iso?: string): string {
  if (!iso) return '';
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'now';
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d`;
  return `${Math.floor(days / 7)}w`;
}

function ConversationRow({ match, onPress }: { match: Match; onPress: () => void }) {
  const hasUnread = (match.unreadCount ?? 0) > 0;
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center gap-3 px-5 py-3.5 active:bg-bgSurfaceSecondary"
    >
      <Avatar
        initials={match.matchedCompany.brandName.slice(0, 2).toUpperCase()}
        size="lg"
        imageUri={match.matchedCompany.logoUrl}
      />
      <View className="flex-1 gap-0.5">
        <View className="flex-row items-center justify-between">
          <Text
            className={`text-bodyMedium ${hasUnread ? 'text-textPrimary font-bold' : 'text-textPrimary font-semibold'}`}
            numberOfLines={1}
          >
            {match.matchedCompany.brandName}
          </Text>
          <Text className="text-small text-textMuted">
            {timeAgo(match.lastMessageAt)}
          </Text>
        </View>
        <View className="flex-row items-center justify-between">
          <Text
            className={`text-caption flex-1 mr-2 ${hasUnread ? 'text-textPrimary font-medium' : 'text-textMuted'}`}
            numberOfLines={1}
          >
            {match.lastMessagePreview || 'No messages yet — start the conversation!'}
          </Text>
          {hasUnread && (
            <View className="bg-accent rounded-full min-w-[20px] h-5 items-center justify-center px-1.5">
              <Text className="text-small text-textInverse font-bold">
                {match.unreadCount! > 9 ? '9+' : match.unreadCount}
              </Text>
            </View>
          )}
        </View>
        <Text className="text-small text-textMuted">
          {match.matchedCompany.industry} · {match.matchScore}% match
        </Text>
      </View>
    </Pressable>
  );
}

export default function ChatListScreen() {
  const router = useRouter();
  const { matches } = useMatches();

  const conversations = matches.filter((m) => m.status !== 'new');

  return (
    <SafeAreaView className="flex-1 bg-bgBase" edges={['top']}>
      <View className="px-5 pt-2 pb-3">
        <Text className="text-heading3 text-textPrimary font-bold">Messages</Text>
      </View>

      {conversations.length === 0 ? (
        <View className="flex-1 items-center justify-center px-8">
          <View className="w-16 h-16 rounded-full bg-primary/10 items-center justify-center mb-4">
            <MessageCircle size={28} color="#1E3A5F" />
          </View>
          <Text className="text-bodyMedium text-textPrimary font-semibold text-center">
            No conversations yet
          </Text>
          <Text className="text-body text-textSecondary mt-2 text-center">
            When you match with a business, your conversations will appear here.
          </Text>
        </View>
      ) : (
        <FlatList
          data={conversations}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ConversationRow
              match={item}
              onPress={() => router.push(`/chat/${item.id}` as never)}
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 24 }}
          ItemSeparatorComponent={() => (
            <View className="h-px bg-borderLight ml-[76px] mr-5" />
          )}
        />
      )}
    </SafeAreaView>
  );
}
