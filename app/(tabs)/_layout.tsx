import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { ComponentProps } from 'react';
import { Text, View } from 'react-native';
import { useMatchStore, useChatStore } from '@/stores';

function TabBarIcon(props: {
  name: ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={24} style={{ marginBottom: -3 }} {...props} />;
}

function UnreadBadge({ count }: { count: number }) {
  if (count === 0) return null;
  return (
    <View
      style={{
        position: 'absolute',
        top: -4,
        right: -8,
        backgroundColor: '#EF4444',
        borderRadius: 8,
        minWidth: 16,
        height: 16,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 3,
      }}
    >
      <Text style={{ color: '#fff', fontSize: 10, fontWeight: '700' }}>
        {count > 99 ? '99+' : count}
      </Text>
    </View>
  );
}

export default function TabLayout() {
  const getTotalUnread = useMatchStore((s) => s.getTotalUnread);
  const totalUnread = getTotalUnread();
  const getTotalUnreadMessages = useChatStore((s) => s.getTotalUnreadMessages);
  const totalUnreadMessages = getTotalUnreadMessages();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#1E3A5F',
        tabBarInactiveTintColor: '#94A3B8',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E2E8F0',
          paddingBottom: 4,
          height: 60,
        },
        headerStyle: {
          backgroundColor: '#FFFFFF',
        },
        headerTintColor: '#0F172A',
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Discover',
          tabBarIcon: ({ color }) => <TabBarIcon name="compass" color={color} />,
        }}
      />
      <Tabs.Screen
        name="matches"
        options={{
          title: 'Matches',
          tabBarIcon: ({ color }) => (
            <View>
              <TabBarIcon name="handshake-o" color={color} />
              <UnreadBadge count={totalUnread} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',
          tabBarIcon: ({ color }) => (
            <View>
              <TabBarIcon name="comments" color={color} />
              <UnreadBadge count={totalUnreadMessages} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <TabBarIcon name="building" color={color} />,
        }}
      />
    </Tabs>
  );
}
