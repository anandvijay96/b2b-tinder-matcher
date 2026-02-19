import { useState } from 'react';
import { Pressable, ScrollView, Switch, Text, View } from 'react-native';
import { Modal } from '@/components/ui';
import type { SwipeFilters } from '@/stores/useSwipeStore';
import { INDUSTRIES, EMPLOYEE_RANGES, GEOGRAPHIES } from '@/models';

export interface FiltersSheetProps {
  visible: boolean;
  currentFilters: SwipeFilters;
  onApply: (filters: SwipeFilters) => void;
  onClose: () => void;
}

function CheckRow({
  label,
  checked,
  onToggle,
}: {
  label: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <Pressable
      onPress={onToggle}
      className="flex-row items-center justify-between py-2.5"
      hitSlop={4}
    >
      <Text className="text-body text-textPrimary">{label}</Text>
      <View
        className={`w-5 h-5 rounded border-2 items-center justify-center ${
          checked ? 'bg-primary border-primary' : 'border-borderMedium bg-bgBase'
        }`}
      >
        {checked && <Text className="text-textInverse text-small font-bold">✓</Text>}
      </View>
    </Pressable>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <Text className="text-captionMedium text-textMuted uppercase tracking-wider mt-4 mb-1">
      {title}
    </Text>
  );
}

export function FiltersSheet({
  visible,
  currentFilters,
  onApply,
  onClose,
}: FiltersSheetProps) {
  const [draft, setDraft] = useState<SwipeFilters>(currentFilters);

  function toggleItem(
    key: 'industries' | 'companySizes' | 'geographies',
    value: string
  ) {
    setDraft((prev) => {
      const arr = prev[key];
      return {
        ...prev,
        [key]: arr.includes(value)
          ? arr.filter((v) => v !== value)
          : [...arr, value],
      };
    });
  }

  function reset() {
    setDraft({ industries: [], companySizes: [], geographies: [], verificationLevel: null });
  }

  const activeCount =
    draft.industries.length +
    draft.companySizes.length +
    draft.geographies.length +
    (draft.verificationLevel ? 1 : 0);

  return (
    <Modal visible={visible} onClose={onClose} title="Filter companies">
      <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 440 }}>
        <SectionTitle title="Industry" />
        {INDUSTRIES.slice(0, 10).map((ind) => (
          <CheckRow
            key={ind}
            label={ind}
            checked={draft.industries.includes(ind)}
            onToggle={() => toggleItem('industries', ind)}
          />
        ))}

        <SectionTitle title="Company size" />
        {EMPLOYEE_RANGES.map((range) => (
          <CheckRow
            key={range}
            label={`${range} employees`}
            checked={draft.companySizes.includes(range)}
            onToggle={() => toggleItem('companySizes', range)}
          />
        ))}

        <SectionTitle title="Geography" />
        {GEOGRAPHIES.slice(0, 8).map((geo) => (
          <CheckRow
            key={geo}
            label={geo}
            checked={draft.geographies.includes(geo)}
            onToggle={() => toggleItem('geographies', geo)}
          />
        ))}

        <SectionTitle title="Verification" />
        <View className="flex-row items-center justify-between py-2.5">
          <Text className="text-body text-textPrimary">Verified companies only</Text>
          <Switch
            value={draft.verificationLevel === 'verified'}
            onValueChange={(val) =>
              setDraft((prev) => ({
                ...prev,
                verificationLevel: val ? 'verified' : null,
              }))
            }
            trackColor={{ false: '#CBD5E1', true: '#1E3A5F' }}
            thumbColor="#fff"
          />
        </View>
      </ScrollView>

      <View className="flex-row gap-3 mt-4">
        <Pressable
          onPress={reset}
          className="flex-1 h-11 rounded-xl border border-borderMedium items-center justify-center"
        >
          <Text className="text-bodyMedium text-textSecondary">Reset</Text>
        </Pressable>
        <Pressable
          onPress={() => { onApply(draft); onClose(); }}
          className="flex-1 h-11 rounded-xl bg-primary items-center justify-center"
        >
          <Text className="text-bodyMedium text-textInverse font-semibold">
            {activeCount > 0 ? `Apply (${activeCount})` : 'Apply'}
          </Text>
        </Pressable>
      </View>
    </Modal>
  );
}

export default FiltersSheet;
