import { useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

export interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  showLabel?: boolean;
  showPercentage?: boolean;
}

export function ProgressBar({
  currentStep,
  totalSteps,
  showLabel = true,
  showPercentage = false,
}: ProgressBarProps) {
  const progress = useSharedValue(0);
  const percentage = Math.round((currentStep / totalSteps) * 100);

  useEffect(() => {
    progress.value = withTiming(currentStep / totalSteps, { duration: 400 });
  }, [currentStep, totalSteps, progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  return (
    <View className="gap-2">
      {(showLabel || showPercentage) && (
        <View className="flex-row items-center justify-between">
          {showLabel && (
            <Text className="text-caption text-textSecondary">
              Step {currentStep} of {totalSteps}
            </Text>
          )}
          {showPercentage && (
            <Text className="text-caption text-textMuted">
              {percentage}%
            </Text>
          )}
        </View>
      )}
      <View className="h-1.5 bg-bgSurfaceSecondary rounded-pill overflow-hidden">
        <Animated.View
          className="h-full bg-accent rounded-pill"
          style={animatedStyle}
        />
      </View>
    </View>
  );
}

export default ProgressBar;
