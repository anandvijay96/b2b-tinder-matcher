import { useEffect } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withSequence,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { MessageCircle, Calendar, Zap, X } from 'lucide-react-native';
import { Avatar } from '@/components/ui';
import { useMatches } from '@/hooks';

export default function MatchCelebrationScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { matches } = useMatches();

  const match = matches.find((m) => m.id === id) ?? null;

  const logoScale = useSharedValue(0);
  const headerOpacity = useSharedValue(0);
  const cardsY = useSharedValue(40);
  const cardsOpacity = useSharedValue(0);
  const ctaOpacity = useSharedValue(0);

  useEffect(() => {
    logoScale.value = withDelay(100, withSpring(1, { damping: 12, stiffness: 180 }));
    headerOpacity.value = withDelay(400, withTiming(1, { duration: 400 }));
    cardsY.value = withDelay(600, withSpring(0, { damping: 16 }));
    cardsOpacity.value = withDelay(600, withTiming(1, { duration: 300 }));
    ctaOpacity.value = withDelay(900, withTiming(1, { duration: 300 }));
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
  }));
  const headerStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
  }));
  const cardStyle = useAnimatedStyle(() => ({
    opacity: cardsOpacity.value,
    transform: [{ translateY: cardsY.value }],
  }));
  const ctaStyle = useAnimatedStyle(() => ({
    opacity: ctaOpacity.value,
  }));

  if (!match) {
    return (
      <SafeAreaView className="flex-1 bg-bgBase items-center justify-center" edges={['top', 'bottom']}>
        <Text className="text-body text-textSecondary">Loading match…</Text>
      </SafeAreaView>
    );
  }

  const { matchedCompany, matchReasons, matchScore } = match;
  const matchColor = matchScore >= 85 ? '#22C55E' : matchScore >= 70 ? '#0D9488' : '#F59E0B';

  return (
    <SafeAreaView className="flex-1 bg-primary" edges={['top', 'bottom']}>
      {/* Close */}
      <Pressable
        onPress={() => router.replace('/(tabs)')}
        className="absolute top-14 right-4 z-20 w-9 h-9 rounded-full bg-white/20 items-center justify-center"
        hitSlop={8}
      >
        <X size={18} color="#fff" />
      </Pressable>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        {/* Celebration header */}
        <View className="items-center px-6 pt-12 pb-8">
          {/* Avatars */}
          <Animated.View style={logoStyle} className="flex-row items-center mb-6">
            <View className="w-20 h-20 rounded-full bg-white items-center justify-center shadow-lg">
              <Avatar
                initials="MY"
                size="xl"
              />
            </View>
            <View className="w-10 h-10 rounded-full bg-white items-center justify-center mx-[-8px] z-10 shadow-md">
              <Zap size={18} color="#1E3A5F" />
            </View>
            <View className="w-20 h-20 rounded-full bg-white items-center justify-center shadow-lg">
              <Avatar
                initials={matchedCompany.brandName.slice(0, 2).toUpperCase()}
                size="xl"
                imageUri={matchedCompany.logoUrl}
              />
            </View>
          </Animated.View>

          <Animated.View style={headerStyle} className="items-center gap-2">
            <Text className="text-heading1 text-textInverse font-bold">It's a Match!</Text>
            <Text className="text-body text-textInverse/80 text-center">
              You and {matchedCompany.brandName} are both interested in partnering.
            </Text>
            <View
              className="mt-2 px-4 py-1.5 rounded-pill"
              style={{ backgroundColor: `${matchColor}33`, borderWidth: 1, borderColor: matchColor }}
            >
              <Text className="text-captionMedium font-bold" style={{ color: matchColor }}>
                {matchScore}% match
              </Text>
            </View>
          </Animated.View>
        </View>

        {/* Why this match */}
        <Animated.View style={cardStyle} className="mx-5 mb-4">
          <View className="bg-white/10 rounded-2xl p-4 gap-3">
            <View className="flex-row items-center gap-1.5">
              <Zap size={14} color="rgba(255,255,255,0.8)" />
              <Text className="text-captionMedium text-textInverse/80 font-semibold uppercase tracking-wider">
                Why you matched
              </Text>
            </View>
            {matchReasons.slice(0, 3).map((reason, i) => (
              <View key={i} className="gap-0.5">
                <Text className="text-captionMedium text-textInverse font-semibold">
                  {reason.label}
                </Text>
                <Text className="text-caption text-textInverse/70">
                  {reason.description}
                </Text>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* About company */}
        <Animated.View style={cardStyle} className="mx-5 mb-4">
          <View className="bg-white/10 rounded-2xl p-4 gap-1">
            <Text className="text-captionMedium text-textInverse/70 uppercase tracking-wider">
              {matchedCompany.brandName}
            </Text>
            <Text className="text-small text-textInverse/60">{matchedCompany.industry} · {matchedCompany.hqLocation}</Text>
            <Text className="text-caption text-textInverse/80 mt-1 leading-5">
              {matchedCompany.offeringSummary}
            </Text>
          </View>
        </Animated.View>

        {/* CTAs */}
        <Animated.View style={ctaStyle} className="mx-5 gap-3 mt-2">
          <Pressable
            onPress={() => router.replace(`/chat/${id}` as never)}
            className="h-14 rounded-2xl bg-white flex-row items-center justify-center gap-2"
          >
            <MessageCircle size={20} color="#1E3A5F" />
            <Text className="text-bodyMedium text-primary font-bold">Chat Now</Text>
          </Pressable>
          <Pressable
            onPress={() => router.replace(`/schedule/${id}` as never)}
            className="h-14 rounded-2xl bg-white/20 border border-white/30 flex-row items-center justify-center gap-2"
          >
            <Calendar size={20} color="#fff" />
            <Text className="text-bodyMedium text-textInverse font-semibold">Schedule Meeting</Text>
          </Pressable>
          <Pressable onPress={() => router.replace('/(tabs)')} className="h-12 items-center justify-center">
            <Text className="text-body text-textInverse/60">Keep swiping</Text>
          </Pressable>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}
