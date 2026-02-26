import { ref, watch, nextTick } from 'vue'

function afterPaint(): Promise<void> {
  return new Promise((resolve) => {
    nextTick().then(() => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => resolve())
      })
    })
  })
}
import { useQueryClient } from '@tanstack/vue-query'
import {
  useListCategoriesApiCategoriesGet,
  getListCategoriesApiCategoriesGetQueryKey,
} from '@/api/generated/categories/categories'
import {
  useListTransactionsApiTransactionsGet,
  getListTransactionsApiTransactionsGetQueryKey,
} from '@/api/generated/transactions/transactions'
import {
  useChatApiChatPost,
  useGetHistoryApiChatGet,
  getGetHistoryApiChatGetQueryKey,
} from '@/api/generated/chat/chat'
import { useGetSettingsApiSettingsGet } from '@/api/generated/settings/settings'
import type {
  TransactionResponse,
  ChatResponseInsufficientBalance,
  CategoryResponse,
} from '@/api/generated/táLisoAPI.schemas'
import { useToastStore } from '@/stores/toast'
import { formatCurrentTime } from '@/utils/dateHelpers'
import { formatBRL } from '@/utils/categoryHelpers'

export type ChatMessage =
  | { role: 'user'; text: string; time: string }
  | {
    role: 'bot'
    text: string
    time: string
    transaction?: TransactionResponse
    catName?: string
    catIcon?: string
    remainingBalance?: number
    insufficientBalance?: ChatResponseInsufficientBalance
  }

export function useChat() {
  const queryClient = useQueryClient()
  const toastStore = useToastStore()

  const { data: categories } = useListCategoriesApiCategoriesGet()
  const { data: transactions } = useListTransactionsApiTransactionsGet()
  const { data: settings } = useGetSettingsApiSettingsGet()
  const { data: history, isLoading: historyLoading } = useGetHistoryApiChatGet()

  const inputText = ref('')
  const messagesContainer = ref<HTMLElement | null>(null)
  const messages = ref<ChatMessage[]>([])
  const historyInitialized = ref(false)

  // ── Helpers ──

  /** Rola até o final do container de mensagens (scrollHeight), com animação suave. */
  async function scrollToBottom() {
    await nextTick()
    const el = messagesContainer.value
    if (!el) return
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
  }

  // ── Low balance alert ──

  function buildLowBalanceToastMessage(category: CategoryResponse, remainingBalance: number): string {
    const icon = category.icon ?? '📦'
    const formattedBalance = formatBRL(remainingBalance)
    return remainingBalance < 0
      ? `${icon} ${category.name} passou do limite! Saldo: R$ ${formattedBalance}.`
      : `${icon} ${category.name} tá quase no limite! Só sobrou R$ ${formattedBalance}, cabra!`
  }

  function checkAndShowLowBalanceAlert(category: CategoryResponse, remainingBalance: number) {
    if (!settings.value?.alert_low_balance) return
    const initialBudget = parseFloat(category.initial_amount)
    const spentPercentage =
      initialBudget > 0
        ? Math.min(100, Math.round(((initialBudget - remainingBalance) / initialBudget) * 100))
        : 100
    if (spentPercentage >= 90) {
      toastStore.show(buildLowBalanceToastMessage(category, remainingBalance), 'warning')
    }
  }

  // ── History initialization ──

  watch(
    [history, transactions, categories],
    ([chatHistory, allTransactions, allCategories]) => {
      if (!chatHistory || historyInitialized.value) return
      historyInitialized.value = true

      const transactionById: Record<
        string,
        typeof allTransactions extends (infer T)[] | undefined ? NonNullable<T> : never
      > = {}
      for (const transaction of allTransactions ?? []) transactionById[transaction.id] = transaction

      messages.value = chatHistory.messages.map((historyEntry) => {
        const baseMessage = {
          role: (historyEntry.role === 'user' ? 'user' : 'bot') as 'user' | 'bot',
          text: historyEntry.content,
          time: new Date(historyEntry.created_at).toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
          }),
        }
        if (historyEntry.role !== 'user' && historyEntry.transaction_id) {
          const matchedTransaction = transactionById[historyEntry.transaction_id]
          if (matchedTransaction) {
            const relatedCategory = (allCategories ?? []).find(
              (c) => c.id === matchedTransaction.category_id,
            )
            return {
              ...baseMessage,
              transaction: matchedTransaction,
              catName: relatedCategory?.name,
              catIcon: relatedCategory?.icon ?? undefined,
            } as ChatMessage
          }
        }
        return baseMessage as ChatMessage
      })
    },
    { immediate: true },
  )

  // Scroll para o final do container após as mensagens estarem de fato no DOM (histórico ou nova mensagem).
  watch(
    [messages, historyLoading],
    async () => {
      if (historyLoading.value) return
      await afterPaint()
      scrollToBottom()
    },
    { flush: 'post', deep: true },
  )

  // ── Chat mutation ──

  const chat = useChatApiChatPost({
    mutation: {
      onSuccess: async (data) => {
        if (data.transaction) {
          const transactionCategory = (categories.value ?? []).find(
            (c) => c.id === data.transaction!.category_id,
          )
          const remainingBalance = transactionCategory
            ? parseFloat(transactionCategory.current_balance) - parseFloat(data.transaction.amount)
            : undefined

          messages.value.push({
            role: 'bot',
            text: data.reply,
            time: formatCurrentTime(),
            transaction: data.transaction,
            catName: transactionCategory?.name,
            catIcon: transactionCategory?.icon ?? undefined,
            remainingBalance,
          })

          if (transactionCategory && remainingBalance !== undefined) {
            checkAndShowLowBalanceAlert(transactionCategory, remainingBalance)
          }
        } else if (data.insufficient_balance) {
          messages.value.push({
            role: 'bot',
            text: data.reply,
            time: formatCurrentTime(),
            insufficientBalance: data.insufficient_balance,
          })
        } else {
          messages.value.push({ role: 'bot', text: data.reply, time: formatCurrentTime() })
        }

        // Sempre invalida e refetch: a API pode ter alterado categorias (edit_category, delete_category)
        // ou transações (nova transação, edit_transaction, etc.) em qualquer resposta.
        const categoriesKey = getListCategoriesApiCategoriesGetQueryKey()
        const transactionsKey = getListTransactionsApiTransactionsGetQueryKey()
        queryClient.invalidateQueries({ queryKey: categoriesKey })
        queryClient.invalidateQueries({ queryKey: transactionsKey })
        await queryClient.refetchQueries({ queryKey: categoriesKey })
        await queryClient.refetchQueries({ queryKey: transactionsKey })
        queryClient.invalidateQueries({ queryKey: getGetHistoryApiChatGetQueryKey() })
      },
      onError: () => {
        messages.value.push({
          role: 'bot',
          text: 'Eita! Tive um problema aqui. Tenta de novo, visse? 😅',
          time: formatCurrentTime(),
        })
      },
    },
  })

  function sendMessage() {
    const text = inputText.value.trim()
    if (!text || chat.isPending.value) return

    messages.value.push({ role: 'user', text, time: formatCurrentTime() })
    inputText.value = ''

    chat.mutate({ data: { message: text } })
  }

  return {
    categories,
    messages,
    historyLoading,
    inputText,
    messagesContainer,
    chat,
    sendMessage,
    scrollToBottom,
    currentTime: formatCurrentTime,
  }
}
