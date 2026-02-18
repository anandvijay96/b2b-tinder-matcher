import { Image, Text, View } from 'react-native';

export interface AvatarProps {
  uri?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  verified?: boolean;
}

const sizeClass: Record<NonNullable<AvatarProps['size']>, string> = {
  xs: 'w-7 h-7',
  sm: 'w-9 h-9',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
  xl: 'w-20 h-20',
};

const sizeText: Record<NonNullable<AvatarProps['size']>, string> = {
  xs: 'text-small font-bold',
  sm: 'text-caption font-bold',
  md: 'text-body font-bold',
  lg: 'text-heading3 font-bold',
  xl: 'text-heading2 font-bold',
};

const badgeSize: Record<NonNullable<AvatarProps['size']>, string> = {
  xs: 'w-2 h-2 bottom-0 right-0',
  sm: 'w-2.5 h-2.5 bottom-0 right-0',
  md: 'w-3 h-3 bottom-0.5 right-0.5',
  lg: 'w-4 h-4 bottom-0.5 right-0.5',
  xl: 'w-5 h-5 bottom-1 right-1',
};

function getInitials(name?: string): string {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

export function Avatar({ uri, name, size = 'md', verified = false }: AvatarProps) {
  return (
    <View className={`relative ${sizeClass[size]}`}>
      {uri ? (
        <Image
          source={{ uri }}
          className={`${sizeClass[size]} rounded-full`}
          resizeMode="cover"
        />
      ) : (
        <View
          className={`${sizeClass[size]} rounded-full bg-primary-light items-center justify-center`}
        >
          <Text className={`${sizeText[size]} text-primary`}>
            {getInitials(name)}
          </Text>
        </View>
      )}

      {verified && (
        <View
          className={`absolute bg-accent rounded-full border-2 border-bgSurface items-center justify-center ${badgeSize[size]}`}
        />
      )}
    </View>
  );
}

export default Avatar;
