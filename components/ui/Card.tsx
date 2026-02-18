import { Pressable, View } from 'react-native';

export interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: 'default' | 'elevated' | 'flat';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
}

const variantClass: Record<NonNullable<CardProps['variant']>, string> = {
  default: 'bg-bgSurface rounded-card shadow-card',
  elevated: 'bg-bgSurface rounded-card shadow-elevated',
  flat: 'bg-bgSurface rounded-card border border-borderLight',
};

const paddingClass: Record<NonNullable<CardProps['padding']>, string> = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
};

export function Card({
  children,
  onPress,
  variant = 'default',
  padding = 'md',
  className = '',
}: CardProps) {
  const containerClass = [
    variantClass[variant],
    paddingClass[padding],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (onPress) {
    return (
      <Pressable className={containerClass} onPress={onPress}>
        {children}
      </Pressable>
    );
  }

  return <View className={containerClass}>{children}</View>;
}

export default Card;
