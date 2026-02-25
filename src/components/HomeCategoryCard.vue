<script setup lang="ts">
import type { CategoryResponse } from '@/api/generated/táLisoAPI.schemas'
import { categoryPercentage, barColor, categorySpent, formatBRL } from '@/utils/categoryHelpers'

defineProps<{
  category: CategoryResponse
}>()
</script>

<template>
  <div
    class="rounded-2xl p-3.5 border cursor-pointer transition-all hover:-translate-y-px hover:shadow-md bg-white"
    style="border-color: #e5d9c3"
  >
    <div class="flex justify-between items-center mb-2.5">
      <div class="flex items-center gap-2.5">
        <div
          class="w-9.5 h-9.5 rounded-[11px] flex items-center justify-center text-lg shrink-0 bg-[#FEF0E8]"
        >
          {{ category.icon ?? '📦' }}
        </div>
        <div>
          <div
            class="text-sm font-bold text-[#1A1008]"
            style="font-family: 'Baloo 2', cursive"
          >
            {{ category.name }}
          </div>
          <div class="text-[11px] text-[#7A6E5F] mt-0.5">
            R$ {{ formatBRL(categorySpent(category)) }} gasto
          </div>
        </div>
      </div>
      <div class="text-right">
        <div
          class="text-[15px] font-bold"
          :style="{
            color: categoryPercentage(category) >= 90 ? '#C0252A' : '#1A1008',
            fontFamily: 'Baloo 2, cursive',
          }"
        >
          R$ {{ formatBRL(parseFloat(category.current_balance)) }}
        </div>
        <div
          class="text-[11px]"
          :style="{ color: categoryPercentage(category) >= 90 ? '#C0252A' : '#7A6E5F' }"
        >
          {{ categoryPercentage(category) }}% usado
        </div>
      </div>
    </div>
    <div class="h-1.5 rounded-full overflow-hidden" style="background: #e5d9c3">
      <div
        class="h-full rounded-full transition-all"
        :style="{
          width: categoryPercentage(category) + '%',
          background: barColor(categoryPercentage(category)),
        }"
      />
    </div>
  </div>
</template>
