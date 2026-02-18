import { ActivityIndicator, Pressable, Text } from 'react-native';

export interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
}

const baseContainer = 'items-center justify-center rounded-button flex-row gap-2';

const variantContainer: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: 'bg-primary',
  secondary: 'bg-accent',
  outline: 'bg-transparent border border-primary',
  ghost: 'bg-transparent',
  danger: 'bg-error',
};

const variantContainerDisabled: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: 'bg-primary/40',
  secondary: 'bg-accent/40',
  outline: 'bg-transparent border border-borderMedium',
  ghost: 'bg-transparent',
  danger: 'bg-error/40',
};

const sizeContainer: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'px-4 py-2',
  md: 'px-6 py-3.5',
  lg: 'px-8 py-4',
};

const variantText: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: 'text-textInverse',
  secondary: 'text-textInverse',
  outline: 'text-primary',
  ghost: 'text-primary',
  danger: 'text-textInverse',
};

const sizeText: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'text-caption font-semibold',
  md: 'text-bodyMedium font-semibold',
  lg: 'text-body font-bold',
};

const spinnerColor: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: '#FFFFFF',
  secondary: '#FFFFFF',
  outline: '#1E3A5F',
  ghost: '#1E3A5F',
  danger: '#FFFFFF',
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const containerClass = [
    baseContainer,
    isDisabled ? variantContainerDisabled[variant] : variantContainer[variant],
    sizeContainer[size],
    fullWidth ? 'w-full' : 'self-start',
  ].join(' ');

  const textClass = [variantText[variant], sizeText[size]].join(' ');

  return (
    <Pressable
      className={containerClass}
      onPress={onPress}
      disabled={isDisabled}
      android_ripple={{ color: 'rgba(0,0,0,0.1)' }}
    >
      {loading && (
        <ActivityIndicator size="small" color={spinnerColor[variant]} />
      )}
      <Text className={textClass}>{label}</Text>
    </Pressable>
  );
}

export default Button;
