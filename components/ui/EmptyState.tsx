import { Text, View } from 'react-native';
import { Button } from './Button';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon,
  title,
  subtitle,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center px-8 py-12">
      {icon && (
        <View className="mb-6 w-20 h-20 rounded-full bg-bgSurfaceSecondary items-center justify-center">
          {icon}
        </View>
      )}

      <Text className="text-heading3 text-textPrimary text-center font-semibold">
        {title}
      </Text>

      {subtitle && (
        <Text className="text-body text-textMuted text-center mt-2 leading-relaxed">
          {subtitle}
        </Text>
      )}

      {actionLabel && onAction && (
        <View className="mt-6">
          <Button label={actionLabel} onPress={onAction} variant="primary" />
        </View>
      )}
    </View>
  );
}

export default EmptyState;
