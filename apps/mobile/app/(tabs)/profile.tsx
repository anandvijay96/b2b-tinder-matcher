import { ScrollView, Text, Pressable, View, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MapPin, Globe, Users, Edit3, LogOut, CheckCircle, Briefcase } from 'lucide-react-native';
import { Avatar, Badge, Pill, SectionHeader } from '@/components/ui';
import { useAuthStore, useCompanyStore } from '@/stores';

export default function ProfileScreen() {
  const router = useRouter();
  const { logout } = useAuthStore();
  const { company } = useCompanyStore();

  function handleLogout() {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: () => logout(),
      },
    ]);
  }

  if (!company) {
    return (
      <SafeAreaView className="flex-1 bg-bgBase items-center justify-center" edges={['top']}>
        <Text className="text-body text-textSecondary">No profile found.</Text>
      </SafeAreaView>
    );
  }

  const isVerified = company.verificationBadges.length > 0;

  return (
    <SafeAreaView className="flex-1 bg-bgBase" edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-5 pt-3 pb-4">
          <Text className="text-heading3 text-textPrimary font-bold">Profile</Text>
          <Pressable
            className="flex-row items-center gap-2 bg-primary-light rounded-pill px-4 py-2"
            onPress={() => router.push('/edit-profile' as never)}
          >
            <Edit3 size={14} color="#1E3A5F" />
            <Text className="text-captionMedium text-primary font-semibold">Edit</Text>
          </Pressable>
        </View>

        {/* Company Card */}
        <View className="mx-5 bg-primary rounded-2xl p-5 gap-4">
          <View className="flex-row items-start gap-4">
            <Avatar
              initials={company.brandName.slice(0, 2).toUpperCase()}
              size="xl"
              imageUri={company.logoUrl}
            />
            <View className="flex-1 gap-1">
              <Text className="text-heading3 text-textInverse font-bold" numberOfLines={1}>
                {company.brandName}
              </Text>
              {company.legalName !== company.brandName && (
                <Text className="text-small text-textInverse/70">{company.legalName}</Text>
              )}
              <View className="flex-row flex-wrap gap-2 mt-1">
                <Badge variant="info">{company.industry}</Badge>
                {isVerified && (
                  <View className="flex-row items-center gap-1 bg-white/20 rounded-pill px-2 py-0.5">
                    <CheckCircle size={11} color="#CCFBF1" />
                    <Text className="text-small text-accent-light font-medium">Verified</Text>
                  </View>
                )}
              </View>
            </View>
          </View>

          {/* Meta row */}
          <View className="flex-row flex-wrap gap-4">
            {company.hqLocation ? (
              <View className="flex-row items-center gap-1.5">
                <MapPin size={13} color="rgba(255,255,255,0.7)" />
                <Text className="text-caption text-textInverse/80">{company.hqLocation}</Text>
              </View>
            ) : null}
            {company.employeeRange ? (
              <View className="flex-row items-center gap-1.5">
                <Users size={13} color="rgba(255,255,255,0.7)" />
                <Text className="text-caption text-textInverse/80">{company.employeeRange} employees</Text>
              </View>
            ) : null}
            {company.website ? (
              <View className="flex-row items-center gap-1.5">
                <Globe size={13} color="rgba(255,255,255,0.7)" />
                <Text className="text-caption text-accentLight" numberOfLines={1}>
                  {company.website.replace(/^https?:\/\//, '')}
                </Text>
              </View>
            ) : null}
          </View>
        </View>

        {/* Description */}
        {company.description ? (
          <View className="mx-5 mt-4">
            <SectionHeader title="About" />
            <Text className="text-body text-textSecondary mt-2 leading-relaxed">
              {company.description}
            </Text>
          </View>
        ) : null}

        {/* Offerings */}
        {company.offerings.length > 0 && (
          <View className="mx-5 mt-5">
            <SectionHeader title="What We Offer" />
            {company.offeringSummary ? (
              <Text className="text-caption text-textSecondary mt-1 mb-3">
                {company.offeringSummary}
              </Text>
            ) : null}
            <View className="flex-row flex-wrap gap-2">
              {company.offerings.map((tag) => (
                <Pill key={tag} label={tag} variant="accent" />
              ))}
            </View>
          </View>
        )}

        {/* Needs */}
        {company.needs.length > 0 && (
          <View className="mx-5 mt-5">
            <SectionHeader title="What We Need" />
            {company.needsSummary ? (
              <Text className="text-caption text-textSecondary mt-1 mb-3">
                {company.needsSummary}
              </Text>
            ) : null}
            <View className="flex-row flex-wrap gap-2">
              {company.needs.map((tag) => (
                <Pill key={tag} label={tag} variant="primary" />
              ))}
            </View>
          </View>
        )}

        {/* Deal Preferences */}
        {(company.geographies.length > 0 || company.engagementModels.length > 0) && (
          <View className="mx-5 mt-5">
            <SectionHeader title="Deal Preferences" />
            <View className="mt-3 gap-3">
              {company.geographies.length > 0 && (
                <View className="gap-1.5">
                  <Text className="text-captionMedium text-textMuted uppercase tracking-wider text-xs">
                    Geographies
                  </Text>
                  <View className="flex-row flex-wrap gap-1.5">
                    {company.geographies.map((g) => (
                      <Pill key={g} label={g} variant="muted" />
                    ))}
                  </View>
                </View>
              )}
              {company.engagementModels.length > 0 && (
                <View className="gap-1.5">
                  <Text className="text-captionMedium text-textMuted uppercase tracking-wider text-xs">
                    Engagement Models
                  </Text>
                  <View className="flex-row flex-wrap gap-1.5">
                    {company.engagementModels.map((m) => (
                      <Pill key={m} label={m} variant="muted" />
                    ))}
                  </View>
                </View>
              )}
              {(company.dealSizeMin !== undefined || company.dealSizeMax !== undefined) && (
                <View className="flex-row items-center gap-2 bg-bgSurface rounded-xl px-4 py-3 border border-borderLight">
                  <Briefcase size={16} color="#475569" />
                  <Text className="text-captionMedium text-textSecondary">
                    Deal size:{' '}
                    <Text className="text-textPrimary font-semibold">
                      {company.dealSizeMin !== undefined
                        ? `$${company.dealSizeMin >= 1000000 ? `${company.dealSizeMin / 1000000}M` : `${company.dealSizeMin / 1000}K`}`
                        : 'Any'}
                      {' – '}
                      {company.dealSizeMax !== undefined
                        ? `$${company.dealSizeMax >= 1000000 ? `${company.dealSizeMax / 1000000}M` : `${company.dealSizeMax / 1000}K`}`
                        : 'Open'}
                    </Text>
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Sign Out */}
        <View className="mx-5 mt-8">
          <Pressable
            className="flex-row items-center justify-center gap-2 border border-error/40 rounded-button py-3"
            onPress={handleLogout}
          >
            <LogOut size={16} color="#EF4444" />
            <Text className="text-bodyMedium text-error font-medium">Sign Out</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
