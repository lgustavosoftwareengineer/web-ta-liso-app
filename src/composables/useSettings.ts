import { useGetSettingsApiSettingsGet } from "@/api/generated/settings/settings"
import { computed } from "vue"


export function useSettings() {
  const { data: settings, isLoading } = useGetSettingsApiSettingsGet()

  const alertLowBalance = computed(() => settings.value?.alert_low_balance ?? false)
  const monthlyReset = computed(() => settings.value?.monthly_reset ?? false)
  const blockNegativeBalance = computed(() => settings.value?.block_negative_balance ?? false)

  return { alertLowBalance, monthlyReset, blockNegativeBalance, isLoading }
}
