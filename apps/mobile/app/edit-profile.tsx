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
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, Save } from 'lucide-react-native';
import { Input, Pill, SectionHeader } from '@/components/ui';
import { useCompanyStore } from '@/stores';
import { companyService } from '@/services';
import type { EngagementModel } from '@/models';
import {
  INDUSTRIES,
  EMPLOYEE_RANGES,
  ENGAGEMENT_MODELS,
  GEOGRAPHIES,
  DEAL_SIZE_OPTIONS,
} from '@/models/onboardingSchemas';

export default function EditProfileScreen() {
  const router = useRouter();
  const { company, setCompany } = useCompanyStore();

  const [form, setForm] = useState({
    legalName: company?.legalName ?? '',
    website: company?.website ?? '',
    industry: company?.industry ?? '',
    employeeRange: company?.employeeRange ?? '',
    hqLocation: company?.hqLocation ?? '',
    description: company?.description ?? '',
    offeringSummary: company?.offeringSummary ?? '',
    offerings: company?.offerings ?? [],
    needsSummary: company?.needsSummary ?? '',
    needs: company?.needs ?? [],
    dealSizeMin: company?.dealSizeMin,
    dealSizeMax: company?.dealSizeMax,
    geographies: company?.geographies ?? [],
    engagementModels: (company?.engagementModels ?? []) as string[],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [offeringInput, setOfferingInput] = useState('');
  const [needInput, setNeedInput] = useState('');
  const [showIndustryPicker, setShowIndustryPicker] = useState(false);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => { const n = { ...prev }; delete n[key]; return n; });
  }

  function addOffering(tag: string) {
    const t = tag.trim();
    if (t && !form.offerings.includes(t)) {
      update('offerings', [...form.offerings, t]);
    }
    setOfferingInput('');
  }

  function addNeed(tag: string) {
    const t = tag.trim();
    if (t && !form.needs.includes(t)) {
      update('needs', [...form.needs, t]);
    }
    setNeedInput('');
  }

  function toggleGeography(geo: string) {
    const updated = form.geographies.includes(geo)
      ? form.geographies.filter((g) => g !== geo)
      : [...form.geographies, geo];
    update('geographies', updated);
  }

  function toggleEngagement(model: string) {
    const updated = form.engagementModels.includes(model)
      ? form.engagementModels.filter((m) => m !== model)
      : [...form.engagementModels, model];
    update('engagementModels', updated);
  }

  function formatDealSize(value?: number): string {
    if (value === undefined) return 'Any';
    if (value >= 1000000) return `$${value / 1000000}M`;
    if (value >= 1000) return `$${value / 1000}K`;
    return `$${value}`;
  }

  function validate(): boolean {
    const newErrors: Record<string, string> = {};
    if (!form.legalName.trim() || form.legalName.length < 2) {
      newErrors.legalName = 'Company name must be at least 2 characters';
    }
    if (!form.industry) newErrors.industry = 'Please select an industry';
    if (!form.hqLocation.trim()) newErrors.hqLocation = 'HQ location is required';
    if (!form.description.trim() || form.description.length < 20) {
      newErrors.description = 'Description must be at least 20 characters';
    }
    if (form.offerings.length === 0) newErrors.offerings = 'Add at least one offering tag';
    if (form.needs.length === 0) newErrors.needs = 'Add at least one need tag';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSave() {
    if (!validate() || !company) return;
    setIsSaving(true);
    try {
      const updated = await companyService.createCompany({
        ...company,
        legalName: form.legalName,
        brandName: form.legalName,
        website: form.website || undefined,
        industry: form.industry,
        employeeRange: form.employeeRange as never,
        hqLocation: form.hqLocation,
        description: form.description,
        offeringSummary: form.offeringSummary,
        offerings: form.offerings,
        needsSummary: form.needsSummary,
        needs: form.needs,
        dealSizeMin: form.dealSizeMin,
        dealSizeMax: form.dealSizeMax,
        geographies: form.geographies,
        engagementModels: form.engagementModels as EngagementModel[],
      });
      setCompany({ ...updated, id: company.id, createdAt: company.createdAt });
      router.back();
    } catch {
      setErrors({ _form: 'Failed to save. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-bgBase">
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Nav Bar */}
        <View className="flex-row items-center justify-between px-5 py-3 border-b border-borderLight bg-bgBase">
          <Pressable onPress={() => router.back()} className="p-1">
            <ArrowLeft size={22} color="#0F172A" />
          </Pressable>
          <Text className="text-bodyMedium text-textPrimary font-semibold">Edit Profile</Text>
          <Pressable
            className={`flex-row items-center gap-1.5 rounded-button px-4 py-2 ${isSaving ? 'bg-accent/50' : 'bg-accent'}`}
            onPress={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Save size={14} color="#fff" />
                <Text className="text-captionMedium text-textInverse font-semibold">Save</Text>
              </>
            )}
          </Pressable>
        </View>

        <ScrollView
          contentContainerStyle={{ paddingBottom: 48 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Form Error */}
          {errors._form && (
            <View className="mx-5 mt-4 bg-error/10 rounded-button px-4 py-3">
              <Text className="text-caption text-error">{errors._form}</Text>
            </View>
          )}

          {/* ── Section: Company Basics ── */}
          <View className="px-5 pt-5 gap-4">
            <SectionHeader title="Company Basics" />

            <Input
              label="Company Name *"
              placeholder="Acme Corporation"
              value={form.legalName}
              onChangeText={(v) => update('legalName', v)}
              error={errors.legalName}
              autoCapitalize="words"
            />

            <Input
              label="Website"
              placeholder="https://example.com"
              value={form.website}
              onChangeText={(v) => update('website', v)}
              error={errors.website}
              keyboardType="url"
              autoCapitalize="none"
              autoCorrect={false}
            />

            {/* Industry */}
            <View className="gap-1.5">
              <Text className="text-captionMedium text-textSecondary">Industry *</Text>
              <Pressable
                className={`bg-bgSurface border rounded-button px-4 h-12 justify-center ${errors.industry ? 'border-error' : 'border-borderMedium'}`}
                onPress={() => setShowIndustryPicker(!showIndustryPicker)}
              >
                <Text className={form.industry ? 'text-body text-textPrimary' : 'text-body text-textMuted'}>
                  {form.industry || 'Select an industry'}
                </Text>
              </Pressable>
              {errors.industry && <Text className="text-small text-error">{errors.industry}</Text>}
              {showIndustryPicker && (
                <View className="bg-bgSurface border border-borderLight rounded-card p-3 gap-2">
                  <View className="flex-row flex-wrap gap-2">
                    {INDUSTRIES.map((ind) => (
                      <Pill
                        key={ind}
                        label={ind}
                        selected={form.industry === ind}
                        variant="primary"
                        onPress={() => { update('industry', ind); setShowIndustryPicker(false); }}
                      />
                    ))}
                  </View>
                </View>
              )}
            </View>

            {/* Employee Range */}
            <View className="gap-1.5">
              <Text className="text-captionMedium text-textSecondary">Company Size</Text>
              <View className="flex-row flex-wrap gap-2">
                {EMPLOYEE_RANGES.map((range) => (
                  <Pill
                    key={range}
                    label={`${range} employees`}
                    selected={form.employeeRange === range}
                    variant="primary"
                    onPress={() => update('employeeRange', range)}
                  />
                ))}
              </View>
            </View>

            <Input
              label="HQ Location *"
              placeholder="San Francisco, CA"
              value={form.hqLocation}
              onChangeText={(v) => update('hqLocation', v)}
              error={errors.hqLocation}
              autoCapitalize="words"
            />
          </View>

          {/* ── Section: Description ── */}
          <View className="px-5 pt-6 gap-3">
            <SectionHeader title="Company Description" />
            <View className={`bg-bgSurface border rounded-button px-4 py-3 ${errors.description ? 'border-error' : 'border-borderMedium'}`}>
              <TextInput
                className="text-body text-textPrimary min-h-[80px]"
                placeholder="Describe your company, mission, and what makes it unique..."
                placeholderTextColor="#94A3B8"
                multiline
                textAlignVertical="top"
                value={form.description}
                onChangeText={(v) => update('description', v)}
                maxLength={1000}
              />
            </View>
            <Text className="text-small text-textMuted text-right">{form.description.length}/1000</Text>
            {errors.description && <Text className="text-small text-error">{errors.description}</Text>}
          </View>

          {/* ── Section: Offerings ── */}
          <View className="px-5 pt-6 gap-3">
            <SectionHeader title="What You Offer" />

            <View className={`bg-bgSurface border rounded-button px-4 py-3 ${errors.offeringSummary ? 'border-error' : 'border-borderMedium'}`}>
              <TextInput
                className="text-body text-textPrimary min-h-[60px]"
                placeholder="Summarise your core offerings..."
                placeholderTextColor="#94A3B8"
                multiline
                textAlignVertical="top"
                value={form.offeringSummary}
                onChangeText={(v) => update('offeringSummary', v)}
                maxLength={500}
              />
            </View>

            {form.offerings.length > 0 && (
              <View className="flex-row flex-wrap gap-1.5">
                {form.offerings.map((tag) => (
                  <Pill
                    key={tag}
                    label={tag}
                    variant="accent"
                    selected
                    onRemove={() => update('offerings', form.offerings.filter((o) => o !== tag))}
                  />
                ))}
              </View>
            )}
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
              {offeringInput.trim() ? (
                <Pressable onPress={() => addOffering(offeringInput)} className="bg-accent rounded-pill px-3 py-1">
                  <Text className="text-caption text-textInverse font-medium">Add</Text>
                </Pressable>
              ) : null}
            </View>
            {errors.offerings && <Text className="text-small text-error">{errors.offerings}</Text>}
          </View>

          {/* ── Section: Needs ── */}
          <View className="px-5 pt-6 gap-3">
            <SectionHeader title="What You Need" />

            <View className="bg-bgSurface border border-borderMedium rounded-button px-4 py-3">
              <TextInput
                className="text-body text-textPrimary min-h-[60px]"
                placeholder="Summarise what you're looking for..."
                placeholderTextColor="#94A3B8"
                multiline
                textAlignVertical="top"
                value={form.needsSummary}
                onChangeText={(v) => update('needsSummary', v)}
                maxLength={500}
              />
            </View>

            {form.needs.length > 0 && (
              <View className="flex-row flex-wrap gap-1.5">
                {form.needs.map((tag) => (
                  <Pill
                    key={tag}
                    label={tag}
                    variant="primary"
                    selected
                    onRemove={() => update('needs', form.needs.filter((n) => n !== tag))}
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
              {needInput.trim() ? (
                <Pressable onPress={() => addNeed(needInput)} className="bg-primary rounded-pill px-3 py-1">
                  <Text className="text-caption text-textInverse font-medium">Add</Text>
                </Pressable>
              ) : null}
            </View>
            {errors.needs && <Text className="text-small text-error">{errors.needs}</Text>}
          </View>

          {/* ── Section: Deal Preferences ── */}
          <View className="px-5 pt-6 gap-4">
            <SectionHeader title="Deal Preferences" />

            {/* Deal Size */}
            <View className="gap-2">
              <Text className="text-captionMedium text-textSecondary">
                Minimum: {formatDealSize(form.dealSizeMin)}
              </Text>
              <View className="flex-row flex-wrap gap-1.5">
                {DEAL_SIZE_OPTIONS.map((opt) => (
                  <Pill
                    key={`min-${opt.value}`}
                    label={opt.label}
                    selected={form.dealSizeMin === opt.value}
                    variant="primary"
                    onPress={() => update('dealSizeMin', opt.value)}
                  />
                ))}
              </View>
            </View>
            <View className="gap-2">
              <Text className="text-captionMedium text-textSecondary">
                Maximum: {formatDealSize(form.dealSizeMax)}
              </Text>
              <View className="flex-row flex-wrap gap-1.5">
                {DEAL_SIZE_OPTIONS.map((opt) => (
                  <Pill
                    key={`max-${opt.value}`}
                    label={opt.label}
                    selected={form.dealSizeMax === opt.value}
                    variant="primary"
                    onPress={() => update('dealSizeMax', opt.value)}
                  />
                ))}
              </View>
            </View>

            {/* Geographies */}
            <View className="gap-2">
              <Text className="text-captionMedium text-textSecondary">Target Geographies</Text>
              <View className="flex-row flex-wrap gap-2">
                {GEOGRAPHIES.map((geo) => (
                  <Pill
                    key={geo}
                    label={geo}
                    selected={form.geographies.includes(geo)}
                    variant="accent"
                    onPress={() => toggleGeography(geo)}
                  />
                ))}
              </View>
            </View>

            {/* Engagement Models */}
            <View className="gap-2">
              <Text className="text-captionMedium text-textSecondary">Engagement Models</Text>
              <View className="flex-row flex-wrap gap-2">
                {ENGAGEMENT_MODELS.map((model) => (
                  <Pill
                    key={model.value}
                    label={model.label}
                    selected={form.engagementModels.includes(model.value)}
                    variant="primary"
                    onPress={() => toggleEngagement(model.value)}
                  />
                ))}
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
