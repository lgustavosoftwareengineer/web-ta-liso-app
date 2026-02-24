import { ref, computed } from 'vue'
import { useListCategoriesApiCategoriesGet } from '@/api/generated/categories/categories'
import { useListTransactionsApiTransactionsGet } from '@/api/generated/transactions/transactions'
import type { CategoryResponse, TransactionResponse } from '@/api/generated/táLisoAPI.schemas'
import { MONTH_NAMES } from '@/constants'
import { barColor } from '@/utils/categoryHelpers'

export function useMonthlyResume() {
  const { data: categories, isLoading: isLoadingCategories } = useListCategoriesApiCategoriesGet()
  const { data: transactions, isLoading: isLoadingTransactions } =
    useListTransactionsApiTransactionsGet()

  const isLoading = computed(() => isLoadingCategories.value || isLoadingTransactions.value)

  // Month navigation
  const currentDate = ref(new Date())

  const monthLabel = computed(
    () => `${MONTH_NAMES[currentDate.value.getMonth()]} ${currentDate.value.getFullYear()}`,
  )

  function prevMonth() {
    currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1)
  }

  function nextMonth() {
    currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1)
  }

  // Filter transactions by selected month
  const filteredTransactions = computed(() => {
    if (!transactions.value) return []
    const year = currentDate.value.getFullYear()
    const month = currentDate.value.getMonth()
    return transactions.value.filter((t) => {
      const date = new Date(t.created_at)
      return date.getFullYear() === year && date.getMonth() === month
    })
  })

  // Category map for quick lookups
  const categoryMap = computed(() => {
    const map: Record<string, CategoryResponse> = {}
    for (const c of categories.value ?? []) map[c.id] = c
    return map
  })

  const totalSpent = computed(() =>
    filteredTransactions.value.reduce((sum, t) => sum + parseFloat(t.amount), 0),
  )

  const totalBudget = computed(() => {
    if (!totalSpent.value) return 0
    return (categories.value ?? []).reduce((sum, c) => sum + parseFloat(c.initial_amount), 0)
  })

  const totalRemaining = computed(() => {
    if (!totalSpent.value) return 0
    return totalBudget.value - totalSpent.value
  })

  // Spending by category for selected month
  const categorySpending = computed(() => {
    const spendingByCategory: Record<string, number> = {}
    for (const t of filteredTransactions.value) {
      if (t.category_id)
        spendingByCategory[t.category_id] =
          (spendingByCategory[t.category_id] ?? 0) + parseFloat(t.amount)
    }
    return (categories.value ?? [])
      .map((cat) => {
        const amountSpent = spendingByCategory[cat.id] ?? 0
        const initialAmount = parseFloat(cat.initial_amount)
        const percentage = initialAmount
          ? Math.min(100, Math.round((amountSpent / initialAmount) * 100))
          : 0
        return {
          cat,
          amountSpent,
          percentage,
          barColor: barColor(percentage),
          isWarning: percentage >= 90,
        }
      })
      .filter((row) => row.amountSpent > 0)
  })

  // Transactions grouped by day
  const entriesByDay = computed(() => {
    const groups: Record<string, TransactionResponse[]> = {}
    for (const t of [...filteredTransactions.value].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    )) {
      const dayKey = new Date(t.created_at).toLocaleDateString('pt-BR', {
        day: 'numeric',
        month: 'long',
      })
      if (!groups[dayKey]) groups[dayKey] = []
      groups[dayKey].push(t)
    }
    return Object.entries(groups).map(([day, items]) => ({ day, items }))
  })

  return {
    isLoading,
    monthLabel,
    prevMonth,
    nextMonth,
    filteredTransactions,
    categoryMap,
    totalSpent,
    totalBudget,
    totalRemaining,
    categorySpending,
    entriesByDay,
  }
}
