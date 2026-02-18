import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DiscoverScreen() {
  return (
    <SafeAreaView className="flex-1 bg-bgBase" edges={['top']}>
      <View className="flex-1 items-center justify-center px-8">
        <Text className="text-heading2 text-textPrimary font-semibold text-center">
          Swipe Deck
        </Text>
        <Text className="text-body text-textSecondary mt-2 text-center">
          Discover relevant business partners. Swipe right to express interest.
        </Text>
        <View className="mt-8 bg-bgSurface rounded-card p-8 w-full items-center shadow-card">
          <Text className="text-caption text-textMuted">
            Card stack will appear here
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
