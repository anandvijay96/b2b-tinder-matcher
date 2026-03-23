import { FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Bell, CheckCheck, Handshake, MessageCircle, Calendar, Eye, ShieldCheck, BarChart2 } from 'lucide-react-native';
import { useNotificationStore } from '@/stores';
import type { AppNotification, NotificationType } from '@/services/mockData/demoNotifications';

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return 'yesterday';
  if (days < 7) return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
}

const TYPE_CONFIG: Record<NotificationType, { icon: React.ComponentType<{ size: number; color: string }>; color: string; bg: string }> = {
  new_match:           { icon: Handshake,    color: '#22C55E', bg: '#F0FDF4' },
  new_message:         { icon: MessageCircle, color: '#1E3A5F', bg: '#EFF6FF' },
  meeting_proposal:    { icon: Calendar,      color: '#F59E0B', bg: '#FFFBEB' },
  meeting_accepted:    { icon: Calendar,      color: '#0D9488', bg: '#F0FDFA' },
  profile_view:        { icon: Eye,           color: '#7C3AED', bg: '#FDF4FF' },
  verification_update: { icon: ShieldCheck,   color: '#0D9488', bg: '#F0FDFA' },
  weekly_digest:       { icon: BarChart2,     color: '#F59E0B', bg: '#FFFBEB' },
};

function NotificationRow({ notif, onPress }: { notif: AppNotification; onPress: () => void }) {
  const config = TYPE_CONFIG[notif.type];
  const IconComponent = config.icon;

  return (
    <Pressable
      onPress={onPress}
      className={`flex-row items-start gap-3 px-5 py-4 active:bg-bgSurfaceSecondary ${!notif.isRead ? 'bg-primary/[0.03]' : ''}`}
    >
      {/* Icon circle */}
      <View
        className="w-10 h-10 rounded-full items-center justify-center flex-shrink-0 mt-0.5"
        style={{ backgroundColor: config.bg }}
      >
        <IconComponent size={18} color={config.color} />
      </View>

      {/* Content */}
      <View className="flex-1 gap-0.5">
        <View className="flex-row items-start justify-between gap-2">
          <Text
            className={`flex-1 text-captionMedium ${notif.isRead ? 'text-textSecondary' : 'text-textPrimary font-semibold'}`}
            numberOfLines={1}
          >
            {notif.title}
          </Text>
          <Text className="text-small text-textMuted flex-shrink-0">{timeAgo(notif.createdAt)}</Text>
        </View>
        <Text className={`text-caption ${notif.isRead ? 'text-textMuted' : 'text-textSecondary'}`} numberOfLines={2}>
          {notif.body}
        </Text>
      </View>

      {/* Unread dot */}
      {!notif.isRead && (
        <View className="w-2 h-2 rounded-full bg-accent mt-1.5 flex-shrink-0" />
      )}
    </Pressable>
  );
}

export default function NotificationsScreen() {
  const router = useRouter();
  const { notifications, markAsRead, markAllAsRead, getUnreadCount } = useNotificationStore();
  const unreadCount = getUnreadCount();

  function handlePress(notif: AppNotification) {
    markAsRead(notif.id);
    if (notif.actionRoute) {
      router.push(notif.actionRoute as never);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-bgBase" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 pt-2 pb-3">
        <View className="flex-row items-center gap-2">
          <Text className="text-heading3 text-textPrimary font-bold">Notifications</Text>
          {unreadCount > 0 && (
            <View className="bg-accent rounded-full min-w-[20px] h-5 items-center justify-center px-1.5">
              <Text className="text-small text-textInverse font-bold">{unreadCount}</Text>
            </View>
          )}
        </View>
        {unreadCount > 0 && (
          <Pressable
            onPress={markAllAsRead}
            className="flex-row items-center gap-1.5 py-1.5 px-3 bg-primary/10 rounded-pill"
          >
            <CheckCheck size={14} color="#1E3A5F" />
            <Text className="text-small text-primary font-semibold">Mark all read</Text>
          </Pressable>
        )}
      </View>

      {notifications.length === 0 ? (
        <View className="flex-1 items-center justify-center px-8">
          <View className="w-16 h-16 rounded-full bg-primary/10 items-center justify-center mb-4">
            <Bell size={28} color="#1E3A5F" />
          </View>
          <Text className="text-bodyMedium text-textPrimary font-semibold text-center">
            All caught up
          </Text>
          <Text className="text-body text-textSecondary mt-2 text-center">
            New matches, messages, and meeting updates will appear here.
          </Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <NotificationRow notif={item} onPress={() => handlePress(item)} />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 24 }}
          ItemSeparatorComponent={() => (
            <View className="h-px bg-borderLight mx-5" />
          )}
        />
      )}
    </SafeAreaView>
  );
}
