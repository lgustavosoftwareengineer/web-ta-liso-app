<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { useQueryClient } from '@tanstack/vue-query'
import BottomNav from '@/components/BottomNav.vue'
import { useListCategoriesApiCategoriesGet, getListCategoriesApiCategoriesGetQueryKey } from '@/api/generated/categories/categories'
import { useListTransactionsApiTransactionsGet, getListTransactionsApiTransactionsGetQueryKey } from '@/api/generated/transactions/transactions'
import {
  useChatApiChatPost,
  useGetHistoryApiChatGet,
  getGetHistoryApiChatGetQueryKey,
} from '@/api/generated/chat/chat'
import type { CategoryResponse, TransactionResponse } from '@/api/generated/táLisoAPI.schemas'

const queryClient = useQueryClient()

// ──────────────────────────────────────────────
// Data
// ──────────────────────────────────────────────
const { data: categories } = useListCategoriesApiCategoriesGet()
const { data: transactions } = useListTransactionsApiTransactionsGet()
const { data: history, isLoading: historyLoading } = useGetHistoryApiChatGet()

const inputText = ref('')
const messagesEl = ref<HTMLElement | null>(null)

type ChatMsg =
  | { role: 'user'; text: string; time: string }
  | { role: 'bot'; text: string; time: string; transaction?: TransactionResponse; catName?: string; catIcon?: string; remainingBalance?: number }

const messages = ref<ChatMsg[]>([])
const historyInitialized = ref(false)

