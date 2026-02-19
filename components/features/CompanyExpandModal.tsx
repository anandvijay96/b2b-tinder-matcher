import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  MapPin,
  Users,
  Zap,
  CheckCircle,
  Globe,
  Briefcase,
  Clock,
  X,
} from 'lucide-react-native';
import { Avatar, Badge, Pill } from '@/components/ui';
import type { SwipeCandidate } from '@/models';

export interface CompanyExpandModalProps {
  candidate: SwipeCandidate | null;
  visible: boolean;
  onClose: () => void;
  onInterested: () => void;
  onPass: () => void;
}

const RESPONSE_SPEED_LABEL: Record<string, string> = {
  fast: 'Responds fast (< 24h)',
  moderate: 'Responds in 1–3 days',
  slow: 'Responds in 3–7 days',
};

const BADGE_LABEL: Record<string, string> = {
  'identity-verified': 'Identity Verified',
  'documents-verified': 'Documents Verified',
  'premium-verified': 'Premium Verified',
};

export function CompanyExpandModal({
  candidate,
  visible,
  onClose,
  onInterested,
  onPass,
}: CompanyExpandModalProps) {
  if (!candidate) return null;
  const { company, matchReasons, matchScore } = candidate;

  const matchColor =
    matchScore >= 85 ? '#22C55E' : matchScore >= 70 ? '#0D9488' : '#F59E0B';

  return (
    <Modal
      visible={visible}
      onRequestClose={onClose}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView className="flex-1 bg-bgBase" edges={['top', 'bottom']}>
        {/* Close button */}
        <Pressable
          onPress={onClose}
          className="absolute top-14 right-4 z-10 w-9 h-9 rounded-full bg-black/30 items-center justify-center"
          hitSlop={8}
        >
          <X size={18} color="#fff" />
        </Pressable>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View className="bg-primary px-5 pt-8 pb-6">
            <View className="flex-row items-start gap-4">
              <Avatar
                initials={company.brandName.slice(0, 2).toUpperCase()}
                size="xl"
                imageUri={company.logoUrl ?? undefined}
              />
              <View className="flex-1 gap-1">
                <Text
                  className="text-heading3 text-textInverse font-bold"
                  numberOfLines={2}
                >
                  {company.brandName}
                </Text>
                <Text className="text-caption text-textInverse/70">
                  {company.legalName}
                </Text>
                <View className="flex-row items-center gap-3 mt-1">
                  <View className="flex-row items-center gap-1">
                    <MapPin size={12} color="rgba(255,255,255,0.7)" />
                    <Text className="text-small text-textInverse/70">
                      {company.hqLocation}
                    </Text>
                  </View>
                  <View className="flex-row items-center gap-1">
                    <Users size={12} color="rgba(255,255,255,0.7)" />
                    <Text className="text-small text-textInverse/70">
                      {company.employeeRange}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            <View className="mt-4 flex-row items-center justify-between">
              <Badge variant="neutral">{company.industry}</Badge>
              <View className="flex-row items-center gap-2">
                <View className="h-2 w-24 bg-white/20 rounded-pill overflow-hidden">
                  <View
                    className="h-full rounded-pill"
                    style={{
                      width: `${matchScore}%`,
                      backgroundColor: matchColor,
                    }}
                  />
                </View>
                <Text
                  className="text-captionMedium font-bold"
                  style={{ color: matchColor }}
                >
                  {matchScore}% match
                </Text>
              </View>
            </View>
          </View>

          {/* Body */}
          <View className="px-5 pt-5 gap-5 pb-8">
            {/* Verification badges */}
            {company.verificationBadges.length > 0 && (
              <View className="flex-row flex-wrap gap-2">
                {company.verificationBadges.map((badge) => (
                  <View key={badge} className="flex-row items-center gap-1">
                    <CheckCircle size={13} color="#0D9488" />
                    <Text className="text-small text-accent font-medium">
                      {BADGE_LABEL[badge] ?? badge}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {/* Why this match — all reasons */}
            {matchReasons.length > 0 && (
              <View className="bg-accent-light rounded-xl p-4 gap-3">
                <View className="flex-row items-center gap-1.5">
                  <Zap size={14} color="#0D9488" />
                  <Text className="text-captionMedium text-accent-dark font-semibold">
                    Why this match
                  </Text>
                </View>
                {matchReasons.map((reason, i) => (
                  <View key={i} className="gap-0.5">
                    <Text className="text-captionMedium text-accent-dark font-semibold">
                      {reason.label}
                    </Text>
                    <Text className="text-caption text-accent-dark/80">
                      {reason.description}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {/* About */}
            <View className="gap-2">
              <Text className="text-captionMedium text-textMuted uppercase tracking-wider">
                About
              </Text>
              <Text className="text-body text-textSecondary leading-6">
                {company.description}
              </Text>
            </View>

            {/* Offerings */}
            {company.offerings.length > 0 && (
              <View className="gap-2">
                <Text className="text-captionMedium text-textMuted uppercase tracking-wider">
                  They offer
                </Text>
                <View className="flex-row flex-wrap gap-1.5">
                  {company.offerings.map((tag) => (
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
                  {company.needs.map((tag) => (
                    <Pill key={tag} label={tag} variant="primary" />
                  ))}
                </View>
              </View>
            )}

            {/* Geographies */}
            {company.geographies.length > 0 && (
              <View className="gap-2">
                <View className="flex-row items-center gap-1.5">
                  <Globe size={13} color="#64748B" />
                  <Text className="text-captionMedium text-textMuted uppercase tracking-wider">
                    Active regions
                  </Text>
                </View>
                <View className="flex-row flex-wrap gap-1.5">
                  {company.geographies.map((geo) => (
                    <Pill key={geo} label={geo} variant="neutral" />
                  ))}
                </View>
              </View>
            )}

            {/* Response speed */}
            <View className="flex-row items-center gap-2">
              <Clock size={13} color="#64748B" />
              <Text className="text-caption text-textSecondary">
                {RESPONSE_SPEED_LABEL[company.responseSpeed] ??
                  company.responseSpeed}
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Action buttons */}
        <View
          className="flex-row gap-3 px-5 pt-3 pb-4 bg-bgSurface border-t border-borderLight"
        >
          <Pressable
            onPress={onPass}
            className="flex-1 h-12 rounded-xl border-2 border-swipeLeft items-center justify-center"
          >
            <Text className="text-bodyMedium text-swipeLeft font-semibold">
              Pass
            </Text>
          </Pressable>
          <Pressable
            onPress={onInterested}
            className="flex-1 h-12 rounded-xl bg-primary items-center justify-center"
          >
            <Text className="text-bodyMedium text-textInverse font-semibold">
              Interested
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

export default CompanyExpandModal;
