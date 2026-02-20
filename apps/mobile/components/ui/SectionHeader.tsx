import { Pressable, Text, View } from 'react-native';

export interface SectionHeaderProps {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
  subtitle?: string;
}

export function SectionHeader({
  title,
  actionLabel,
  onAction,
  subtitle,
}: SectionHeaderProps) {
  return (
    <View className="flex-row items-center justify-between mb-3">
      <View className="flex-1 mr-2">
        <Text className="text-heading3 text-textPrimary font-semibold">
          {title}
        </Text>
        {subtitle && (
          <Text className="text-caption text-textMuted mt-0.5">{subtitle}</Text>
        )}
      </View>

      {actionLabel && onAction && (
        <Pressable onPress={onAction} hitSlop={8}>
          <Text className="text-captionMedium text-accent font-medium">
            {actionLabel}
          </Text>
        </Pressable>
      )}
    </View>
  );
}

export default SectionHeader;
