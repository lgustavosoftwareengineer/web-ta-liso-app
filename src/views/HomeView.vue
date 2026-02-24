<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import BottomNav from '@/components/BottomNav.vue'
import { useListCategoriesApiCategoriesGet } from '@/api/generated/categories/categories'
import type { CategoryResponse } from '@/api/generated/táLisoAPI.schemas'
import { useUser } from '@/composables/useUser'

const { data: categories, isLoading } = useListCategoriesApiCategoriesGet()

const { initials } = useUser()

function pct(cat: CategoryResponse): number {
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

function spent(cat: CategoryResponse): number {
  return parseFloat(cat.initial_amount) - parseFloat(cat.current_balance)
}

function formatBRL(value: number): string {
  return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const totalBudget = computed(() =>
  (categories.value ?? []).reduce((s, c) => s + parseFloat(c.initial_amount), 0),
)
const totalSpent = computed(() => (categories.value ?? []).reduce((s, c) => s + spent(c), 0))
const totalRemaining = computed(() => totalBudget.value - totalSpent.value)

const alerts = computed(() => (categories.value ?? []).filter((c) => pct(c) >= 90))

const monthLabel = new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
</script>

<template>
  <div class="min-h-screen flex flex-col bg-[#F5EDD8]">
    <!-- App header -->
    <header
      class="flex items-center justify-between px-4 py-3 shrink-0 border-b-2 border-[#E5D9C3]"
      style="background: #fff"
    >
      <div
        class="font-bold text-[#1A1008] text-xl leading-none"
        style="font-family: 'Baloo 2', cursive"
      >
        Tá <span style="color: #e8500a">Liso</span> 💸
      </div>
      <RouterLink
        to="/configuracoes"
        class="w-8.5 h-8.5 rounded-full flex items-center justify-center text-white text-[13px] font-bold shrink-0 cursor-pointer no-underline"
        style="
          font-family: 'Baloo 2', cursive;
          background: linear-gradient(135deg, #e8500a 0%, #f5c518 100%);
        "
      >
        {{ initials }}
      </RouterLink>
    </header>

    <!-- Scrollable content -->
    <main class="flex-1 overflow-y-auto px-4 py-4">
      <!-- Summary card -->
      <div
        class="rounded-[20px] p-5 mb-4 relative overflow-hidden"
        style="
          background: linear-gradient(135deg, #e8500a 0%, #c03a00 100%);
          box-shadow: 0 8px 24px rgba(232, 80, 10, 0.35);
        "
      >
        <span class="absolute text-[80px] -top-2 -right-2 opacity-[0.12]">🌵</span>
        <div class="text-[10px] text-white/60 uppercase tracking-widest font-bold mb-1">
          Saldo disponível no mês
        </div>
        <div
          class="text-white text-[34px] font-extrabold leading-tight tracking-tight"
          style="font-family: 'Baloo 2', cursive"
        >
          <span v-if="isLoading" class="text-[18px] opacity-70">Carregando...</span>
          <template v-else>
            <span class="text-[15px] font-medium opacity-70">R$</span>
            {{ formatBRL(totalRemaining) }}
          </template>
        </div>
        <div
          class="inline-flex items-center gap-1.5 rounded-full py-1 px-2.5 mt-2 text-[11px] font-bold text-white"
          style="background: rgba(255, 255, 255, 0.15); backdrop-filter: blur(4px)"
        >
          📅 {{ monthLabel }}
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
                R$ {{ formatBRL(totalBudget) }}
              </div>
            </div>
            <div class="flex-1 border-l border-white/15 pl-3">
              <div class="text-[9px] text-white/50 uppercase tracking-wider font-bold mb-0.5">
                Gasto
              </div>
              <div class="text-sm font-bold text-[#FFB3A0]" style="font-family: 'Baloo 2', cursive">
                R$ {{ formatBRL(totalSpent) }}
              </div>
            </div>
            <div class="flex-1 border-l border-white/15 pl-3">
              <div class="text-[9px] text-white/50 uppercase tracking-wider font-bold mb-0.5">
                Sobrou
              </div>
              <div class="text-sm font-bold text-[#A8FFB3]" style="font-family: 'Baloo 2', cursive">
                R$ {{ formatBRL(totalRemaining) }}
              </div>
            </div>
          </template>
        </div>
      </div>

      <!-- Alerts: categorias ≥ 90% -->
      <div
        v-for="alert in alerts"
        :key="alert.id"
        class="rounded-[14px] p-3 px-3.5 flex items-center gap-2.5 mb-3 border"
        style="background: #faeaea; border-color: rgba(192, 37, 42, 0.2)"
      >
        <span class="text-xl">⚠️</span>
        <p class="text-xs font-semibold text-[#C0252A] leading-snug">
          {{ alert.icon }} {{ alert.name }} tá quase no limite! Só sobrou R$
          {{ formatBRL(parseFloat(alert.current_balance)) }}, cabra!
        </p>
      </div>

      <!-- Section: Suas Categorias -->
      <div class="flex justify-between items-center mb-2.5">
        <span
          class="text-[13px] font-bold text-[#7A6E5F] uppercase tracking-wider"
          style="font-family: 'Baloo 2', cursive"
        >
          Suas Categorias
        </span>
        <RouterLink to="/categorias" class="text-xs font-bold text-[#E8500A] cursor-pointer">
          + Nova
        </RouterLink>
      </div>

      <!-- Loading state -->
      <div v-if="isLoading" class="flex flex-col gap-2.5 mb-5">
        <div
          v-for="i in 3"
          :key="i"
          class="rounded-2xl p-3.5 border border-[#E5D9C3] bg-white h-20 animate-pulse"
        />
      </div>

      <!-- Empty state -->
      <div
        v-else-if="!categories?.length"
        class="rounded-2xl p-5 border border-[#E5D9C3] bg-white text-center mb-5"
      >
        <p class="text-sm text-[#7A6E5F]">Nenhuma categoria ainda.</p>
        <RouterLink to="/categorias" class="text-sm font-bold text-[#E8500A] mt-1 block">
          Criar primeira categoria →
        </RouterLink>
      </div>

      <div v-else class="flex flex-col gap-2.5 mb-5">
        <div
          v-for="cat in categories"
          :key="cat.id"
          class="rounded-2xl p-3.5 border cursor-pointer transition-all hover:-translate-y-px hover:shadow-md bg-white"
          style="border-color: #e5d9c3"
        >
          <div class="flex justify-between items-center mb-2.5">
            <div class="flex items-center gap-2.5">
              <div
                class="w-9.5 h-9.5 rounded-[11px] flex items-center justify-center text-lg shrink-0 bg-[#FEF0E8]"
              >
                {{ cat.icon ?? '📦' }}
              </div>
              <div>
                <div
                  class="text-sm font-bold text-[#1A1008]"
                  style="font-family: 'Baloo 2', cursive"
                >
                  {{ cat.name }}
                </div>
                <div class="text-[11px] text-[#7A6E5F] mt-0.5">
                  R$ {{ formatBRL(spent(cat)) }} gasto
                </div>
              </div>
            </div>
            <div class="text-right">
              <div
                class="text-[15px] font-bold"
                :style="{
                  color: pct(cat) >= 90 ? '#C0252A' : '#1A1008',
                  fontFamily: 'Baloo 2, cursive',
                }"
              >
                R$ {{ formatBRL(parseFloat(cat.current_balance)) }}
              </div>
              <div class="text-[11px]" :style="{ color: pct(cat) >= 90 ? '#C0252A' : '#7A6E5F' }">
                {{ pct(cat) }}% usado
              </div>
            </div>
          </div>
          <div class="h-1.5 rounded-full overflow-hidden" style="background: #e5d9c3">
            <div
              class="h-full rounded-full transition-all"
              :style="{ width: pct(cat) + '%', background: barColor(pct(cat)) }"
            />
          </div>
        </div>
      </div>
    </main>

    <BottomNav />
  </div>
</template>
