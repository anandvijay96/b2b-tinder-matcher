import { Pressable, Text, View } from 'react-native';

export interface PillProps {
  label: string;
  variant?: 'default' | 'primary' | 'accent' | 'muted';
  onRemove?: () => void;
  onPress?: () => void;
  selected?: boolean;
}

const variantContainer: Record<NonNullable<PillProps['variant']>, string> = {
  default: 'bg-bgSurfaceSecondary border border-borderLight',
  primary: 'bg-primary-light border border-primary/20',
  accent: 'bg-accent-light border border-accent/20',
  muted: 'bg-bgSurfaceSecondary border border-borderLight',
};

const variantContainerSelected: Record<NonNullable<PillProps['variant']>, string> = {
  default: 'bg-primary border border-primary',
  primary: 'bg-primary border border-primary',
  accent: 'bg-accent border border-accent',
  muted: 'bg-textMuted border border-textMuted',
};

const variantText: Record<NonNullable<PillProps['variant']>, string> = {
  default: 'text-textSecondary',
  primary: 'text-primary',
  accent: 'text-accent-dark',
  muted: 'text-textMuted',
};

const variantTextSelected: Record<NonNullable<PillProps['variant']>, string> = {
  default: 'text-textInverse',
  primary: 'text-textInverse',
  accent: 'text-textInverse',
  muted: 'text-textInverse',
};

export function Pill({
  label,
  variant = 'default',
  onRemove,
  onPress,
  selected = false,
}: PillProps) {
  const containerClass = [
    'flex-row items-center rounded-pill px-3 py-1.5 gap-1.5',
    selected ? variantContainerSelected[variant] : variantContainer[variant],
  ].join(' ');

  const textClass = [
    'text-caption font-medium',
    selected ? variantTextSelected[variant] : variantText[variant],
  ].join(' ');

  const content = (
    <>
      <Text className={textClass}>{label}</Text>
      {onRemove && (
        <Pressable onPress={onRemove} hitSlop={4}>
          <Text className={`text-small font-bold ${selected ? 'text-textInverse/70' : 'text-textMuted'}`}>
            ×
          </Text>
        </Pressable>
      )}
    </>
  );

  if (onPress) {
    return (
      <Pressable className={containerClass} onPress={onPress}>
        {content}
      </Pressable>
    );
  }

  return <View className={containerClass}>{content}</View>;
}

export default Pill;
