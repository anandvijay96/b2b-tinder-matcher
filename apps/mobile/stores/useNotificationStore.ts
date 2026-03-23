import { create } from 'zustand';
import type { AppNotification } from '@/services/mockData/demoNotifications';
import { DEMO_NOTIFICATIONS } from '@/services/mockData/demoNotifications';

interface NotificationState {
  notifications: AppNotification[];
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  getUnreadCount: () => number;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: DEMO_NOTIFICATIONS,

  markAsRead: (id: string) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      ),
    })),

  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
    })),

  getUnreadCount: () => get().notifications.filter((n) => !n.isRead).length,
}));

export default useNotificationStore;
