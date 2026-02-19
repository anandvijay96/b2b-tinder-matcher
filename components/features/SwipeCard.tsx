import { View, Text, ScrollView } from 'react-native';
import Animated, { useAnimatedStyle, interpolate, Extrapolation } from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';
import { MapPin, Users, Zap, CheckCircle } from 'lucide-react-native';
import { Avatar, Badge, Pill } from '@/components/ui';
import type { SwipeCandidate } from '@/models';

export interface SwipeCardProps {
  candidate: SwipeCandidate;
  panX?: SharedValue<number>;
  isTopCard?: boolean;
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

export function SwipeCard({ candidate, panX, isTopCard = false }: SwipeCardProps) {
  const { company, matchReasons, matchScore } = candidate;

  const likeOverlayStyle = useAnimatedStyle(() => {
    if (!panX) return { opacity: 0 };
    return {
      opacity: interpolate(panX.value, [0, 80], [0, 1], Extrapolation.CLAMP),
    };
  });

  const passOverlayStyle = useAnimatedStyle(() => {
    if (!panX) return { opacity: 0 };
    return {
      opacity: interpolate(panX.value, [0, -80], [0, 1], Extrapolation.CLAMP),
    };
  });

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
      {/* Like / Pass Overlays — only on top card */}
      {isTopCard && (
        <>
          <Animated.View
            pointerEvents="none"
            style={[likeOverlayStyle, { position: 'absolute', top: 24, left: 24, zIndex: 20 }]}
          >
            <View className="border-2 border-swipeRight rounded-lg px-4 py-2 rotate-[-12deg]">
              <Text className="text-heading3 text-swipeRight font-bold tracking-wider">
                INTERESTED
              </Text>
            </View>
          </Animated.View>

          <Animated.View
            pointerEvents="none"
            style={[passOverlayStyle, { position: 'absolute', top: 24, right: 24, zIndex: 20 }]}
          >
            <View className="border-2 border-swipeLeft rounded-lg px-4 py-2 rotate-[12deg]">
              <Text className="text-heading3 text-swipeLeft font-bold tracking-wider">
                PASS
              </Text>
            </View>
          </Animated.View>
        </>
      )}

      <ScrollView
        scrollEnabled={isTopCard}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
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
            <Badge variant="neutral">{company.industry}</Badge>
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
    </View>
  );
}

export default SwipeCard;
