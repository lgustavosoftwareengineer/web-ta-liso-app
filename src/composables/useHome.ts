import { computed } from 'vue'
import { useListCategoriesApiCategoriesGet } from '@/api/generated/categories/categories'
import { useGetSettingsApiSettingsGet } from '@/api/generated/settings/settings'
import { categoryPercentage, categorySpent } from '@/utils/categoryHelpers'
import { formatMonthYear } from '@/utils/dateHelpers'

export function useHome() {
  const { data: categories, isLoading } = useListCategoriesApiCategoriesGet()
  const { data: settings } = useGetSettingsApiSettingsGet()

  const totalBudget = computed(() =>
    (categories.value ?? []).reduce((s, c) => s + parseFloat(c.initial_amount), 0),
  )
  const totalSpent = computed(() =>
    (categories.value ?? []).reduce((s, c) => s + categorySpent(c), 0),
  )
  const totalRemaining = computed(() => totalBudget.value - totalSpent.value)

  const categoriesAlerts = computed(() => {
    if (!settings.value?.alert_low_balance) return []
    return (categories.value ?? []).filter((c) => categoryPercentage(c) >= 90)
  })

  const monthLabel = formatMonthYear()

  return {
    categories,
    isLoading,
    settings,
    totalBudget,
    totalSpent,
    totalRemaining,
    categoriesAlerts,
    monthLabel,
  }
}