// Populate messages from history once — wait for transactions + categories so we can
// render the full transaction card (same style as real-time messages)
watch([history, transactions, categories], ([h, txns, cats]) => {
  if (!h || historyInitialized.value) return
  historyInitialized.value = true

  const txnMap: Record<string, typeof txns extends (infer T)[] | undefined ? NonNullable<T> : never> = {}
  for (const t of txns ?? []) txnMap[t.id] = t

  messages.value = h.messages.map((msg) => {
    const base = {
      role: (msg.role === 'user' ? 'user' : 'bot') as 'user' | 'bot',
      text: msg.content,
      time: new Date(msg.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    }
    if (msg.role !== 'user' && msg.transaction_id) {
      const txn = txnMap[msg.transaction_id]
      if (txn) {
        const cat = (cats ?? []).find((c) => c.id === txn.category_id)
        return { ...base, transaction: txn, catName: cat?.name, catIcon: cat?.icon ?? undefined } as ChatMsg
      }
    }
    return base as ChatMsg
  })
  scrollToBottom()
}, { immediate: true })

// ──────────────────────────────────────────────
// Chat mutation
// ──────────────────────────────────────────────
const chat = useChatApiChatPost({
  mutation: {
    onSuccess: (data) => {
      if (data.transaction) {
        const cat = (categories.value ?? []).find((c) => c.id === data.transaction!.category_id)
        const remaining = cat
          ? parseFloat(cat.current_balance) - parseFloat(data.transaction.amount)
          : undefined
        messages.value.push({
          role: 'bot',
          text: data.reply,
          time: now(),
          transaction: data.transaction,
          catName: cat?.name,
          catIcon: cat?.icon ?? undefined,
          remainingBalance: remaining,
        })
        queryClient.invalidateQueries({ queryKey: getListTransactionsApiTransactionsGetQueryKey() })
        queryClient.invalidateQueries({ queryKey: getListCategoriesApiCategoriesGetQueryKey() })
      } else {
        messages.value.push({ role: 'bot', text: data.reply, time: now() })
      }
      queryClient.invalidateQueries({ queryKey: getGetHistoryApiChatGetQueryKey() })
      scrollToBottom()
    },
    onError: () => {
      messages.value.push({
        role: 'bot',
        text: 'Eita! Tive um problema aqui. Tenta de novo, visse? 😅',
        time: now(),
      })
      scrollToBottom()
    },
  },
})

// ──────────────────────────────────────────────
// Actions
// ──────────────────────────────────────────────
function sendMessage() {
  const text = inputText.value.trim()
  if (!text || chat.isPending.value) return

  messages.value.push({ role: 'user', text, time: now() })
  inputText.value = ''
  scrollToBottom()

  chat.mutate({ data: { message: text } })
}

// ──────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────
function now(): string {
  return new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

function fmt(value: number): string {
  return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

async function scrollToBottom() {
  await nextTick()
  if (messagesEl.value) messagesEl.value.scrollTop = messagesEl.value.scrollHeight
}

function categoryPct(cat: CategoryResponse): number {
  const initial = parseFloat(cat.initial_amount)
  const balance = parseFloat(cat.current_balance)
  if (!initial) return 0
  return Math.min(100, Math.round(((initial - balance) / initial) * 100))
}
function barColor(p: number): string {
  if (p >= 90) return '#C0252A'
  if (p >= 70) return '#F5C518'
  return '#1E8C45'
}
function balanceColor(p: number): string {
  if (p >= 90) return 'text-[#C0252A]'
  if (p >= 70) return 'text-[#9A7000]'
  return 'text-[#1E8C45]'
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-[#F5EDD8] lg:min-h-0 lg:h-full">
    <!-- Mobile header -->
    <header
      class="flex items-center gap-2.5 px-4 py-3 shrink-0 border-b-2 border-[#E5D9C3] bg-white"
    >
      <div
        class="w-9 h-9 rounded-[11px] flex items-center justify-center text-lg shrink-0"
        style="background: linear-gradient(135deg, #e8500a, #f5c518)"
      >
        🤖
      </div>
      <div>
        <div class="text-sm font-bold text-[#1A1008]" style="font-family: 'Baloo 2', cursive">
          Assistente do Tá Liso
        </div>
        <div class="text-[11px] text-[#1E8C45] font-semibold">● Online, visse!</div>
      </div>
    </header>

    <!-- Chat layout: messages + input; on desktop add sidebar -->
    <div class="flex-1 flex flex-col min-h-0 lg:grid lg:grid-cols-[1fr_320px]">
      <!-- Main: messages + input -->
      <div class="flex-1 flex flex-col min-h-0 border-r-0 lg:border-r lg:border-[#E5D9C3]">
        <div
          ref="messagesEl"
          class="flex-1 overflow-y-auto p-3.5 lg:p-5 flex flex-col gap-2.5 lg:gap-3 bg-[#F5EDD8]"
        >
          <!-- History loading skeleton -->
          <template v-if="historyLoading">
            <div v-for="i in 4" :key="i" class="flex" :class="i % 2 === 0 ? 'justify-end' : 'justify-start'">
              <div
                class="h-10 rounded-2xl animate-pulse"
                :class="i % 2 === 0 ? 'w-48 rounded-br' : 'w-56 rounded-bl'"
                style="background: #E5D9C3"
              />
            </div>
          </template>

          <template v-else>
            <!-- Welcome message when no history -->
            <div v-if="messages.length === 0" class="max-w-[82%] lg:max-w-[65%] self-start">
              <div
                class="py-2.5 px-3.5 lg:py-3 lg:px-4 rounded-2xl rounded-bl text-xs lg:text-[13px] leading-relaxed bg-white border border-[#E5D9C3] text-[#1A1008]"
                v-html="'Eita, bão dia! 🌞<br>Manda seus gastos em linguagem natural:<br><br>Ex: <em>gastei 200 no mercado</em> ou <em>Uber 45 transporte</em>'"
              />
              <div class="text-[10px] text-[#7A6E5F] font-semibold mt-0.5">{{ now() }}</div>
            </div>

            <template v-for="(msg, idx) in messages" :key="idx">
            <!-- User message -->
            <div v-if="msg.role === 'user'" class="max-w-[82%] lg:max-w-[65%] self-end">
              <div
                class="py-2.5 px-3.5 lg:py-3 lg:px-4 rounded-2xl rounded-br text-xs lg:text-[13px] leading-relaxed text-white"
                style="background: linear-gradient(135deg, #e8500a, #c03a00)"
              >
                {{ msg.text }}
              </div>
              <div class="text-[10px] text-[#7A6E5F] font-semibold mt-0.5 text-right">
                {{ msg.time }}
              </div>
            </div>

            <!-- Bot message — success (transaction registered) -->
            <div v-else-if="msg.role === 'bot' && msg.transaction" class="max-w-[82%] lg:max-w-[65%] self-start">
              <div
                class="py-2.5 px-3.5 lg:py-3 lg:px-4 rounded-2xl rounded-bl text-xs lg:text-[13px] leading-relaxed bg-white border border-[#E5D9C3] text-[#1A1008]"
              >
                Anotado, cabra! ✅
                <div
                  class="inline-flex items-center gap-1.5 rounded-full py-1 px-2.5 mt-1.5 text-[11px] font-bold text-[#1E8C45] border border-[#1E8C45]/20"
                  style="background: #E8F7EE"
                >
                  {{ msg.catIcon ?? '📦' }} − R$ {{ fmt(parseFloat(msg.transaction.amount)) }} em {{ msg.catName ?? 'categoria' }}
                </div>
                <template v-if="msg.remainingBalance !== undefined">
                  <br />
                  <span class="text-[11px] text-[#7A6E5F]">
                    Saldo restante: <strong>R$ {{ fmt(msg.remainingBalance) }}</strong>
                  </span>
                </template>
                <div class="mt-1.5 pt-1.5 border-t border-[#E5D9C3] text-[11px] text-[#7A6E5F] italic">
                  {{ msg.text }}
                </div>
              </div>
              <div class="text-[10px] text-[#7A6E5F] font-semibold mt-0.5">{{ msg.time }}</div>
            </div>

            <!-- Bot message — plain (info / error / welcome) -->
            <div v-else class="max-w-[82%] lg:max-w-[65%] self-start">
              <div
                class="py-2.5 px-3.5 lg:py-3 lg:px-4 rounded-2xl rounded-bl text-xs lg:text-[13px] leading-relaxed bg-white border border-[#E5D9C3] text-[#1A1008]"
                v-html="msg.text.replace(/\n/g, '<br>')"
              />
              <div class="text-[10px] text-[#7A6E5F] font-semibold mt-0.5">{{ msg.time }}</div>
            </div>
          </template>
          </template><!-- /v-else -->

          <!-- Typing indicator -->
          <div v-if="chat.isPending.value" class="max-w-[82%] self-start">
            <div
              class="py-2.5 px-4 rounded-2xl rounded-bl bg-white border border-[#E5D9C3] text-[#7A6E5F] text-xs flex items-center gap-1"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-[#7A6E5F] animate-bounce [animation-delay:0ms]" />
              <span class="w-1.5 h-1.5 rounded-full bg-[#7A6E5F] animate-bounce [animation-delay:150ms]" />
              <span class="w-1.5 h-1.5 rounded-full bg-[#7A6E5F] animate-bounce [animation-delay:300ms]" />
            </div>
          </div>
        </div>

        <!-- Input area -->
        <div
          class="shrink-0 flex gap-2 lg:gap-2.5 p-2.5 lg:p-4 border-t-2 lg:border-t border-[#E5D9C3] bg-white"
        >
          <input
            v-model="inputText"
            type="text"
            placeholder="Ex: gastei 80 reais no mercado..."
            class="flex-1 rounded-full py-2 px-3.5 lg:py-2.5 lg:px-4 text-xs lg:text-[13px] text-[#1A1008] bg-[#F5EDD8] border border-[#E5D9C3] outline-none"
            @keydown.enter="sendMessage"
          />
          <button
            type="button"
            class="w-9 h-9 lg:w-10 lg:h-10 rounded-full flex items-center justify-center text-sm lg:text-base text-white shrink-0 cursor-pointer transition-opacity hover:opacity-90 disabled:opacity-50"
            style="
              background: linear-gradient(135deg, #e8500a, #f5c518);
              box-shadow: 0 4px 10px rgba(232, 80, 10, 0.3);
            "
            :disabled="chat.isPending.value"
            @click="sendMessage"
          >
            ➤
          </button>
        </div>
      </div>

      <!-- Desktop sidebar: category balances -->
      <aside class="hidden lg:flex flex-col bg-white overflow-hidden">
        <div
          class="shrink-0 py-4 px-4 border-b border-[#E5D9C3] text-[13px] font-bold text-[#7A6E5F] uppercase tracking-wider"
          style="font-family: 'Baloo 2', cursive"
        >
          Saldos das categorias
        </div>
        <div class="flex-1 overflow-y-auto p-3">
          <div
            v-for="cat in categories ?? []"
            :key="cat.id"
            class="flex items-center justify-between py-2.5 border-b border-[#E5D9C3] last:border-0"
          >
            <div class="flex items-center gap-2">
              <span class="text-lg">{{ cat.icon ?? '📦' }}</span>
              <div>
                <div
                  class="text-xs font-bold text-[#1A1008]"
                  style="font-family: 'Baloo 2', cursive"
                >
                  {{ cat.name }}
                </div>
                <div class="w-[120px] h-1 rounded-full overflow-hidden bg-[#E5D9C3] mt-1">
                  <div
                    class="h-full rounded-full transition-all"
                    :style="{
                      width: categoryPct(cat) + '%',
                      background: barColor(categoryPct(cat)),
                    }"
                  />
                </div>
              </div>
            </div>
            <div
              class="text-[13px] font-extrabold shrink-0"
              style="font-family: 'Baloo 2', cursive"
              :class="balanceColor(categoryPct(cat))"
            >
              R$
              {{
                parseFloat(cat.current_balance).toLocaleString('pt-BR', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })
              }}
            </div>
          </div>
          <div class="mt-4 p-3 rounded-[10px] border border-[#E5D9C3] bg-[#F5EDD8]">
            <div class="text-[10px] font-bold text-[#7A6E5F] uppercase tracking-wider mb-1.5">
              Como registrar
            </div>
            <div class="text-[11px] text-[#7A6E5F] leading-relaxed">
              Fala naturalmente:<br />
              Ex: gastei 80 reais no mercado<br />
              Ex: Uber 45 transporte<br />
              Ex: paguei 30 de forró
            </div>
          </div>
        </div>
      </aside>
    </div>

    <BottomNav />
  </div>
</template>
