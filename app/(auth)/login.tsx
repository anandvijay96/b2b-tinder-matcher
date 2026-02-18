import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
  return (
    <SafeAreaView className="flex-1 bg-primary">
      <StatusBar style="light" />
      <View className="flex-1 items-center justify-center px-8">
        <View className="mb-12 items-center">
          <Text className="text-4xl font-bold text-textInverse">NMQ</Text>
          <Text className="text-lg text-textInverse/80 mt-1">B2B Match</Text>
          <Text className="text-sm text-textInverse/60 mt-4 text-center">
            Discover relevant business partners faster with AI-driven matching
          </Text>
        </View>

        <View className="w-full gap-4">
          <View className="bg-white rounded-button py-4 px-6 items-center">
            <Text className="text-bodyMedium text-primary">
              Continue with LinkedIn
            </Text>
          </View>

          <View className="bg-white/10 rounded-button py-4 px-6 items-center border border-white/20">
            <Text className="text-bodyMedium text-textInverse">
              Sign in with Email
            </Text>
          </View>
        </View>

        <Text className="text-small text-textInverse/50 mt-8 text-center px-4">
          By continuing, you agree to NMQ's Terms of Service and Privacy Policy
        </Text>
      </View>
    </SafeAreaView>
  );
}
