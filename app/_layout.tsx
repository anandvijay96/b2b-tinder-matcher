import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as Notifications from 'expo-notifications';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as ExpoSplashScreen from 'expo-splash-screen';
import { useEffect, useRef } from 'react';
import 'react-native-reanimated';
import '../global.css';

import { notificationService } from '@/services';
import { useAuthStore, useCompanyStore } from '@/stores';

export {
  ErrorBoundary
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

ExpoSplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });
  const { checkAuth } = useAuthStore();
  const { loadCompany } = useCompanyStore();
  useEffect(() => {
    notificationService.registerForPushNotifications();
  }, []);

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      ExpoSplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    checkAuth();
    loadCompany();
  }, [checkAuth, loadCompany]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const { isAuthenticated, isLoading } = useAuthStore();
  const { hasCompletedOnboarding, isLoading: companyLoading } = useCompanyStore();
  const segments = useSegments();
  const router = useRouter();
  const notificationListener = useRef<Notifications.EventSubscription | null>(null);
  const responseListener = useRef<Notifications.EventSubscription | null>(null);

  useEffect(() => {
    notificationListener.current = Notifications.addNotificationReceivedListener(
      (_notification) => {}
    );
    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const data = response.notification.request.content.data as Record<string, string>;
        if (data?.type === 'new_match' && data?.matchId) {
          router.push(`/match/${data.matchId}` as never);
        } else if (data?.type === 'new_message' && data?.matchId) {
          router.push(`/chat/${data.matchId}` as never);
        } else if (data?.type === 'meeting_proposal' && data?.matchId) {
          router.push(`/schedule/${data.matchId}` as never);
        }
      }
    );
    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, [router]);

  useEffect(() => {
    if (isLoading || companyLoading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inOnboarding = segments.join('/').includes('onboarding');

    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (isAuthenticated && !hasCompletedOnboarding && !inOnboarding) {
      router.replace('/(auth)/onboarding/step1' as never);
    } else if (isAuthenticated && hasCompletedOnboarding && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, isLoading, hasCompletedOnboarding, companyLoading, segments, router]);

  return (
    <ThemeProvider value={DefaultTheme}>
      <Stack>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
        <Stack.Screen name="edit-profile" options={{ headerShown: false }} />
        <Stack.Screen name="match/[id]" options={{ headerShown: false, animation: 'fade' }} />
        <Stack.Screen name="chat/[matchId]" options={{ headerShown: false }} />
        <Stack.Screen name="schedule/[matchId]" options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
}
