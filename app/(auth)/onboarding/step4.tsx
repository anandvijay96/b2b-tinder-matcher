import { useState } from 'react';
import {
  ActivityIndicator,
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

import { Badge, Pill } from '@/components/ui';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useOnboarding } from '@/hooks/useOnboarding';

export default function OnboardingStep4() {
  const { draft, updateDraft, prevStep, submitProfile, totalSteps } =
    useOnboarding();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit() {
    setIsSubmitting(true);
    setErrors({});
    const result = await submitProfile();
    if (!result.success) {
      setErrors(result.errors);
    }
    setIsSubmitting(false);
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

  return (
    <SafeAreaView className="flex-1 bg-bgBase">
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View className="px-6 pt-4 pb-2">
          <ProgressBar currentStep={4} totalSteps={totalSteps} />
        </View>

        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 32 }}
          keyboardShouldPersistTaps="handled"
          className="px-6"
        >
          {/* Header */}
          <View className="mt-4 mb-6">
            <Text className="text-heading2 text-textPrimary font-semibold">
              Review & Submit
            </Text>
            <Text className="text-body text-textSecondary mt-1">
              Add a company description and review your profile before going live.
            </Text>
          </View>

          <View className="gap-6">
            {/* Logo Upload Placeholder */}
            <View className="gap-3">
              <Text className="text-heading3 text-textPrimary font-semibold">
                Company Logo
              </Text>
              <Pressable className="w-24 h-24 rounded-2xl bg-bgSurfaceSecondary border-2 border-dashed border-borderMedium items-center justify-center">
                <Text className="text-3xl text-textMuted">+</Text>
                <Text className="text-small text-textMuted mt-1">Upload</Text>
              </Pressable>
              <Text className="text-small text-textMuted">
                Optional. You can add a logo later from your profile.
              </Text>
            </View>

            {/* Company Description */}
            <View className="gap-1.5">
              <Text className="text-captionMedium text-textSecondary">
                Company Description *
              </Text>
              <View
                className={`bg-bgSurface border rounded-button px-4 py-3 ${
                  errors.description ? 'border-error' : 'border-borderMedium'
                }`}
              >
                <TextInput
                  className="text-body text-textPrimary min-h-[100px]"
                  placeholder="Describe your company, its mission, and what makes it unique..."
                  placeholderTextColor="#94A3B8"
                  multiline
                  textAlignVertical="top"
                  value={draft.description}
                  onChangeText={(v) => {
                    updateDraft({ description: v });
                    clearFieldError('description');
                  }}
                  maxLength={1000}
                />
              </View>
              <Text className="text-small text-textMuted text-right">
                {draft.description.length}/1000
              </Text>
              {errors.description && (
                <Text className="text-small text-error">
                  {errors.description}
                </Text>
              )}
            </View>

            {/* Profile Summary */}
            <View className="gap-4 bg-bgSurface border border-borderLight rounded-card p-4">
              <Text className="text-heading3 text-textPrimary font-semibold">
                Profile Summary
              </Text>

              {/* Company Basics */}
              <View className="gap-2">
                <Text className="text-captionMedium text-textMuted uppercase tracking-wider">
                  Company
                </Text>
                <Text className="text-body text-textPrimary font-medium">
                  {draft.legalName || '—'}
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  {draft.industry ? (
                    <Badge variant="info">{draft.industry}</Badge>
                  ) : null}
                  {draft.employeeRange ? (
                    <Badge variant="neutral">{draft.employeeRange} employees</Badge>
                  ) : null}
                </View>
                {draft.hqLocation ? (
                  <Text className="text-caption text-textSecondary">
                    {draft.hqLocation}
                  </Text>
                ) : null}
                {draft.website ? (
                  <Text className="text-caption text-accent">
                    {draft.website}
                  </Text>
                ) : null}
              </View>

              {/* Offerings */}
              {draft.offerings.length > 0 && (
                <View className="gap-2">
                  <Text className="text-captionMedium text-textMuted uppercase tracking-wider">
                    Offerings
                  </Text>
                  <View className="flex-row flex-wrap gap-1.5">
                    {draft.offerings.map((tag) => (
                      <Pill key={tag} label={tag} variant="accent" />
                    ))}
                  </View>
                </View>
              )}

              {/* Needs */}
              {draft.needs.length > 0 && (
                <View className="gap-2">
                  <Text className="text-captionMedium text-textMuted uppercase tracking-wider">
                    Looking For
                  </Text>
                  <View className="flex-row flex-wrap gap-1.5">
                    {draft.needs.map((tag) => (
                      <Pill key={tag} label={tag} variant="primary" />
                    ))}
                  </View>
                </View>
              )}

              {/* Deal Prefs */}
              {(draft.geographies.length > 0 || draft.engagementModels.length > 0) && (
                <View className="gap-2">
                  <Text className="text-captionMedium text-textMuted uppercase tracking-wider">
                    Preferences
                  </Text>
                  {draft.geographies.length > 0 && (
                    <View className="flex-row flex-wrap gap-1.5">
                      {draft.geographies.map((geo) => (
                        <Pill key={geo} label={geo} variant="muted" />
                      ))}
                    </View>
                  )}
                  {draft.engagementModels.length > 0 && (
                    <View className="flex-row flex-wrap gap-1.5">
                      {draft.engagementModels.map((m) => (
                        <Pill key={m} label={m} variant="muted" />
                      ))}
                    </View>
                  )}
                </View>
              )}
            </View>

            {/* Form-level error */}
            {errors._form && (
              <View className="bg-error/10 rounded-button px-4 py-3">
                <Text className="text-caption text-error">{errors._form}</Text>
              </View>
            )}
          </View>
        </ScrollView>

        {/* Bottom CTAs */}
        <View className="px-6 pb-4 pt-2 border-t border-borderLight bg-bgBase flex-row gap-3">
          <Pressable
            className="flex-1 border border-borderMedium rounded-button py-4 items-center"
            onPress={prevStep}
            disabled={isSubmitting}
          >
            <Text className="text-bodyMedium text-textPrimary font-medium">
              Back
            </Text>
          </Pressable>
          <Pressable
            className={`flex-[2] rounded-button py-4 items-center ${
              isSubmitting ? 'bg-accent/60' : 'bg-accent'
            }`}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text className="text-bodyMedium text-textInverse font-semibold">
                Complete Profile
              </Text>
            )}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
