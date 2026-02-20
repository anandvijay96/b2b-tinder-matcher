import { Link, Stack } from 'expo-router';
import { Text, View } from 'react-native';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View className="flex-1 items-center justify-center bg-bgBase p-5">
        <Text className="text-heading2 text-textPrimary font-semibold">
          Page not found
        </Text>
        <Text className="text-body text-textSecondary mt-2 text-center">
          The screen you're looking for doesn't exist.
        </Text>
        <Link href="/" className="mt-6">
          <Text className="text-bodyMedium text-primary">Go to home</Text>
        </Link>
      </View>
    </>
  );
}
