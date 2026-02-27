import { ref, computed } from 'vue'
import { useQueryClient } from '@tanstack/vue-query'
import {
  useListTransactionsApiTransactionsGet,
  useCreateTransactionApiTransactionsPost,
  useUpdateTransactionApiTransactionsTransactionIdPut,
  useDeleteTransactionApiTransactionsTransactionIdDelete,
  getListTransactionsApiTransactionsGetQueryKey,
} from '@/api/generated/transactions/transactions'
import {
  useListCategoriesApiCategoriesGet,
  getListCategoriesApiCategoriesGetQueryKey,
} from '@/api/generated/categories/categories'
import type { TransactionResponse } from '@/api/generated/táLisoAPI.schemas'
import { useApiError } from '@/composables/useApiError'
import { MONTH_NAMES } from '@/constants'

export function useTransactionsManagement() {
  const queryClient = useQueryClient()
  const { getErrorMessage } = useApiError()

  const { data: transactions, isLoading } = useListTransactionsApiTransactionsGet()
  const { data: categories } = useListCategoriesApiCategoriesGet()

  const currentDate = ref(new Date())
  const monthLabel = computed(
    () => `${MONTH_NAMES[currentDate.value.getMonth()]} ${currentDate.value.getFullYear()}`,
  )

  const filteredTransactions = computed(() => {
    if (!transactions.value) return []
    const year = currentDate.value.getFullYear()
    const month = currentDate.value.getMonth()
    return transactions.value
      .filter((t) => {
        const date = new Date(t.created_at)
        return date.getFullYear() === year && date.getMonth() === month
      })
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  })

  const categoryMap = computed(() => {
    const map: Record<string, { name: string; icon: string }> = {}
    for (const c of categories.value ?? []) map[c.id] = { name: c.name, icon: c.icon ?? '📦' }
    return map
  })

  /** Saldo máximo permitido para o valor (conforme categoria); null = sem limite. */
  const maxAmountForCategory = computed(() => {
    const categoryId = formCategoryId.value?.trim() ?? ''
    if (!categoryId) return null
    const cat = (categories.value ?? []).find((c) => c.id === categoryId)
    if (!cat) return null
    let max = parseFloat(cat.current_balance)
    if (editingId.value) {
      const editing = (transactions.value ?? []).find((t) => t.id === editingId.value)
      if (editing && editing.category_id === categoryId) max += parseFloat(editing.amount)
    }
    return max
  })

  const entriesByDay = computed(() => {
    const groups: Record<string, TransactionResponse[]> = {}
    for (const t of filteredTransactions.value) {
      const dayKey = new Date(t.created_at).toLocaleDateString('pt-BR', {
        day: 'numeric',
        month: 'long',
      })
      if (!groups[dayKey]) groups[dayKey] = []
      groups[dayKey].push(t)
    }
    return Object.entries(groups).map(([day, items]) => ({ day, items }))
  })

  function prevMonth() {
    currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1)
  }

  function nextMonth() {
    currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1)
  }

  const formOpen = ref(false)
  const editingId = ref<string | null>(null)
  const formDescription = ref('')
  const formAmount = ref('')
  const formCategoryId = ref('')
  const formError = ref('')

  function openCreate() {
    editingId.value = null
    formDescription.value = ''
    formAmount.value = ''
    formCategoryId.value = categories.value?.[0]?.id ?? ''
    formError.value = ''
    formOpen.value = true
  }

  function openEdit(t: TransactionResponse) {
    editingId.value = t.id
    formDescription.value = t.description
    formAmount.value = t.amount
    formCategoryId.value = t.category_id ?? ''
    formError.value = ''
    formOpen.value = true
  }

  function closeForm() {
    formOpen.value = false
    editingId.value = null
  }

  const createTransaction = useCreateTransactionApiTransactionsPost({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListTransactionsApiTransactionsGetQueryKey() })
        queryClient.invalidateQueries({ queryKey: getListCategoriesApiCategoriesGetQueryKey() })
        closeForm()
      },
      onError: (e) => {
        formError.value = getErrorMessage(e)
      },
    },
  })

  const updateTransaction = useUpdateTransactionApiTransactionsTransactionIdPut({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListTransactionsApiTransactionsGetQueryKey() })
        queryClient.invalidateQueries({ queryKey: getListCategoriesApiCategoriesGetQueryKey() })
        closeForm()
      },
      onError: (e) => {
        formError.value = getErrorMessage(e)
      },
    },
  })

  const deleteTransaction = useDeleteTransactionApiTransactionsTransactionIdDelete({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListTransactionsApiTransactionsGetQueryKey() })
        queryClient.invalidateQueries({ queryKey: getListCategoriesApiCategoriesGetQueryKey() })
      },
    },
  })

  function saveTransaction() {
    formError.value = ''
    const amount = parseFloat(String(formAmount.value).replace(',', '.'))
    if (!formDescription.value.trim()) {
      formError.value = 'Descrição é obrigatória.'
      return
    }
    if (Number.isNaN(amount) || amount <= 0) {
      formError.value = 'Informe um valor válido.'
      return
    }
    const categoryId = formCategoryId.value?.trim() ?? ''
    const maxAllowed = maxAmountForCategory.value
    if (maxAllowed != null && amount > maxAllowed) {
      formError.value = `O valor não pode ser maior que o saldo da categoria (R$ ${maxAllowed.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}).`
      return
    }
    if (editingId.value) {
      updateTransaction.mutate({
        transactionId: editingId.value,
        data: {
          description: formDescription.value.trim(),
          amount: String(amount),
          ...(categoryId ? { category_id: categoryId } : {}),
        },
      })
    } else {
      createTransaction.mutate({
        data: {
          description: formDescription.value.trim(),
          amount: String(amount),
          category_id: categoryId,
        },
      })
    }
  }

  function confirmDelete(t: TransactionResponse) {
    if (window.confirm(`Excluir "${t.description}" (R$ ${t.amount})?`)) {
      deleteTransaction.mutate({ transactionId: t.id })
    }
  }

  /** Deixa no campo apenas dígitos e no máximo um separador decimal (vírgula ou ponto). */
  function sanitizeAmountInput(value: string): string {
    const normalized = value.replace(',', '.')
    const parts = normalized.split('.')
    const first = (parts[0] ?? '').replace(/\D/g, '')
    const second = parts.length > 1 ? (parts[1] ?? '').replace(/\D/g, '').slice(0, 2) : ''
    if (!second) return first || ''
    return first ? `${first}.${second}` : `0.${second}`
  }

  return {
    isLoading,
    monthLabel,
    prevMonth,
    nextMonth,
    filteredTransactions,
    entriesByDay,
    categoryMap,
    formOpen,
    editingId,
    formDescription,
    formAmount,
    formCategoryId,
    formError,
    categories,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    openCreate,
    openEdit,
    closeForm,
    saveTransaction,
    confirmDelete,
    maxAmountForCategory,
    sanitizeAmountInput,
  }
}
