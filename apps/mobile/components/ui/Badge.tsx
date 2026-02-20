import { Text, View } from 'react-native';

export type BadgeVariant =
  | 'verified'
  | 'pending'
  | 'unverified'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'neutral';

export interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
}

const variantContainer: Record<BadgeVariant, string> = {
  verified: 'bg-accent-light',
  pending: 'bg-warning/15',
  unverified: 'bg-bgSurfaceSecondary',
  success: 'bg-success/15',
  warning: 'bg-warning/15',
  error: 'bg-error/15',
  info: 'bg-info/15',
  neutral: 'bg-bgSurfaceSecondary',
};

const variantText: Record<BadgeVariant, string> = {
  verified: 'text-accent-dark',
  pending: 'text-warning',
  unverified: 'text-textMuted',
  success: 'text-success',
  warning: 'text-warning',
  error: 'text-error',
  info: 'text-info',
  neutral: 'text-textSecondary',
};

const sizePadding: Record<NonNullable<BadgeProps['size']>, string> = {
  sm: 'px-2 py-0.5',
  md: 'px-2.5 py-1',
};

const sizeText: Record<NonNullable<BadgeProps['size']>, string> = {
  sm: 'text-small',
  md: 'text-caption',
};

export function Badge({ label, variant = 'neutral', size = 'md' }: BadgeProps) {
  return (
    <View
      className={`rounded-full items-center justify-center ${variantContainer[variant]} ${sizePadding[size]}`}
    >
      <Text className={`font-medium ${variantText[variant]} ${sizeText[size]}`}>
        {label}
      </Text>
    </View>
  );
}

export default Badge;
