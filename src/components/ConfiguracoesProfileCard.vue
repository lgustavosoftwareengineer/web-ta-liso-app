<script setup lang="ts">
defineProps<{
  initials: string
  name: string
  email: string
  isLoading: boolean
}>()
</script>

<template>
  <div
    class="rounded-[20px] p-5 mb-4 flex items-center gap-3.5 relative overflow-hidden"
    style="
      background: linear-gradient(135deg, #e8500a 0%, #c03a00 100%);
      box-shadow: 0 8px 24px rgba(232, 80, 10, 0.3);
    "
  >
    <span class="absolute text-[80px] -top-2 -right-2 opacity-10">💸</span>
    <div
      class="w-13.5 h-13.5 rounded-full flex items-center justify-center text-white text-[22px] font-extrabold shrink-0 border-2 border-white/30"
      style="font-family: 'Baloo 2', cursive; background: rgba(255, 255, 255, 0.2)"
    >
      <span v-if="isLoading" class="w-6 h-6 rounded-full bg-white/30 animate-pulse" />
      <template v-else>{{ initials }}</template>
    </div>
    <div class="flex-1 min-w-0">
      <div v-if="isLoading" class="w-32 h-3 rounded bg-white/30 animate-pulse mb-1" />
      <div
        v-else
        class="text-sm font-bold text-white truncate"
        style="font-family: 'Baloo 2', cursive"
      >
        {{ name || '—' }}
      </div>
      <div v-if="isLoading" class="w-44 h-2.5 rounded bg-white/30 animate-pulse mt-1" />
      <div v-else class="text-xs text-white/60 font-semibold truncate">{{ email }}</div>
    </div>
  </div>
</template>
