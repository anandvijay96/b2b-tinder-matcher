import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  PanResponder,
  Pressable,
  Text,
  View,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThumbsUp, ThumbsDown, RotateCcw, Star, SlidersHorizontal } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { SwipeCard, CompanyExpandModal, FiltersSheet } from '@/components/features';
import { EmptyState } from '@/components/ui';
import { useSwipeDeck } from '@/hooks';
import type { SwipeCandidate } from '@/models';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = 90;

export default function DiscoverScreen() {
  const router = useRouter();
  const {
    visibleCandidates,
    dailySwipeCount,
    dailySwipeLimit,
    isLoading,
    error,
    hasReachedLimit,
    filters,
    lastMatchId,
    handleSwipe,
    setFilters,
    refresh,
  } = useSwipeDeck();

  const [expandedCandidate, setExpandedCandidate] = useState<SwipeCandidate | null>(null);
  const [filtersVisible, setFiltersVisible] = useState(false);

  const pan = useRef(new Animated.ValueXY()).current;
  const isAnimating = useRef(false);

  useEffect(() => {
    if (lastMatchId) {
      router.push(`/match/${lastMatchId}`);
    }
  }, [lastMatchId]);

  const cardRotate = pan.x.interpolate({
    inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
    outputRange: ['-15deg', '0deg', '15deg'],
    extrapolate: 'clamp',
  });

  const likeOpacity = pan.x.interpolate({
    inputRange: [0, 60],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const passOpacity = pan.x.interpolate({
    inputRange: [-60, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  function swipeCard(direction: 'left' | 'right', candidate?: SwipeCandidate) {
    if (isAnimating.current || visibleCandidates.length === 0) return;
    isAnimating.current = true;
    Haptics.impactAsync(
      direction === 'right'
        ? Haptics.ImpactFeedbackStyle.Medium
        : Haptics.ImpactFeedbackStyle.Light
    );
    const toX = direction === 'right' ? SCREEN_WIDTH * 1.5 : -SCREEN_WIDTH * 1.5;
    Animated.spring(pan, {
      toValue: { x: toX, y: 0 },
      useNativeDriver: true,
      speed: 20,
      bounciness: 0,
    }).start(() => {
      pan.setValue({ x: 0, y: 0 });
      handleSwipe(direction, candidate);
      isAnimating.current = false;
    });
  }

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !isAnimating.current,
      onMoveShouldSetPanResponder: (_, gs) => Math.abs(gs.dx) > 8,
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (_, gs) => {
        if (isAnimating.current) return;
        const isHardSwipe = Math.abs(gs.dx) > SWIPE_THRESHOLD || Math.abs(gs.vx) > 0.6;
        if (isHardSwipe) {
          swipeCard(gs.dx > 0 ? 'right' : 'left');
        } else {
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: true,
            friction: 5,
          }).start();
        }
      },
    })
  ).current;

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-bgBase items-center justify-center" edges={['top']}>
        <ActivityIndicator size="large" color="#1E3A5F" />
        <Text className="text-body text-textSecondary mt-4">Finding your matches…</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-bgBase" edges={['top']}>
        <EmptyState
          title="Something went wrong"
          subtitle={error}
          actionLabel="Try Again"
          onAction={refresh}
        />
      </SafeAreaView>
    );
  }

  const topCandidate = visibleCandidates[0] ?? null;

  return (
    <SafeAreaView className="flex-1 bg-bgBase" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 pt-2 pb-3">
        <Text className="text-heading3 text-textPrimary font-bold">Discover</Text>
        <View className="flex-row items-center gap-3">
          <Pressable
            onPress={() => setFiltersVisible(true)}
            className="w-9 h-9 rounded-full bg-bgSurface border border-borderLight items-center justify-center"
            hitSlop={8}
          >
            <SlidersHorizontal size={16} color="#1E3A5F" />
          </Pressable>
          <View className="flex-row items-center gap-1.5 bg-primary-light rounded-pill px-3 py-1.5">
            <Text className="text-captionMedium text-primary font-semibold">
              {dailySwipeCount}/{dailySwipeLimit}
            </Text>
            <Text className="text-small text-textSecondary">today</Text>
          </View>
        </View>
      </View>

      {/* Deck */}
      <View className="flex-1 px-6">
        {hasReachedLimit ? (
          <EmptyState
            title="Daily limit reached"
            subtitle={`You've reviewed ${dailySwipeLimit} companies today. Come back tomorrow for more matches.`}
          />
        ) : visibleCandidates.length === 0 ? (
          <EmptyState
            title="You've seen everyone!"
            subtitle="No more candidates for now. Check back later or adjust your filters."
            actionLabel="Refresh"
            onAction={refresh}
          />
        ) : (
          <View className="flex-1">
            {/* Back card (index 2) */}
            {visibleCandidates[2] && (
              <View
                style={{
                  position: 'absolute', top: 16, left: 0, right: 0, bottom: 0,
                  transform: [{ scale: 0.90 }, { translateY: 20 }],
                }}
              >
                <SwipeCard candidate={visibleCandidates[2]} isTopCard={false} />
              </View>
            )}

            {/* Middle card (index 1) */}
            {visibleCandidates[1] && (
              <View
                style={{
                  position: 'absolute', top: 8, left: 0, right: 0, bottom: 0,
                  transform: [{ scale: 0.95 }, { translateY: 10 }],
                }}
              >
                <SwipeCard candidate={visibleCandidates[1]} isTopCard={false} />
              </View>
            )}

            {/* Top card — animated + pan gesture */}
            {topCandidate && (
              <Animated.View
                key={topCandidate.company.id}
                style={{
                  position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                  transform: [
                    { translateX: pan.x },
                    { translateY: pan.y },
                    { rotate: cardRotate },
                  ],
                }}
                {...panResponder.panHandlers}
              >
                {/* INTERESTED overlay */}
                <Animated.View
                  pointerEvents="none"
                  style={{
                    position: 'absolute', top: 28, left: 20, zIndex: 10,
                    opacity: likeOpacity,
                    transform: [{ rotate: '-12deg' }],
                  }}
                >
                  <View style={{ borderWidth: 3, borderColor: '#22C55E', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 }}>
                    <Text style={{ color: '#22C55E', fontWeight: '800', fontSize: 20, letterSpacing: 2 }}>INTERESTED</Text>
                  </View>
                </Animated.View>

                {/* PASS overlay */}
                <Animated.View
                  pointerEvents="none"
                  style={{
                    position: 'absolute', top: 28, right: 20, zIndex: 10,
                    opacity: passOpacity,
                    transform: [{ rotate: '12deg' }],
                  }}
                >
                  <View style={{ borderWidth: 3, borderColor: '#EF4444', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 }}>
                    <Text style={{ color: '#EF4444', fontWeight: '800', fontSize: 20, letterSpacing: 2 }}>PASS</Text>
                  </View>
                </Animated.View>

                <Pressable onPress={() => setExpandedCandidate(topCandidate)}>
                  <SwipeCard candidate={topCandidate} isTopCard />
                </Pressable>
              </Animated.View>
            )}
          </View>
        )}
      </View>

      {/* Action Buttons */}
      {!hasReachedLimit && visibleCandidates.length > 0 && (
        <View className="flex-row items-center justify-center gap-5 px-6 py-4">
          {/* Undo — Pro placeholder */}
          <Pressable
            className="w-11 h-11 rounded-full bg-bgSurface border border-borderLight items-center justify-center opacity-50"
            onPress={() =>
              Alert.alert('Pro Feature', 'Undo is available in NMQ Pro. Upgrade to unlock.')
            }
          >
            <RotateCcw size={18} color="#94A3B8" />
          </Pressable>

          {/* Pass */}
          <Pressable
            className="w-16 h-16 rounded-full bg-bgSurface border-2 border-swipeLeft items-center justify-center"
            style={{ shadowColor: '#EF4444', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 }}
            onPress={() => swipeCard('left', topCandidate ?? undefined)}
          >
            <ThumbsDown size={26} color="#EF4444" />
          </Pressable>

          {/* Interested */}
          <Pressable
            className="w-16 h-16 rounded-full bg-bgSurface border-2 border-swipeRight items-center justify-center"
            style={{ shadowColor: '#22C55E', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 }}
            onPress={() => swipeCard('right', topCandidate ?? undefined)}
          >
            <ThumbsUp size={26} color="#22C55E" />
          </Pressable>

          {/* Super-like — Pro placeholder */}
          <Pressable
            className="w-11 h-11 rounded-full bg-bgSurface border border-borderLight items-center justify-center opacity-50"
            onPress={() =>
              Alert.alert('Pro Feature', 'Super-like is available in NMQ Pro. Upgrade to unlock.')
            }
          >
            <Star size={18} color="#F59E0B" />
          </Pressable>
        </View>
      )}

      {/* Expand Modal */}
      <CompanyExpandModal
        candidate={expandedCandidate}
        visible={expandedCandidate !== null}
        onClose={() => setExpandedCandidate(null)}
        onInterested={() => {
          setExpandedCandidate(null);
          swipeCard('right', expandedCandidate ?? undefined);
        }}
        onPass={() => {
          setExpandedCandidate(null);
          swipeCard('left', expandedCandidate ?? undefined);
        }}
      />

      {/* Filters Sheet */}
      <FiltersSheet
        visible={filtersVisible}
        currentFilters={filters}
        onApply={setFilters}
        onClose={() => setFiltersVisible(false)}
      />
    </SafeAreaView>
  );
}
