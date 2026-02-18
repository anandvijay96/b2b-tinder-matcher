import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { Pill } from '@/components/ui';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useOnboarding } from '@/hooks/useOnboarding';
import {
  GEOGRAPHIES,
  ENGAGEMENT_MODELS,
  DEAL_SIZE_OPTIONS,
} from '@/models/onboardingSchemas';

export default function OnboardingStep3() {
  const { draft, updateDraft, nextStep, prevStep, totalSteps } = useOnboarding();
  const [errors, setErrors] = useState<Record<string, string>>({});

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

  function toggleGeography(geo: string) {
    const current = draft.geographies;
    const updated = current.includes(geo)
      ? current.filter((g) => g !== geo)
      : [...current, geo];
    updateDraft({ geographies: updated });
    clearFieldError('geographies');
  }

  function toggleEngagement(model: string) {
    const current = draft.engagementModels;
    const updated = current.includes(model)
      ? current.filter((m) => m !== model)
      : [...current, model];
    updateDraft({ engagementModels: updated });
    clearFieldError('engagementModels');
  }

  function formatDealSize(value?: number): string {
    if (value === undefined) return 'Any';
    if (value >= 1000000) return `$${value / 1000000}M`;
    if (value >= 1000) return `$${value / 1000}K`;
    return `$${value}`;
  }

  return (
    <SafeAreaView className="flex-1 bg-bgBase">
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View className="px-6 pt-4 pb-2">
          <ProgressBar currentStep={3} totalSteps={totalSteps} />
        </View>

        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 32 }}
          keyboardShouldPersistTaps="handled"
          className="px-6"
        >
          {/* Header */}
          <View className="mt-4 mb-6">
            <Text className="text-heading2 text-textPrimary font-semibold">
              Deal Preferences
            </Text>
            <Text className="text-body text-textSecondary mt-1">
              Help us find the right matches for your business goals.
            </Text>
          </View>

          <View className="gap-6">
            {/* Deal Size Range */}
            <View className="gap-3">
              <Text className="text-heading3 text-textPrimary font-semibold">
                Deal Size Range
              </Text>
              <Text className="text-caption text-textMuted">
                What's your typical engagement budget?
              </Text>

              {/* Min */}
              <View className="gap-1.5">
                <Text className="text-captionMedium text-textSecondary">
                  Minimum: {formatDealSize(draft.dealSizeMin)}
                </Text>
                <View className="flex-row flex-wrap gap-1.5">
                  {DEAL_SIZE_OPTIONS.map((opt) => (
                    <Pill
                      key={`min-${opt.value}`}
                      label={opt.label}
                      selected={draft.dealSizeMin === opt.value}
                      variant="primary"
                      onPress={() => {
                        updateDraft({ dealSizeMin: opt.value });
                        clearFieldError('dealSizeMin');
                      }}
                    />
                  ))}
                </View>
              </View>

              {/* Max */}
              <View className="gap-1.5">
                <Text className="text-captionMedium text-textSecondary">
                  Maximum: {formatDealSize(draft.dealSizeMax)}
                </Text>
                <View className="flex-row flex-wrap gap-1.5">
                  {DEAL_SIZE_OPTIONS.map((opt) => (
                    <Pill
                      key={`max-${opt.value}`}
                      label={opt.label}
                      selected={draft.dealSizeMax === opt.value}
                      variant="primary"
                      onPress={() => {
                        updateDraft({ dealSizeMax: opt.value });
                        clearFieldError('dealSizeMax');
                      }}
                    />
                  ))}
                </View>
                {errors.dealSizeMax && (
                  <Text className="text-small text-error">
                    {errors.dealSizeMax}
                  </Text>
                )}
              </View>
            </View>

            {/* Geographies */}
            <View className="gap-3">
              <Text className="text-heading3 text-textPrimary font-semibold">
                Target Geographies *
              </Text>
              <Text className="text-caption text-textMuted">
                Where do you operate or want to find partners?
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {GEOGRAPHIES.map((geo) => (
                  <Pill
                    key={geo}
                    label={geo}
                    selected={draft.geographies.includes(geo)}
                    variant="accent"
                    onPress={() => toggleGeography(geo)}
                  />
                ))}
              </View>
              {errors.geographies && (
                <Text className="text-small text-error">
                  {errors.geographies}
                </Text>
              )}
            </View>

            {/* Engagement Models */}
            <View className="gap-3">
              <Text className="text-heading3 text-textPrimary font-semibold">
                Engagement Models *
              </Text>
              <Text className="text-caption text-textMuted">
                How do you prefer to work with partners?
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {ENGAGEMENT_MODELS.map((model) => (
                  <Pill
                    key={model.value}
                    label={model.label}
                    selected={draft.engagementModels.includes(model.value)}
                    variant="primary"
                    onPress={() => toggleEngagement(model.value)}
                  />
                ))}
              </View>
              {errors.engagementModels && (
                <Text className="text-small text-error">
                  {errors.engagementModels}
                </Text>
              )}
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
