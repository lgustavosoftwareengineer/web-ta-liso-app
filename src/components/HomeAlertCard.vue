<script setup lang="ts">
import type { CategoryResponse } from '@/api/generated/táLisoAPI.schemas'
import { formatBRL, categoryPercentage } from '@/utils/categoryHelpers'

defineProps<{
  category: CategoryResponse
}>()
</script>

<template>
  <div
    class="rounded-[14px] p-3 px-3.5 flex items-center gap-2.5 mb-3 border"
    style="background: #faeaea; border-color: rgba(192, 37, 42, 0.2)"
  >
    <span class="text-xl">⚠️</span>
    <p
      v-if="categoryPercentage(category) === 100"
      class="text-xs font-semibold text-[#C0252A] leading-snug"
    >
      {{ category.icon ?? '📦' }} Sobrou nada para o betinha 😢! Tá tudo gasto no
      {{ category.name }}!
    </p>
    <p v-else class="text-xs font-semibold text-[#C0252A] leading-snug">
      {{ category.icon ?? '📦' }} {{ category.name }} tá quase no limite! Só sobrou R$
      {{ formatBRL(parseFloat(category.current_balance)) }}, cabra!
    </p>
  </div>
</template>
