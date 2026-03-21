import { View, Text, ScrollView, Pressable } from 'react-native';
import { MapPin, Users, Zap, CheckCircle, ChevronUp } from 'lucide-react-native';
import { Avatar, Badge, Pill } from '@/components/ui';
import type { SwipeCandidate } from '@/models';

export interface SwipeCardProps {
  candidate: SwipeCandidate;
  isTopCard?: boolean;
  /** When true, enables vertical scrolling (e.g. inside expanded modal) */
  scrollEnabled?: boolean;
  /** Callback when the "View Details" button is tapped */
  onViewDetails?: () => void;
}

function VerificationDot({ count }: { count: number }) {
  if (count === 0) return null;
  return (
    <View className="flex-row items-center gap-1">
      <CheckCircle size={13} color="#0D9488" />
      <Text className="text-small text-accent font-medium">Verified</Text>
    </View>
  );
}

export function SwipeCard({ candidate, isTopCard = false, scrollEnabled = false, onViewDetails }: SwipeCardProps) {
  const { company, matchReasons, matchScore } = candidate;

  const matchColor =
    matchScore >= 85
      ? '#22C55E'
      : matchScore >= 70
      ? '#0D9488'
      : '#F59E0B';

  return (
    <View className="flex-1 bg-bgSurface rounded-2xl overflow-hidden border border-borderLight"
      style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.12, shadowRadius: 24, elevation: 8 }}
    >
      <ScrollView
        scrollEnabled={scrollEnabled}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: isTopCard && onViewDetails ? 56 : 24 }}
      >
        {/* Header Band */}
        <View className="bg-primary px-5 pt-6 pb-5">
          <View className="flex-row items-start gap-4">
            <Avatar
              initials={company.brandName.slice(0, 2).toUpperCase()}
              size="xl"
              imageUri={company.logoUrl ?? undefined}
            />
            <View className="flex-1 gap-1">
              <Text className="text-heading3 text-textInverse font-bold" numberOfLines={1}>
                {company.brandName}
              </Text>
              <Text className="text-caption text-textInverse/70" numberOfLines={1}>
                {company.legalName}
              </Text>

              <View className="flex-row items-center gap-3 mt-1">
                <View className="flex-row items-center gap-1">
                  <MapPin size={12} color="rgba(255,255,255,0.7)" />
                  <Text className="text-small text-textInverse/70">{company.hqLocation}</Text>
                </View>
                <View className="flex-row items-center gap-1">
                  <Users size={12} color="rgba(255,255,255,0.7)" />
                  <Text className="text-small text-textInverse/70">{company.employeeRange}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Match Score */}
          <View className="mt-4 flex-row items-center justify-between">
            <View className="bg-white/20 rounded-pill px-2.5 py-1">
              <Text className="text-small text-textInverse font-medium">{company.industry}</Text>
            </View>
            <View className="flex-row items-center gap-2">
              <View className="h-2 w-24 bg-white/20 rounded-pill overflow-hidden">
                <View
                  className="h-full rounded-pill"
                  style={{ width: `${matchScore}%`, backgroundColor: matchColor }}
                />
              </View>
              <Text className="text-captionMedium font-bold" style={{ color: matchColor }}>
                {matchScore}% match
              </Text>
            </View>
          </View>
        </View>

        {/* Body */}
        <View className="px-5 pt-4 gap-4">
          {/* Verification */}
          {company.verificationBadges.length > 0 && (
            <VerificationDot count={company.verificationBadges.length} />
          )}

          {/* Why this match */}
          {matchReasons.length > 0 && (
            <View className="bg-accent-light rounded-xl p-3 gap-2">
              <View className="flex-row items-center gap-1.5">
                <Zap size={14} color="#0D9488" />
                <Text className="text-captionMedium text-accent-dark font-semibold">
                  Why this match
                </Text>
              </View>
              {matchReasons.slice(0, 2).map((reason, i) => (
                <Text key={i} className="text-caption text-accent-dark">
                  · {reason.label}: {reason.description}
                </Text>
              ))}
            </View>
          )}

          {/* Description */}
          <Text className="text-caption text-textSecondary" numberOfLines={3}>
            {company.description}
          </Text>

          {/* Offerings */}
          {company.offerings.length > 0 && (
            <View className="gap-2">
              <Text className="text-captionMedium text-textMuted uppercase tracking-wider">
                They offer
              </Text>
              <View className="flex-row flex-wrap gap-1.5">
                {company.offerings.slice(0, 4).map((tag) => (
                  <Pill key={tag} label={tag} variant="accent" />
                ))}
              </View>
            </View>
          )}

          {/* Needs */}
          {company.needs.length > 0 && (
            <View className="gap-2">
              <Text className="text-captionMedium text-textMuted uppercase tracking-wider">
                They need
              </Text>
              <View className="flex-row flex-wrap gap-1.5">
                {company.needs.slice(0, 4).map((tag) => (
                  <Pill key={tag} label={tag} variant="primary" />
                ))}
              </View>
            </View>
          )}

        </View>
      </ScrollView>

      {/* Persistent bottom button — always visible regardless of content height */}
      {isTopCard && onViewDetails && (
        <Pressable
          onPress={onViewDetails}
          className="absolute bottom-0 left-0 right-0 flex-row items-center justify-center gap-1.5 bg-primary rounded-b-2xl py-3.5"
          hitSlop={4}
          style={{ elevation: 10 }}
        >
          <ChevronUp size={16} color="#FFFFFF" />
          <Text className="text-captionMedium text-textInverse font-semibold">
            View Full Profile
          </Text>
        </Pressable>
      )}
    </View>
  );
}

export default SwipeCard;
