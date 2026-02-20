import { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';

export interface SkeletonProps {
  width?: number | `${number}%`;
  height?: number;
  borderRadius?: number;
  className?: string;
}

export function Skeleton({
  width,
  height = 16,
  borderRadius = 8,
  className = '',
}: SkeletonProps) {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.4,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={{
        width: width ?? '100%',
        height,
        borderRadius,
        opacity,
        backgroundColor: '#E2E8F0',
      }}
      className={className}
    />
  );
}

export interface SkeletonCircleProps {
  size?: number;
  className?: string;
}

export function SkeletonCircle({ size = 48, className = '' }: SkeletonCircleProps) {
  return (
    <Skeleton
      width={size}
      height={size}
      borderRadius={size / 2}
      className={className}
    />
  );
}

export interface CardSkeletonProps {
  lines?: number;
}

export function CardSkeleton({ lines = 3 }: CardSkeletonProps) {
  return (
    <View className="bg-bgSurface rounded-card p-4 gap-3 shadow-card">
      <View className="flex-row items-center gap-3">
        <SkeletonCircle size={48} />
        <View className="flex-1 gap-2">
          <Skeleton height={14} width="60%" />
          <Skeleton height={12} width="40%" />
        </View>
      </View>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          height={12}
          width={i === lines - 1 ? '70%' : '100%'}
        />
      ))}
    </View>
  );
}

export default Skeleton;
