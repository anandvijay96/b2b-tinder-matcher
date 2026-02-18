import { Modal as RNModal, Pressable, Text, View } from 'react-native';

export interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  showCloseButton?: boolean;
}

export function Modal({
  visible,
  onClose,
  title,
  children,
  showCloseButton = true,
}: ModalProps) {
  return (
    <RNModal
      visible={visible}
      onRequestClose={onClose}
      animationType="slide"
      transparent
      statusBarTranslucent
    >
      <Pressable
        className="flex-1 bg-black/50 justify-end"
        onPress={onClose}
      >
        <Pressable onPress={() => {}} className="bg-bgSurface rounded-t-2xl pb-8">
          <View className="w-10 h-1 bg-borderMedium rounded-full self-center mt-3 mb-2" />

          {(title || showCloseButton) && (
            <View className="flex-row items-center justify-between px-4 py-3 border-b border-borderLight">
              {title && (
                <Text className="text-heading3 text-textPrimary font-semibold flex-1">
                  {title}
                </Text>
              )}
              {showCloseButton && (
                <Pressable
                  onPress={onClose}
                  className="w-8 h-8 rounded-full bg-bgSurfaceSecondary items-center justify-center ml-2"
                  hitSlop={8}
                >
                  <Text className="text-body text-textSecondary font-medium">×</Text>
                </Pressable>
              )}
            </View>
          )}

          <View className="px-4 pt-4">{children}</View>
        </Pressable>
      </Pressable>
    </RNModal>
  );
}

export default Modal;
