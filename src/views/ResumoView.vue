<script setup lang="ts">
import { ref, computed } from 'vue'
import BottomNav from '@/components/BottomNav.vue'
import { useListCategoriesApiCategoriesGet } from '@/api/generated/categories/categories'
import { useListTransactionsApiTransactionsGet } from '@/api/generated/transactions/transactions'
import type { CategoryResponse, TransactionResponse } from '@/api/generated/táLisoAPI.schemas'

const { data: categories, isLoading: loadingCats } = useListCategoriesApiCategoriesGet()
const { data: transactions, isLoading: loadingTxns } = useListTransactionsApiTransactionsGet()

const isLoading = computed(() => loadingCats.value || loadingTxns.value)

// Month navigation
const currentDate = ref(new Date())

const monthLabel = computed(() => {
  const months = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ]
  return `${months[currentDate.value.getMonth()]} ${currentDate.value.getFullYear()}`
})

function prevMonth() {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1)
}
function nextMonth() {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1)
}

// Filter transactions by selected month
const filteredTxns = computed(() => {
  if (!transactions.value) return []
  const y = currentDate.value.getFullYear()
  const m = currentDate.value.getMonth()
  return transactions.value.filter((t) => {
    const d = new Date(t.created_at)
    return d.getFullYear() === y && d.getMonth() === m
  })
})

// Category map for quick lookups
const catMap = computed(() => {
  const map: Record<string, CategoryResponse> = {}
  for (const c of categories.value ?? []) map[c.id] = c
  return map
})

// Summary numbers
const totalBudget = computed(() =>
  (categories.value ?? []).reduce((s, c) => s + parseFloat(c.initial_amount), 0),
)
const totalSpent = computed(() => filteredTxns.value.reduce((s, t) => s + parseFloat(t.amount), 0))
const totalRemaining = computed(() => {
  if (totalSpent.value) {
    return totalBudget.value - totalSpent.value
  }
  return 0
})

// Spending by category for selected month
const categorySpending = computed(() => {
  const map: Record<string, number> = {}
  for (const t of filteredTxns.value) {
    if (t.category_id) map[t.category_id] = (map[t.category_id] ?? 0) + parseFloat(t.amount)
  }
  return (categories.value ?? [])
    .map((cat) => {
      const spent = map[cat.id] ?? 0
      const initial = parseFloat(cat.initial_amount)
      const pct = initial ? Math.min(100, Math.round((spent / initial) * 100)) : 0
      return {
        cat,
        spent,
        pct,
        barColor: pct >= 90 ? '#C0252A' : pct >= 70 ? '#F5C518' : '#1E8C45',
        isWarning: pct >= 90,
      }
    })
    .filter((r) => r.spent > 0)
})

