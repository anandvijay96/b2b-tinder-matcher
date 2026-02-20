import { useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

interface SplashScreenProps {
  onFinish: () => void;
}

export function SplashScreen({ onFinish }: SplashScreenProps) {
  const logoScale = useSharedValue(0.3);
  const logoOpacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const textTranslateY = useSharedValue(20);
  const containerOpacity = useSharedValue(1);

  useEffect(() => {
    // Logo entrance: scale up + fade in
    logoScale.value = withTiming(1, {
      duration: 600,
      easing: Easing.out(Easing.back(1.5)),
    });
    logoOpacity.value = withTiming(1, { duration: 500 });

    // Text slides up + fades in after logo
    textOpacity.value = withDelay(400, withTiming(1, { duration: 400 }));
    textTranslateY.value = withDelay(
      400,
      withTiming(0, { duration: 400, easing: Easing.out(Easing.quad) })
    );

    // Fade out everything after pause
    containerOpacity.value = withDelay(
      1800,
      withTiming(0, { duration: 400 })
    );

    const timeout = setTimeout(onFinish, 2300);
    return () => clearTimeout(timeout);
  }, [logoScale, logoOpacity, textOpacity, textTranslateY, containerOpacity, onFinish]);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
    opacity: logoOpacity.value,
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: textTranslateY.value }],
  }));

  const containerStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
  }));

  return (
    <Animated.View
      className="flex-1 bg-primary items-center justify-center"
      style={containerStyle}
    >
      <Animated.View style={logoStyle}>
        <View className="w-20 h-20 rounded-2xl bg-white/15 items-center justify-center mb-5">
          <Text className="text-4xl font-bold text-textInverse">N</Text>
        </View>
      </Animated.View>

      <Animated.View style={textStyle} className="items-center">
        <Text className="text-heading1 font-bold text-textInverse tracking-tight">
          NMQ B2B Match
        </Text>
        <Text className="text-body text-textInverse/60 mt-2">
          Find your next business partner
        </Text>
      </Animated.View>
    </Animated.View>
  );
}

export default SplashScreen;
