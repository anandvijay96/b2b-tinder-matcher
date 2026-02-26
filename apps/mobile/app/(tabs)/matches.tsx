import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MatchCard } from '@/components/features';
import { EmptyState } from '@/components/ui';
import { useMatches } from '@/hooks';
import type { Match } from '@/models';

type HeaderItem = { type: 'header'; label: string; id: string };
type MatchItem = { type: 'match'; match: Match; id: string };
type ListItem = HeaderItem | MatchItem;

export default function MatchesScreen() {
  const router = useRouter();
  const { matches, isLoading, error, refresh } = useMatches();

  const newMatches = matches.filter((m) => m.status === 'new');
  const activeMatches = matches.filter((m) => m.status !== 'new');

  function handleMatchPress(match: Match) {
    if (match.status === 'new') {
      router.push(`/match/${match.id}` as never);
    } else {
      router.push(`/chat/${match.id}` as never);
    }
  }

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-bgBase items-center justify-center" edges={['top']}>
        <ActivityIndicator size="large" color="#1E3A5F" />
        <Text className="text-body text-textSecondary mt-4">Loading matches…</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-bgBase" edges={['top']}>
        <EmptyState
          title="Couldn't load matches"
          subtitle={error}
          actionLabel="Try Again"
          onAction={refresh}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-bgBase" edges={['top']}>
      <View className="px-5 pt-2 pb-3">
        <Text className="text-heading3 text-textPrimary font-bold">Matches</Text>
      </View>

      {matches.length === 0 ? (
        <EmptyState
          title="No matches yet"
          subtitle="When both businesses express interest, a match appears here."
        />
      ) : (
        <FlatList<ListItem>
          data={[
            ...(newMatches.length > 0
              ? [{ type: 'header' as const, label: `New (${newMatches.length})`, id: 'header-new' }]
              : []),
            ...newMatches.map((m): MatchItem => ({ type: 'match', match: m, id: m.id })),
            ...(activeMatches.length > 0
              ? [{ type: 'header' as const, label: 'In progress', id: 'header-active' }]
              : []),
            ...activeMatches.map((m): MatchItem => ({ type: 'match', match: m, id: m.id })),
          ]}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 24 }}
          renderItem={({ item }) => {
            if (item.type === 'header') {
              return (
                <View className="px-5 pt-4 pb-2">
                  <Text className="text-captionMedium text-textMuted uppercase tracking-wider font-semibold">
                    {item.label}
                  </Text>
                </View>
              );
            }
            return (
              <MatchCard
                match={item.match}
                onPress={() => handleMatchPress(item.match)}
              />
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}
