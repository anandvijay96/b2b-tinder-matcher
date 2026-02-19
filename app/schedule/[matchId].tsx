import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Calendar, Check, Clock } from 'lucide-react-native';
import { useState } from 'react';
import { useScheduling } from '@/hooks';
import { useMatchStore } from '@/stores';
import type { ProposedSlot } from '@/models';

const STATUS_LABEL: Record<string, string> = {
  proposed: 'Awaiting response',
  accepted: 'Confirmed',
  rejected: 'Declined',
  cancelled: 'Cancelled',
  completed: 'Completed',
};

const STATUS_COLOR: Record<string, string> = {
  proposed: '#F59E0B',
  accepted: '#22C55E',
  rejected: '#EF4444',
  cancelled: '#94A3B8',
  completed: '#0D9488',
};

function formatSlot(slot: ProposedSlot): string {
  const start = new Date(slot.startTimeUtc);
  const end = new Date(slot.endTimeUtc);
  const date = start.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
  const startTime = start.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
  const endTime = end.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
  return `${date} · ${startTime} – ${endTime}`;
}

function addDays(base: Date, days: number): Date {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d;
}

function makeDefaultSlots(): Pick<
  ProposedSlot,
  'startTimeUtc' | 'endTimeUtc' | 'timezone'
>[] {
  const now = new Date();
  now.setHours(10, 0, 0, 0);
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return [1, 3, 5].map((offset) => {
    const start = addDays(now, offset);
    const end = new Date(start.getTime() + 30 * 60 * 1000);
    return {
      startTimeUtc: start.toISOString(),
      endTimeUtc: end.toISOString(),
      timezone: tz,
    };
  });
}

