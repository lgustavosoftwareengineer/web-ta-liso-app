<script setup lang="ts">
import { formatBRL } from '@/utils/categoryHelpers'

defineProps<{
  totalBudget: number
  totalSpent: number
  totalRemaining: number
  monthLabel: string
  isLoading: boolean
}>()
</script>

<template>
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
</template>
