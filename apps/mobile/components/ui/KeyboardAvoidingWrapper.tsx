import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';
import type { PropsWithChildren } from 'react';

export interface KeyboardAvoidingWrapperProps extends PropsWithChildren {
  /** Disable wrapper entirely (e.g. for non-input screens) */
  enabled?: boolean;
  /** 'modal' adjusts offset for screens inside a Modal */
  mode?: 'screen' | 'modal';
  /** Extra vertical offset override */
  keyboardVerticalOffset?: number;
  /** Wrap children in a ScrollView so content scrolls above keyboard */
  withScroll?: boolean;
}

export function KeyboardAvoidingWrapper({
  children,
  enabled = true,
  mode = 'screen',
  keyboardVerticalOffset,
  withScroll = false,
}: KeyboardAvoidingWrapperProps) {
  if (!enabled) return <>{children}</>;

  const defaultOffset =
    mode === 'modal'
      ? 0
      : Platform.OS === 'ios'
      ? 0
      : 16;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={keyboardVerticalOffset ?? defaultOffset}
    >
      {withScroll ? (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      ) : (
        children
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
});