export default function ScheduleScreen() {
  const { matchId } = useLocalSearchParams<{ matchId: string }>();
  const router = useRouter();

  const match = useMatchStore((s) =>
    s.matches.find((m) => m.id === matchId)
  );

  const {
    meetings,
    activeMeeting,
    isLoading,
    isSubmitting,
    proposeMeeting,
    acceptSlot,
  } = useScheduling(matchId ?? '');

  const [proposed, setProposed] = useState(false);

  async function handlePropose() {
    const slots = makeDefaultSlots();
    const result = await proposeMeeting(slots);
    if (result) setProposed(true);
  }

  async function handleAccept(meetingId: string, slotId: string) {
    await acceptSlot(meetingId, slotId);
  }

  const companyName = match?.matchedCompany.brandName ?? 'Counterpart';

  return (
    <SafeAreaView className="flex-1 bg-bgBase" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center gap-3 px-4 py-3 bg-bgSurface border-b border-borderLight">
        <Pressable
          onPress={() => router.back()}
          className="w-9 h-9 items-center justify-center rounded-full"
          hitSlop={8}
        >
          <ArrowLeft size={22} color="#0F172A" />
        </Pressable>
        <View className="flex-1">
          <Text className="text-bodyMedium text-textPrimary font-semibold" numberOfLines={1}>
            Schedule Meeting
          </Text>
          <Text className="text-small text-textMuted" numberOfLines={1}>
            with {companyName}
          </Text>
        </View>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#1E3A5F" />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        >
          {/* Active meeting */}
          {activeMeeting ? (
            <View className="bg-bgSurface rounded-2xl border border-borderLight p-4 mb-5">
              <View className="flex-row items-center justify-between mb-3">
                <View className="flex-row items-center gap-1.5">
                  <Calendar size={14} color="#1E3A5F" />
                  <Text className="text-captionMedium text-textPrimary font-semibold">
                    Meeting proposal
                  </Text>
                </View>
                <View
                  style={{
                    backgroundColor: `${STATUS_COLOR[activeMeeting.status]}22`,
                    borderRadius: 12,
                    paddingHorizontal: 8,
                    paddingVertical: 3,
                  }}
                >
                  <Text
                    style={{
                      color: STATUS_COLOR[activeMeeting.status],
                      fontSize: 11,
                      fontWeight: '600',
                    }}
                  >
                    {STATUS_LABEL[activeMeeting.status]}
                  </Text>
                </View>
              </View>

              {activeMeeting.slots.map((slot) => {
                const isSelected = slot.id === activeMeeting.selectedSlotId;
                const canAccept =
                  activeMeeting.status === 'proposed' &&
                  activeMeeting.proposedBy !== 'user_me';
                return (
                  <Pressable
                    key={slot.id}
                    onPress={
                      canAccept
                        ? () => handleAccept(activeMeeting.id, slot.id)
                        : undefined
                    }
                    disabled={!canAccept || isSubmitting}
                    className={`flex-row items-center gap-3 py-3 border-b border-borderLight/50 ${
                      canAccept ? 'active:opacity-70' : ''
                    }`}
                  >
                    <View
                      className={`w-5 h-5 rounded-full border-2 items-center justify-center ${
                        isSelected
                          ? 'bg-success border-success'
                          : 'border-borderLight'
                      }`}
                    >
                      {isSelected && <Check size={11} color="#fff" />}
                    </View>
                    <View className="flex-1">
                      <Text className="text-captionMedium text-textPrimary">
                        {formatSlot(slot)}
                      </Text>
                      <Text className="text-small text-textMuted">
                        {slot.timezone.replace('_', ' ')}
                      </Text>
                    </View>
                    {canAccept && (
                      <Text className="text-small text-primary font-semibold">
                        Accept
                      </Text>
                    )}
                  </Pressable>
                );
              })}

              {activeMeeting.notes ? (
                <Text className="text-caption text-textSecondary mt-3 italic">
                  "{activeMeeting.notes}"
                </Text>
              ) : null}
            </View>
          ) : null}

          {/* Past meetings */}
          {meetings.filter(
            (m) => m.status !== 'proposed' && m.status !== 'accepted'
          ).length > 0 && (
            <View className="mb-5">
              <Text className="text-captionMedium text-textMuted uppercase tracking-wider mb-3">
                Past
              </Text>
              {meetings
                .filter(
                  (m) => m.status !== 'proposed' && m.status !== 'accepted'
                )
                .map((meeting) => (
                  <View
                    key={meeting.id}
                    className="bg-bgSurface rounded-xl border border-borderLight p-3 mb-2"
                  >
                    <View className="flex-row items-center gap-2">
                      <Clock size={13} color="#94A3B8" />
                      <Text className="text-caption text-textMuted">
                        {STATUS_LABEL[meeting.status]}
                      </Text>
                    </View>
                  </View>
                ))}
            </View>
          )}

          {/* Empty / propose CTA */}
          {!activeMeeting && !proposed && (
            <View className="items-center py-8">
              <View className="w-16 h-16 rounded-full bg-primary/10 items-center justify-center mb-4">
                <Calendar size={28} color="#1E3A5F" />
              </View>
              <Text className="text-bodyMedium text-textPrimary font-semibold text-center mb-1">
                No meetings yet
              </Text>
              <Text className="text-body text-textSecondary text-center mb-6">
                Propose 3 time slots and {companyName} will pick one.
              </Text>
              <Pressable
                onPress={handlePropose}
                disabled={isSubmitting}
                className="h-12 px-8 rounded-xl bg-primary items-center justify-center"
                style={{ opacity: isSubmitting ? 0.6 : 1 }}
              >
                {isSubmitting ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text className="text-bodyMedium text-textInverse font-semibold">
                    Propose Time Slots
                  </Text>
                )}
              </Pressable>
            </View>
          )}

          {proposed && !activeMeeting && (
            <View className="items-center py-8">
              <View className="w-16 h-16 rounded-full bg-success/10 items-center justify-center mb-4">
                <Check size={28} color="#22C55E" />
              </View>
              <Text className="text-bodyMedium text-textPrimary font-semibold text-center mb-1">
                Proposal sent!
              </Text>
              <Text className="text-body text-textSecondary text-center">
                {companyName} will receive your proposed time slots and pick one.
              </Text>
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
