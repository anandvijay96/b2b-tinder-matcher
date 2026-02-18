import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { Pill } from '@/components/ui';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useOnboarding } from '@/hooks/useOnboarding';

const OFFERING_SUGGESTIONS = [
  'Software Development',
  'Cloud Infrastructure',
  'Data Analytics',
  'AI / Machine Learning',
  'Cybersecurity',
  'Digital Marketing',
  'UX/UI Design',
  'DevOps',
  'Mobile Development',
  'IT Consulting',
  'ERP Solutions',
  'Managed Services',
];

const NEED_SUGGESTIONS = [
  'Lead Generation',
  'Technical Talent',
  'Cloud Migration',
  'Brand Strategy',
  'Legal Counsel',
  'Funding / Investment',
  'Sales Partnerships',
  'Market Research',
  'Supply Chain',
  'Quality Assurance',
  'Security Audit',
  'Compliance',
];

export default function OnboardingStep2() {
  const { draft, updateDraft, nextStep, prevStep, totalSteps } = useOnboarding();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [offeringInput, setOfferingInput] = useState('');
  const [needInput, setNeedInput] = useState('');

  async function handleNext() {
    const result = await nextStep();
    if (!result.success) {
      setErrors(result.errors);
    }
  }

  function clearFieldError(field: string) {
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  }

  function addOffering(tag: string) {
    const trimmed = tag.trim();
    if (trimmed && !draft.offerings.includes(trimmed)) {
      updateDraft({ offerings: [...draft.offerings, trimmed] });
      clearFieldError('offerings');
    }
    setOfferingInput('');
  }

  function removeOffering(tag: string) {
    updateDraft({ offerings: draft.offerings.filter((o) => o !== tag) });
  }

  function addNeed(tag: string) {
    const trimmed = tag.trim();
    if (trimmed && !draft.needs.includes(trimmed)) {
      updateDraft({ needs: [...draft.needs, trimmed] });
      clearFieldError('needs');
    }
    setNeedInput('');
  }

  function removeNeed(tag: string) {
    updateDraft({ needs: draft.needs.filter((n) => n !== tag) });
  }

  return (
    <SafeAreaView className="flex-1 bg-bgBase">
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View className="px-6 pt-4 pb-2">
          <ProgressBar currentStep={2} totalSteps={totalSteps} />
        </View>

        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 32 }}
          keyboardShouldPersistTaps="handled"
          className="px-6"
        >
          {/* Header */}
          <View className="mt-4 mb-6">
            <Text className="text-heading2 text-textPrimary font-semibold">
              Offerings & Needs
            </Text>
            <Text className="text-body text-textSecondary mt-1">
              What does your company offer, and what are you looking for?
            </Text>
          </View>

          <View className="gap-6">
            {/* --- Offerings Section --- */}
            <View className="gap-3">
              <Text className="text-heading3 text-textPrimary font-semibold">
                What You Offer
              </Text>

              {/* Summary */}
              <View className="gap-1.5">
                <Text className="text-captionMedium text-textSecondary">
                  Describe your core offerings *
                </Text>
                <View
                  className={`bg-bgSurface border rounded-button px-4 py-3 ${
                    errors.offeringSummary ? 'border-error' : 'border-borderMedium'
                  }`}
                >
                  <TextInput
                    className="text-body text-textPrimary min-h-[80px]"
                    placeholder="E.g., We provide enterprise cloud migration services and DevOps automation..."
                    placeholderTextColor="#94A3B8"
                    multiline
                    textAlignVertical="top"
                    value={draft.offeringSummary}
                    onChangeText={(v) => {
                      updateDraft({ offeringSummary: v });
                      clearFieldError('offeringSummary');
                    }}
                    maxLength={500}
                  />
                </View>
                <Text className="text-small text-textMuted text-right">
                  {draft.offeringSummary.length}/500
                </Text>
                {errors.offeringSummary && (
                  <Text className="text-small text-error">
                    {errors.offeringSummary}
                  </Text>
                )}
              </View>

              {/* Tags */}
              <View className="gap-1.5">
                <Text className="text-captionMedium text-textSecondary">
                  Offering tags *
                </Text>

                {/* Current tags */}
                {draft.offerings.length > 0 && (
                  <View className="flex-row flex-wrap gap-2 mb-1">
                    {draft.offerings.map((tag) => (
                      <Pill
                        key={tag}
                        label={tag}
                        variant="accent"
                        selected
                        onRemove={() => removeOffering(tag)}
                      />
                    ))}
                  </View>
                )}

                {/* Custom input */}
                <View className="flex-row items-center bg-bgSurface border border-borderMedium rounded-button px-4 h-12 gap-2">
                  <TextInput
                    className="flex-1 text-body text-textPrimary"
                    placeholder="Type a tag and press enter..."
                    placeholderTextColor="#94A3B8"
                    value={offeringInput}
                    onChangeText={setOfferingInput}
                    onSubmitEditing={() => addOffering(offeringInput)}
                    returnKeyType="done"
                  />
                  {offeringInput.trim() && (
                    <Pressable
                      onPress={() => addOffering(offeringInput)}
                      className="bg-accent rounded-pill px-3 py-1"
                    >
                      <Text className="text-caption text-textInverse font-medium">
                        Add
                      </Text>
                    </Pressable>
                  )}
                </View>
                {errors.offerings && (
                  <Text className="text-small text-error">{errors.offerings}</Text>
                )}

                {/* Suggestions */}
                <Text className="text-small text-textMuted mt-1">
                  Quick add:
                </Text>
                <View className="flex-row flex-wrap gap-1.5">
                  {OFFERING_SUGGESTIONS.filter(
                    (s) => !draft.offerings.includes(s)
                  ).map((s) => (
                    <Pill
                      key={s}
                      label={s}
                      variant="muted"
                      onPress={() => addOffering(s)}
                    />
                  ))}
                </View>
              </View>
            </View>

            {/* --- Needs Section --- */}
            <View className="gap-3">
              <Text className="text-heading3 text-textPrimary font-semibold">
                What You Need
              </Text>

              {/* Summary */}
              <View className="gap-1.5">
                <Text className="text-captionMedium text-textSecondary">
                  Describe what you're looking for *
                </Text>
                <View
                  className={`bg-bgSurface border rounded-button px-4 py-3 ${
                    errors.needsSummary ? 'border-error' : 'border-borderMedium'
                  }`}
                >
                  <TextInput
                    className="text-body text-textPrimary min-h-[80px]"
                    placeholder="E.g., We're seeking partners for lead generation and go-to-market strategy..."
                    placeholderTextColor="#94A3B8"
                    multiline
                    textAlignVertical="top"
                    value={draft.needsSummary}
                    onChangeText={(v) => {
                      updateDraft({ needsSummary: v });
                      clearFieldError('needsSummary');
                    }}
                    maxLength={500}
                  />
                </View>
                <Text className="text-small text-textMuted text-right">
                  {draft.needsSummary.length}/500
                </Text>
                {errors.needsSummary && (
                  <Text className="text-small text-error">
                    {errors.needsSummary}
                  </Text>
                )}
              </View>

              {/* Tags */}
              <View className="gap-1.5">
                <Text className="text-captionMedium text-textSecondary">
                  Need tags *
                </Text>

                {draft.needs.length > 0 && (
                  <View className="flex-row flex-wrap gap-2 mb-1">
                    {draft.needs.map((tag) => (
                      <Pill
                        key={tag}
                        label={tag}
                        variant="primary"
                        selected
                        onRemove={() => removeNeed(tag)}
                      />
                    ))}
                  </View>
                )}

                <View className="flex-row items-center bg-bgSurface border border-borderMedium rounded-button px-4 h-12 gap-2">
                  <TextInput
                    className="flex-1 text-body text-textPrimary"
                    placeholder="Type a tag and press enter..."
                    placeholderTextColor="#94A3B8"
                    value={needInput}
                    onChangeText={setNeedInput}
                    onSubmitEditing={() => addNeed(needInput)}
                    returnKeyType="done"
                  />
                  {needInput.trim() && (
                    <Pressable
                      onPress={() => addNeed(needInput)}
                      className="bg-primary rounded-pill px-3 py-1"
                    >
                      <Text className="text-caption text-textInverse font-medium">
                        Add
                      </Text>
                    </Pressable>
                  )}
                </View>
                {errors.needs && (
                  <Text className="text-small text-error">{errors.needs}</Text>
                )}

                <Text className="text-small text-textMuted mt-1">
                  Quick add:
                </Text>
                <View className="flex-row flex-wrap gap-1.5">
                  {NEED_SUGGESTIONS.filter(
                    (s) => !draft.needs.includes(s)
                  ).map((s) => (
                    <Pill
                      key={s}
                      label={s}
                      variant="muted"
                      onPress={() => addNeed(s)}
                    />
                  ))}
                </View>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Bottom CTAs */}
        <View className="px-6 pb-4 pt-2 border-t border-borderLight bg-bgBase flex-row gap-3">
          <Pressable
            className="flex-1 border border-borderMedium rounded-button py-4 items-center"
            onPress={prevStep}
          >
            <Text className="text-bodyMedium text-textPrimary font-medium">
              Back
            </Text>
          </Pressable>
          <Pressable
            className="flex-[2] bg-primary rounded-button py-4 items-center"
            onPress={handleNext}
          >
            <Text className="text-bodyMedium text-textInverse font-semibold">
              Continue
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
