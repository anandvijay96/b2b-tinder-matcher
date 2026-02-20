import { useState } from 'react';
import { Pressable, Text, TextInput, type TextInputProps, View } from 'react-native';

export interface InputProps extends Omit<TextInputProps, 'className'> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  secureToggle?: boolean;
}

export function Input({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  secureToggle = false,
  secureTextEntry,
  ...rest
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const isSecure = secureToggle ? !showPassword : secureTextEntry;
  const hasError = !!error;

  const inputBorder = hasError ? 'border-error' : 'border-borderMedium';
  const inputFocusBorder = hasError ? 'focus:border-error' : 'focus:border-primary';

  return (
    <View className="w-full gap-1.5">
      {label && (
        <Text className="text-captionMedium text-textSecondary">{label}</Text>
      )}

      <View
        className={`flex-row items-center bg-bgSurface border rounded-button px-4 h-12 gap-2 ${inputBorder}`}
      >
        {leftIcon && <View className="shrink-0">{leftIcon}</View>}

        <TextInput
          className={`flex-1 text-body text-textPrimary ${inputFocusBorder}`}
          placeholderTextColor="#94A3B8"
          secureTextEntry={isSecure}
          {...rest}
        />

        {secureToggle && (
          <Pressable
            onPress={() => setShowPassword((v) => !v)}
            hitSlop={8}
            className="shrink-0"
          >
            <Text className="text-caption text-textMuted">
              {showPassword ? 'Hide' : 'Show'}
            </Text>
          </Pressable>
        )}

        {rightIcon && !secureToggle && (
          <View className="shrink-0">{rightIcon}</View>
        )}
      </View>

      {hint && !error && (
        <Text className="text-small text-textMuted">{hint}</Text>
      )}
      {error && (
        <Text className="text-small text-error">{error}</Text>
      )}
    </View>
  );
}

export default Input;
