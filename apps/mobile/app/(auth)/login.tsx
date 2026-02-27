import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { KeyboardAvoidingWrapper } from '@/components/ui';
import { useAuthStore, useCompanyStore } from '@/stores';

type AuthStep = 'landing' | 'email' | 'otp';

export default function LoginScreen() {
  const { requestOtp, verifyOtp, loginWithLinkedIn, devBypass, isLoading, error, clearError } = useAuthStore();
  const { completeOnboarding } = useCompanyStore();

  const [step, setStep] = useState<AuthStep>('landing');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [emailError, setEmailError] = useState('');

  function validateEmail(value: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(value);
  }

  async function handleDevBypass() {
    const mockCompany = {
      id: 'dev-company-001',
      legalName: 'NMQ Demo Corp',
      brandName: 'NMQ Demo',
      website: 'https://nmqdemo.com',
      logoUrl: '',
      hqLocation: 'San Francisco, CA',
      industry: 'Technology',
      employeeRange: '51-200' as const,
      description: 'Demo company for prototype walkthrough',
      offerings: ['SaaS Platform', 'AI Consulting', 'Cloud Infrastructure'],
      needs: ['Sales Partners', 'Marketing Agency', 'Legal Counsel'],
      offeringSummary: 'Enterprise SaaS platform with AI-driven analytics and cloud infrastructure solutions.',
      needsSummary: 'Looking for strategic sales partners and marketing agencies to accelerate growth.',
      dealSizeMin: 50000,
      dealSizeMax: 500000,
      geographies: ['North America', 'Europe'],
      engagementModels: ['project-based' as const, 'retainer' as const],
      certifications: ['SOC 2', 'ISO 27001'],
      verificationStatus: 'verified' as const,
      verificationBadges: ['identity-verified' as const, 'documents-verified' as const],
      responseSpeed: 'fast' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await completeOnboarding(mockCompany);
    devBypass();
  }

  async function handleLinkedIn() {
    clearError();
    await loginWithLinkedIn();
  }

  async function handleSendOtp() {
    clearError();
    setEmailError('');
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid business email address.');
      return;
    }
    const success = await requestOtp(email);
    if (success) {
      setStep('otp');
    }
  }

  async function handleVerifyOtp() {
    clearError();
    if (otp.length < 6) return;
    await verifyOtp(email, otp);
  }

  function handleBack() {
    clearError();
    setEmailError('');
    setOtp('');
    if (step === 'otp') {
      setStep('email');
    } else {
      setStep('landing');
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <StatusBar style="light" />
      <KeyboardAvoidingWrapper withScroll>
          <View className="flex-1 px-8 pt-16 pb-8 justify-between">

            {/* Header */}
            <View className="items-center mb-10">
              <View className="w-16 h-16 rounded-2xl bg-white/15 items-center justify-center mb-4">
                <Text className="text-3xl font-bold text-textInverse">N</Text>
              </View>
              <Text className="text-heading1 font-bold text-textInverse tracking-tight">
                NMQ B2B Match
              </Text>
              <Text className="text-body text-textInverse/70 mt-2 text-center leading-relaxed">
                AI-powered B2B partner discovery
              </Text>
            </View>

            {/* Content Card */}
            <View className="bg-bgSurface rounded-2xl p-6 gap-5">

              {/* Step: Landing — choose auth method */}
              {step === 'landing' && (
                <>
                  <View className="gap-1">
                    <Text className="text-heading3 text-textPrimary font-semibold">
                      Welcome back
                    </Text>
                    <Text className="text-caption text-textMuted">
                      Sign in to discover your next business partner.
                    </Text>
                  </View>

                  {error && (
                    <View className="bg-error/10 rounded-button px-4 py-3">
                      <Text className="text-caption text-error">{error}</Text>
                    </View>
                  )}

                  {/* LinkedIn */}
                  <Pressable
                    className="bg-[#0A66C2] rounded-button py-4 px-6 flex-row items-center justify-center gap-3"
                    onPress={handleLinkedIn}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <Text className="text-bodyMedium text-textInverse font-semibold">
                        Continue with LinkedIn
                      </Text>
                    )}
                  </Pressable>

                  {/* Divider */}
                  <View className="flex-row items-center gap-3">
                    <View className="flex-1 h-px bg-borderLight" />
                    <Text className="text-caption text-textMuted">or</Text>
                    <View className="flex-1 h-px bg-borderLight" />
                  </View>

                  {/* Email OTP */}
                  <Pressable
                    className="border border-borderMedium rounded-button py-4 px-6 items-center"
                    onPress={() => setStep('email')}
                    disabled={isLoading}
                  >
                    <Text className="text-bodyMedium text-textPrimary font-medium">
                      Sign in with Email OTP
                    </Text>
                  </Pressable>

                  {/* Dev Bypass — skip auth for demo/prototyping (remove before production) */}
                  <View className="flex-row items-center gap-3">
                    <View className="flex-1 h-px bg-borderLight" />
                    <Text className="text-caption text-textMuted">demo</Text>
                    <View className="flex-1 h-px bg-borderLight" />
                  </View>
                  <Pressable
                    className="border border-dashed border-warning rounded-button py-3 px-6 items-center bg-warning/10"
                    onPress={handleDevBypass}
                  >
                    <Text className="text-bodyMedium text-warning font-semibold">
                      Skip Login (Demo)
                    </Text>
                  </Pressable>
                </>
              )}

              {/* Step: Email input */}
              {step === 'email' && (
                <>
                  <View className="gap-1">
                    <Text className="text-heading3 text-textPrimary font-semibold">
                      Enter your email
                    </Text>
                    <Text className="text-caption text-textMuted">
                      We'll send a one-time code to your business email.
                    </Text>
                  </View>

                  {error && (
                    <View className="bg-error/10 rounded-button px-4 py-3">
                      <Text className="text-caption text-error">{error}</Text>
                    </View>
                  )}

                  <View className="gap-1.5">
                    <Text className="text-captionMedium text-textSecondary">
                      Business email
                    </Text>
                    <View
                      className={`flex-row items-center bg-bgSurface border rounded-button px-4 h-12 ${
                        emailError ? 'border-error' : 'border-borderMedium'
                      }`}
                    >
                      <TextInput
                        className="flex-1 text-body text-textPrimary"
                        placeholder="you@company.com"
                        placeholderTextColor="#94A3B8"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        autoFocus
                        value={email}
                        onChangeText={(v) => {
                          setEmail(v);
                          if (emailError) setEmailError('');
                        }}
                        onSubmitEditing={handleSendOtp}
                      />
                    </View>
                    {emailError && (
                      <Text className="text-small text-error">{emailError}</Text>
                    )}
                  </View>

                  <Pressable
                    className={`rounded-button py-4 px-6 items-center ${
                      email.length > 0 ? 'bg-primary' : 'bg-primary/40'
                    }`}
                    onPress={handleSendOtp}
                    disabled={isLoading || email.length === 0}
                  >
                    {isLoading ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <Text className="text-bodyMedium text-textInverse font-semibold">
                        Send Code
                      </Text>
                    )}
                  </Pressable>

                  <Pressable onPress={handleBack} className="items-center py-1">
                    <Text className="text-caption text-textMuted">← Back</Text>
                  </Pressable>
                </>
              )}

              {/* Step: OTP verification */}
              {step === 'otp' && (
                <>
                  <View className="gap-1">
                    <Text className="text-heading3 text-textPrimary font-semibold">
                      Check your email
                    </Text>
                    <Text className="text-caption text-textMuted">
                      We sent a 6-digit code to{' '}
                      <Text className="font-medium text-textSecondary">{email}</Text>
                    </Text>
                  </View>

                  {error && (
                    <View className="bg-error/10 rounded-button px-4 py-3">
                      <Text className="text-caption text-error">{error}</Text>
                    </View>
                  )}

                  <View className="gap-1.5">
                    <Text className="text-captionMedium text-textSecondary">
                      One-time code
                    </Text>
                    <View className="flex-row items-center bg-bgSurface border border-borderMedium rounded-button px-4 h-14">
                      <TextInput
                        className="flex-1 text-heading2 text-textPrimary tracking-widest text-center"
                        placeholder="• • • • • •"
                        placeholderTextColor="#94A3B8"
                        keyboardType="number-pad"
                        maxLength={6}
                        autoFocus
                        value={otp}
                        onChangeText={setOtp}
                      />
                    </View>
                  </View>

                  <Pressable
                    className={`rounded-button py-4 px-6 items-center ${
                      otp.length >= 6 ? 'bg-primary' : 'bg-primary/40'
                    }`}
                    onPress={handleVerifyOtp}
                    disabled={isLoading || otp.length < 6}
                  >
                    {isLoading ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <Text className="text-bodyMedium text-textInverse font-semibold">
                        Verify & Sign In
                      </Text>
                    )}
                  </Pressable>

                  <View className="flex-row items-center justify-center gap-1">
                    <Text className="text-caption text-textMuted">
                      Didn't receive it?
                    </Text>
                    <Pressable onPress={() => requestOtp(email)} disabled={isLoading}>
                      <Text className="text-caption text-accent font-medium">
                        Resend code
                      </Text>
                    </Pressable>
                  </View>

                  <Pressable onPress={handleBack} className="items-center py-1">
                    <Text className="text-caption text-textMuted">← Back</Text>
                  </Pressable>
                </>
              )}
            </View>

            {/* Footer */}
            <Text className="text-small text-textInverse/50 text-center mt-6 px-4">
              By continuing, you agree to NMQ's{' '}
              <Text className="text-textInverse/70">Terms of Service</Text>
              {' '}and{' '}
              <Text className="text-textInverse/70">Privacy Policy</Text>
            </Text>
          </View>
      </KeyboardAvoidingWrapper>
    </SafeAreaView>
  );
}