// Transactions grouped by day
const entriesByDay = computed(() => {
  const groups: Record<string, TransactionResponse[]> = {}
  for (const t of [...filteredTxns.value].sort(
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

function fmt(value: number): string {
  return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-[#F5EDD8]">
    <header
      class="flex items-center justify-between px-4 py-3 shrink-0 border-b-2 border-[#E5D9C3] bg-white"
    >
      <span class="text-xl font-extrabold text-[#1A1008]" style="font-family: 'Baloo 2', cursive"
        >📊 Resumo</span
      >
    </header>

    <!-- Seletor de mês -->
    <div
      class="flex items-center justify-between py-2.5 px-4 border-b border-[#E5D9C3] bg-white shrink-0"
    >
      <button
        type="button"
        class="w-8 h-8 rounded-full border border-[#E5D9C3] bg-[#F5EDD8] flex items-center justify-center text-[#1A1008] cursor-pointer text-base"
        @click="prevMonth"
      >
        ‹
      </button>
      <div class="text-center">
        <div
          class="text-[15px] font-extrabold text-[#1A1008]"
          style="font-family: 'Baloo 2', cursive"
        >
          {{ monthLabel }}
        </div>
        <div class="text-[10px] text-[#7A6E5F] font-semibold">toque para ver outro mês</div>
      </div>
      <button
        type="button"
        class="w-8 h-8 rounded-full border border-[#E5D9C3] bg-[#F5EDD8] flex items-center justify-center text-[#1A1008] cursor-pointer text-base"
        @click="nextMonth"
      >
        ›
      </button>
    </div>

    <main class="flex-1 overflow-y-auto p-4">
      <!-- Saldo geral do mês -->
      <div
        class="rounded-[20px] p-5 mb-3.5 relative overflow-hidden"
        style="
          background: linear-gradient(135deg, #e8500a 0%, #c03a00 100%);
          box-shadow: 0 8px 24px rgba(232, 80, 10, 0.35);
        "
      >
        <span class="absolute text-[80px] -top-2 -right-2 opacity-[0.12]">🌵</span>
        <div class="text-[10px] text-white/60 uppercase tracking-widest font-bold mb-1">
          Resumo · {{ monthLabel }}
        </div>
        <div
          class="text-white text-[34px] font-extrabold leading-tight tracking-tight"
          style="font-family: 'Baloo 2', cursive"
        >
          <span v-if="isLoading" class="text-[18px] opacity-70">Carregando...</span>
          <template v-else>
            <span class="text-[15px] font-medium opacity-70">R$</span>
            {{ fmt(totalRemaining) }}
          </template>
        </div>
        <div
          class="inline-flex items-center gap-1.5 rounded-full py-1 px-2.5 mt-2 text-[11px] font-bold text-white bg-white/15 backdrop-blur"
        >
          💰 saldo restante no mês
        </div>
        <div class="flex gap-0 mt-3.5 pt-3.5 border-t border-white/15">
          <template v-if="isLoading">
            <div
              v-for="i in 3"
              :key="i"
              class="flex-1"
              :class="i > 1 ? 'border-l border-white/15 pl-3' : ''"
            >
              <div class="w-10 h-2 rounded bg-white/20 animate-pulse mb-1.5" />
              <div class="w-16 h-3.5 rounded bg-white/20 animate-pulse" />
            </div>
          </template>
          <template v-else>
            <div class="flex-1">
              <div class="text-[9px] text-white/50 uppercase tracking-wider font-bold mb-0.5">
                Orçado
              </div>
              <div class="text-sm font-bold text-white" style="font-family: 'Baloo 2', cursive">
                R$ {{ fmt(totalBudget) }}
              </div>
            </div>
            <div class="flex-1 border-l border-white/15 pl-3">
              <div class="text-[9px] text-white/50 uppercase tracking-wider font-bold mb-0.5">
                Gasto
              </div>
              <div class="text-sm font-bold text-[#FFB3A0]" style="font-family: 'Baloo 2', cursive">
                R$ {{ fmt(totalSpent) }}
              </div>
            </div>
            <div class="flex-1 border-l border-white/15 pl-3">
              <div class="text-[9px] text-white/50 uppercase tracking-wider font-bold mb-0.5">
                %
              </div>
              <div class="text-sm font-bold text-[#A8FFB3]" style="font-family: 'Baloo 2', cursive">
                {{ totalBudget ? Math.round((totalSpent / totalBudget) * 100) : 0 }}%
              </div>
            </div>
          </template>
        </div>
      </div>

      <!-- Gasto por categoria -->
      <div
        v-if="categorySpending.length"
        class="rounded-2xl p-4 mb-3.5 border border-[#E5D9C3] bg-white"
      >
        <div
          class="text-[13px] font-bold text-[#1A1008] mb-3.5"
          style="font-family: 'Baloo 2', cursive"
        >
          Gasto por categoria
        </div>
        <div v-for="row in categorySpending" :key="row.cat.id" class="mb-3 last:mb-0">
          <div class="flex justify-between items-center mb-1">
            <div class="flex items-center gap-1.5">
              <span class="text-sm">{{ row.cat.icon ?? '📦' }}</span>
              <span
                class="text-xs font-bold text-[#1A1008]"
                style="font-family: 'Baloo 2', cursive"
                >{{ row.cat.name }}</span
              >
            </div>
            <span
              class="text-xs font-bold"
              style="font-family: 'Baloo 2', cursive"
              :class="
                row.isWarning
                  ? 'text-[#C0252A]'
                  : row.pct >= 35
                    ? 'text-[#9A7000]'
                    : 'text-[#1E8C45]'
              "
            >
              R$ {{ fmt(row.spent) }}
            </span>
          </div>
          <div class="h-2 rounded-full overflow-hidden bg-[#E5D9C3]">
            <div
              class="h-full rounded-full transition-all"
              :style="{ width: row.pct + '%', background: row.barColor }"
            />
          </div>
          <div class="text-[10px] text-[#7A6E5F] font-semibold mt-0.5">
            R$ {{ fmt(row.spent) }} de R$ {{ fmt(parseFloat(row.cat.initial_amount)) }} ·
            {{ row.pct }}% usado {{ row.isWarning ? '⚠️' : '' }}
          </div>
        </div>
      </div>

      <!-- Lançamentos -->
      <div
        class="text-[13px] font-bold text-[#7A6E5F] uppercase tracking-wider mb-2.5"
        style="font-family: 'Baloo 2', cursive"
      >
        Lançamentos · {{ monthLabel }}
      </div>

      <!-- Loading -->
      <div v-if="isLoading" class="flex flex-col gap-2">
        <div
          v-for="i in 4"
          :key="i"
          class="rounded-[13px] p-3 border border-[#E5D9C3] bg-white h-[56px] animate-pulse"
        />
      </div>

      <!-- Empty -->
      <div
        v-else-if="!filteredTxns.length"
        class="rounded-2xl p-5 border border-[#E5D9C3] bg-white text-center"
      >
        <p class="text-sm text-[#7A6E5F]">Nenhum lançamento em {{ monthLabel }}.</p>
      </div>

      <div v-else class="flex flex-col gap-2">
        <template v-for="group in entriesByDay" :key="group.day">
          <div
            class="text-[10px] font-bold text-[#7A6E5F] uppercase tracking-wider py-0.5 pt-2 first:pt-0"
          >
            {{ group.day }}
          </div>
          <div
            v-for="txn in group.items"
            :key="txn.id"
            class="rounded-[13px] p-3 border border-[#E5D9C3] bg-white flex items-center justify-between"
          >
            <div class="flex items-center gap-2.5">
              <div
                class="w-[34px] h-[34px] rounded-[10px] flex items-center justify-center text-[15px] shrink-0 bg-[#FEF0E8]"
              >
                {{ txn.category_id ? (catMap[txn.category_id]?.icon ?? '📦') : '💸' }}
              </div>
              <div>
                <div
                  class="text-[13px] font-bold text-[#1A1008]"
                  style="font-family: 'Baloo 2', cursive"
                >
                  {{ txn.description }}
                </div>
                <div class="text-[10px] text-[#7A6E5F] font-semibold">
                  {{
                    txn.category_id
                      ? (catMap[txn.category_id]?.name ?? 'Sem categoria')
                      : 'Sem categoria'
                  }}
                </div>
              </div>
            </div>
            <div
              class="text-sm font-extrabold text-[#C0252A]"
              style="font-family: 'Baloo 2', cursive"
            >
              − R$ {{ fmt(parseFloat(txn.amount)) }}
            </div>
          </div>
        </template>
      </div>
    </main>

    <BottomNav />
  </div>
</template>
