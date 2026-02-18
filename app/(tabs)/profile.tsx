import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  return (
    <SafeAreaView className="flex-1 bg-bgBase" edges={['top']}>
      <View className="flex-1 items-center justify-center px-8">
        <Text className="text-heading2 text-textPrimary font-semibold text-center">
          Company Profile
        </Text>
        <Text className="text-body text-textSecondary mt-2 text-center">
          Manage your business profile, offerings, and needs.
        </Text>
      </View>
    </SafeAreaView>
  );
}
