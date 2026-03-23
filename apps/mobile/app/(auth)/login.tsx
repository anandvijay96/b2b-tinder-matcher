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
import { DEMO_MODE, DEMO_OTP_CODE } from '@/constants';
import { useAuthStore, useCompanyStore } from '@/stores';

type AuthStep = 'landing' | 'email' | 'otp';
type AuthMode = 'signup' | 'signin';

export default function LoginScreen() {
  const { requestOtp, verifyOtp, loginWithLinkedIn, devBypass, isLoading, error, clearError } = useAuthStore();
  const { completeOnboarding } = useCompanyStore();

  const [step, setStep] = useState<AuthStep>('landing');
  const [mode, setMode] = useState<AuthMode>('signup');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [emailError, setEmailError] = useState('');

  function switchMode(newMode: AuthMode) {
    clearError();
    setEmailError('');
    setEmail('');
    setOtp('');
    setStep('landing');
    setMode(newMode);
  }

  function validateEmail(value: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(value);
  }

  async function handleSkipAll() {
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
                  {/* Sign Up / Sign In toggle */}
                  <View className="flex-row bg-bgBase rounded-xl p-1">
                    <Pressable
                      className={`flex-1 py-2.5 rounded-lg items-center ${mode === 'signup' ? 'bg-primary' : ''}`}
                      onPress={() => switchMode('signup')}
                    >
                      <Text className={`text-captionMedium font-semibold ${mode === 'signup' ? 'text-textInverse' : 'text-textMuted'}`}>
                        Sign Up
                      </Text>
                    </Pressable>
                    <Pressable
                      className={`flex-1 py-2.5 rounded-lg items-center ${mode === 'signin' ? 'bg-primary' : ''}`}
                      onPress={() => switchMode('signin')}
                    >
                      <Text className={`text-captionMedium font-semibold ${mode === 'signin' ? 'text-textInverse' : 'text-textMuted'}`}>
                        Sign In
                      </Text>
                    </Pressable>
                  </View>

                  <View className="gap-1">
                    {mode === 'signup' ? (
                      <>
                        <Text className="text-heading3 text-textPrimary font-semibold">
                          Create your account
                        </Text>
                        <Text className="text-caption text-textMuted">
                          Set up your company profile and start discovering B2B partners.
                        </Text>
                      </>
                    ) : (
                      <>
                        <Text className="text-heading3 text-textPrimary font-semibold">
                          Welcome back
                        </Text>
                        <Text className="text-caption text-textMuted">
                          Sign in to continue discovering business partners.
                        </Text>
                      </>
                    )}
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
                        {mode === 'signup' ? 'Sign up with LinkedIn' : 'Continue with LinkedIn'}
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
                      {mode === 'signup' ? 'Sign up with Email' : 'Sign in with Email OTP'}
                    </Text>
                  </Pressable>

                  {DEMO_MODE && (
                    <View className="bg-accent-light rounded-xl p-3 mt-1">
                      <Text className="text-caption text-accent-dark text-center font-medium">
                        Demo Mode
                      </Text>
                      <Text className="text-small text-accent-dark/70 text-center mt-0.5">
                        {mode === 'signup'
                          ? `Use LinkedIn or Email (code: ${DEMO_OTP_CODE}) — onboarding follows.`
                          : `OTP code: ${DEMO_OTP_CODE}`}
                      </Text>
                    </View>
                  )}

                  {/* Dev-only skip — tiny and unobtrusive */}
                  <Pressable
                    className="py-1.5 items-center opacity-40"
                    onPress={handleSkipAll}
                  >
                    <Text className="text-small text-textMuted">
                      Skip to app →
                    </Text>
                  </Pressable>
                </>
              )}

              {/* Step: Email input */}
              {step === 'email' && (
                <>
                  <View className="gap-1">
                    <Text className="text-heading3 text-textPrimary font-semibold">
                      {mode === 'signup' ? 'Your business email' : 'Enter your email'}
                    </Text>
                    <Text className="text-caption text-textMuted">
                      {mode === 'signup'
                        ? "We'll send a one-time code, then guide you through setting up your profile."
                        : "We'll send a one-time code to your business email."}
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
                    {DEMO_MODE && (
                      <Text className="text-caption text-accent font-medium">
                        Demo code: {DEMO_OTP_CODE}
                      </Text>
                    )}
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
