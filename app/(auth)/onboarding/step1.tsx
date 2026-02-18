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

import { Input, Pill } from '@/components/ui';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useOnboarding } from '@/hooks/useOnboarding';
import {
  INDUSTRIES,
  EMPLOYEE_RANGES,
} from '@/models/onboardingSchemas';

export default function OnboardingStep1() {
  const { draft, updateDraft, nextStep, totalSteps } = useOnboarding();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showIndustryPicker, setShowIndustryPicker] = useState(false);

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

  return (
    <SafeAreaView className="flex-1 bg-bgBase">
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View className="px-6 pt-4 pb-2">
          <ProgressBar currentStep={1} totalSteps={totalSteps} />
        </View>

        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 32 }}
          keyboardShouldPersistTaps="handled"
          className="px-6"
        >
          {/* Header */}
          <View className="mt-4 mb-6">
            <Text className="text-heading2 text-textPrimary font-semibold">
              Company Basics
            </Text>
            <Text className="text-body text-textSecondary mt-1">
              Let's start with the essentials about your business.
            </Text>
          </View>

          {/* Form Fields */}
          <View className="gap-5">
            {/* Company Name */}
            <Input
              label="Company Name *"
              placeholder="Acme Corporation"
              value={draft.legalName}
              onChangeText={(v) => {
                updateDraft({ legalName: v });
                clearFieldError('legalName');
              }}
              error={errors.legalName}
              autoCapitalize="words"
            />

            {/* Website */}
            <Input
              label="Website"
              placeholder="https://example.com"
              value={draft.website}
              onChangeText={(v) => {
                updateDraft({ website: v });
                clearFieldError('website');
              }}
              error={errors.website}
              keyboardType="url"
              autoCapitalize="none"
              autoCorrect={false}
            />

            {/* Industry Selector */}
            <View className="gap-1.5">
              <Text className="text-captionMedium text-textSecondary">
                Industry *
              </Text>
              <Pressable
                className={`bg-bgSurface border rounded-button px-4 h-12 justify-center ${
                  errors.industry ? 'border-error' : 'border-borderMedium'
                }`}
                onPress={() => setShowIndustryPicker(!showIndustryPicker)}
              >
                <Text
                  className={
                    draft.industry
                      ? 'text-body text-textPrimary'
                      : 'text-body text-textMuted'
                  }
                >
                  {draft.industry || 'Select an industry'}
                </Text>
              </Pressable>
              {errors.industry && (
                <Text className="text-small text-error">{errors.industry}</Text>
              )}

              {showIndustryPicker && (
                <View className="bg-bgSurface border border-borderLight rounded-card p-3 gap-2 mt-1">
                  <View className="flex-row flex-wrap gap-2">
                    {INDUSTRIES.map((ind) => (
                      <Pill
                        key={ind}
                        label={ind}
                        selected={draft.industry === ind}
                        variant="primary"
                        onPress={() => {
                          updateDraft({ industry: ind });
                          clearFieldError('industry');
                          setShowIndustryPicker(false);
                        }}
                      />
                    ))}
                  </View>
                </View>
              )}
            </View>

            {/* Employee Range */}
            <View className="gap-1.5">
              <Text className="text-captionMedium text-textSecondary">
                Company Size *
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {EMPLOYEE_RANGES.map((range) => (
                  <Pill
                    key={range}
                    label={`${range} employees`}
                    selected={draft.employeeRange === range}
                    variant="primary"
                    onPress={() => {
                      updateDraft({ employeeRange: range });
                      clearFieldError('employeeRange');
                    }}
                  />
                ))}
              </View>
              {errors.employeeRange && (
                <Text className="text-small text-error">
                  {errors.employeeRange}
                </Text>
              )}
            </View>

            {/* HQ Location */}
            <Input
              label="HQ Location *"
              placeholder="San Francisco, CA"
              value={draft.hqLocation}
              onChangeText={(v) => {
                updateDraft({ hqLocation: v });
                clearFieldError('hqLocation');
              }}
              error={errors.hqLocation}
              autoCapitalize="words"
            />
          </View>
        </ScrollView>

        {/* Bottom CTA */}
        <View className="px-6 pb-4 pt-2 border-t border-borderLight bg-bgBase">
          <Pressable
            className="bg-primary rounded-button py-4 items-center"
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
