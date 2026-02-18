export interface NotificationData {
  type: 'new_match' | 'new_message' | 'meeting_proposal' | 'verification_update';
  title: string;
  body: string;
  data?: Record<string, string>;
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const notificationService = {
  registerForPushNotifications: async (): Promise<string | null> => {
    await delay(500);
    return null;
  },

  sendLocalNotification: async (_notification: NotificationData): Promise<void> => {
    await delay(100);
  },

  getPushToken: async (): Promise<string | null> => {
    await delay(300);
    return null;
  },
};
