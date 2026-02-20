import { Pressable, Text, View } from 'react-native';
import { CheckCircle, MessageCircle } from 'lucide-react-native';
import { Avatar, Badge } from '@/components/ui';
import type { Match } from '@/models';

export interface MatchCardProps {
  match: Match;
  onPress: (match: Match) => void;
}

function formatRelativeTime(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

const STATUS_LABEL: Record<string, string> = {
  new: 'New match',
  chatting: 'Chatting',
  meeting_scheduled: 'Meeting set',
  completed: 'Completed',
  declined: 'Declined',
};

const STATUS_COLOR: Record<string, string> = {
  new: '#22C55E',
  chatting: '#1E3A5F',
  meeting_scheduled: '#0D9488',
  completed: '#64748B',
  declined: '#EF4444',
};

export function MatchCard({ match, onPress }: MatchCardProps) {
  const { matchedCompany, matchScore, status, lastMessagePreview, lastMessageAt, unreadCount, createdAt } = match;
  const statusColor = STATUS_COLOR[status] ?? '#64748B';
  const timeStr = lastMessageAt
    ? formatRelativeTime(lastMessageAt)
    : formatRelativeTime(createdAt);

  return (
    <Pressable
      onPress={() => onPress(match)}
      className="flex-row items-center px-4 py-3.5 bg-bgSurface border-b border-borderLight active:bg-bgSurfaceSecondary"
    >
      {/* Avatar */}
      <View className="relative">
        <Avatar
          initials={matchedCompany.brandName.slice(0, 2).toUpperCase()}
          size="lg"
          imageUri={matchedCompany.logoUrl}
        />
        {unreadCount > 0 && (
          <View className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary items-center justify-center">
            <Text className="text-small text-textInverse font-bold">
              {unreadCount > 9 ? '9+' : unreadCount}
            </Text>
          </View>
        )}
      </View>

      {/* Content */}
      <View className="flex-1 ml-3 gap-0.5">
        <View className="flex-row items-center justify-between">
          <Text
            className="text-bodyMedium text-textPrimary font-semibold flex-1"
            numberOfLines={1}
          >
            {matchedCompany.brandName}
          </Text>
          <Text className="text-small text-textMuted ml-2">{timeStr}</Text>
        </View>

        <View className="flex-row items-center gap-1.5">
          <Badge variant="neutral" style={{ paddingHorizontal: 6, paddingVertical: 1 }}>
            {matchedCompany.industry}
          </Badge>
          {matchedCompany.verificationBadges.length > 0 && (
            <CheckCircle size={11} color="#0D9488" />
          )}
          <Text className="text-small font-semibold" style={{ color: statusColor }}>
            {STATUS_LABEL[status]}
          </Text>
        </View>

        {lastMessagePreview ? (
          <View className="flex-row items-center gap-1 mt-0.5">
            <MessageCircle size={11} color="#94A3B8" />
            <Text
              className="text-caption text-textSecondary flex-1"
              numberOfLines={1}
            >
              {lastMessagePreview}
            </Text>
          </View>
        ) : (
          <Text className="text-caption text-textMuted mt-0.5" numberOfLines={1}>
            Match score: {matchScore}%
          </Text>
        )}
      </View>
    </Pressable>
  );
}

export default MatchCard;
