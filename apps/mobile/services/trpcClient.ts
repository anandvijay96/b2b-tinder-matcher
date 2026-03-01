import { createTRPCClient, httpBatchLink } from '@trpc/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { AppRouter } from '@api/routers';

const SESSION_TOKEN_KEY = 'nmq_session_token';
const API_TIMEOUT_MS = 4000;

function getApiUrl(): string {
  // Android emulator uses 10.0.2.2 to reach host machine's localhost
  // iOS simulator and web can use localhost directly
  // For physical devices, replace with your machine's LAN IP or production URL
  if (__DEV__) {
    return 'http://10.0.2.2:3000';
  }
  return process.env.EXPO_PUBLIC_API_URL ?? 'https://api.nmqmatch.com';
}

export const trpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${getApiUrl()}/trpc`,
      async headers() {
        const token = await AsyncStorage.getItem(SESSION_TOKEN_KEY);
        return token ? { authorization: `Bearer ${token}` } : {};
      },
      fetch(url, options) {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), API_TIMEOUT_MS);
        return globalThis.fetch(url, {
          ...options,
          signal: controller.signal,
        }).finally(() => clearTimeout(timeout));
      },
    }),
  ],
});

export async function setSessionToken(token: string): Promise<void> {
  await AsyncStorage.setItem(SESSION_TOKEN_KEY, token);
}

export async function clearSessionToken(): Promise<void> {
  await AsyncStorage.removeItem(SESSION_TOKEN_KEY);
}

export async function getSessionToken(): Promise<string | null> {
  return AsyncStorage.getItem(SESSION_TOKEN_KEY);
}
