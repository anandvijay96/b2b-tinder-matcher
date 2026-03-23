export type NotificationType =
  | 'new_match'
  | 'new_message'
  | 'meeting_proposal'
  | 'meeting_accepted'
  | 'profile_view'
  | 'verification_update'
  | 'weekly_digest';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
  /** Route to push when tapped */
  actionRoute?: string;
  /** Company or entity associated */
  companyName?: string;
  companyInitials?: string;
}

const now = Date.now();

export const DEMO_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    type: 'new_match',
    title: 'New Match!',
    body: 'You and CyberShield AI both expressed interest. Start a conversation!',
    isRead: false,
    createdAt: new Date(now - 15 * 60 * 1000).toISOString(),
    actionRoute: '/match/demo-match-cyber',
    companyName: 'CyberShield AI',
    companyInitials: 'CS',
  },
  {
    id: 'notif-2',
    type: 'new_message',
    title: 'New message from Vertex AI Solutions',
    body: 'We can offer a 60-day free POC for qualified partners. Interested?',
    isRead: false,
    createdAt: new Date(now - 1 * 60 * 60 * 1000).toISOString(),
    actionRoute: '/chat/demo-match-1',
    companyName: 'Vertex AI Solutions',
    companyInitials: 'VA',
  },
  {
    id: 'notif-3',
    type: 'new_message',
    title: 'New message from CloudForge',
    body: 'Meeting confirmed for Thursday 2pm EST',
    isRead: false,
    createdAt: new Date(now - 5 * 60 * 60 * 1000).toISOString(),
    actionRoute: '/chat/demo-match-3',
    companyName: 'CloudForge',
    companyInitials: 'CF',
  },
  {
    id: 'notif-4',
    type: 'meeting_proposal',
    title: 'Meeting proposed by GreenSupply Co',
    body: 'They want to schedule a 30-min intro call. Review available time slots.',
    isRead: false,
    createdAt: new Date(now - 8 * 60 * 60 * 1000).toISOString(),
    actionRoute: '/schedule/demo-match-2',
    companyName: 'GreenSupply Co',
    companyInitials: 'GS',
  },
  {
    id: 'notif-5',
    type: 'profile_view',
    title: '3 companies viewed your profile',
    body: 'ScaleOps, Nexara Commerce, and FinEdge Partners checked out your profile today.',
    isRead: true,
    createdAt: new Date(now - 1 * 24 * 60 * 60 * 1000).toISOString(),
    companyInitials: '3',
  },
  {
    id: 'notif-6',
    type: 'meeting_accepted',
    title: 'Meeting accepted by CloudForge',
    body: 'Thursday 2pm EST is confirmed. A calendar invite has been sent.',
    isRead: true,
    createdAt: new Date(now - 1 * 24 * 60 * 60 * 1000 - 3 * 60 * 60 * 1000).toISOString(),
    actionRoute: '/schedule/demo-match-3',
    companyName: 'CloudForge',
    companyInitials: 'CF',
  },
  {
    id: 'notif-7',
    type: 'new_match',
    title: 'New Match!',
    body: 'You and ScaleOps are a 87% match. They\'re looking for exactly what you offer.',
    isRead: true,
    createdAt: new Date(now - 2 * 24 * 60 * 60 * 1000).toISOString(),
    actionRoute: '/match/demo-match-scaleops',
    companyName: 'ScaleOps',
    companyInitials: 'SO',
  },
  {
    id: 'notif-8',
    type: 'verification_update',
    title: 'Your profile is now verified',
    body: 'Identity verification complete. Your verified badge is now visible to all potential partners.',
    isRead: true,
    createdAt: new Date(now - 3 * 24 * 60 * 60 * 1000).toISOString(),
    companyInitials: '✓',
  },
  {
    id: 'notif-9',
    type: 'weekly_digest',
    title: 'Your weekly match digest',
    body: '12 new companies match your profile this week. Top pick: CyberShield AI at 89% match.',
    isRead: true,
    createdAt: new Date(now - 5 * 24 * 60 * 60 * 1000).toISOString(),
    companyInitials: '📊',
  },
];
