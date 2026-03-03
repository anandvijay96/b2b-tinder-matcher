/**
 * DEMO_MODE — When true, all services use local mock data instead of tRPC.
 * Set to false when real backend is connected.
 *
 * In demo mode:
 * - LinkedIn login is emulated (instant success)
 * - Email OTP uses hardcoded code: 123456
 * - Swipe candidates come from demoCandidates.ts
 * - Matches, messages, and meetings are stored in AsyncStorage
 * - No network calls are made
 */
export const DEMO_MODE = true;

export const DEMO_OTP_CODE = '123456';
