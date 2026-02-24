<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useToastStore } from '@/stores/toast'
import type { ToastType } from '@/stores/toast'

const toastStore = useToastStore()
const { toasts } = storeToRefs(toastStore)

function bgClass(type: ToastType): string {
  if (type === 'success') return 'bg-[#E8F7EE] border-[#1E8C45]/30 text-[#1A1008]'
  if (type === 'info') return 'bg-[#FEF0E8] border-[#e8500a]/25 text-[#1A1008]'
  return 'bg-[#faeaea] border-[#C0252A]/25 text-[#C0252A]'
}
</script>

<template>
  <div
    class="fixed top-4 right-4 z-[9999] flex flex-col gap-2 max-w-[min(90vw,360px)] pointer-events-none"
    aria-live="polite"
  >
    <div
      v-for="t in toasts"
      :key="t.id"
      class="pointer-events-auto rounded-[14px] px-3.5 py-3 flex items-center gap-2.5 border shadow-lg"
      :class="bgClass(t.type)"
    >
      <span class="text-lg shrink-0">{{ t.type === 'warning' ? '⚠️' : t.type === 'success' ? '✅' : '💬' }}</span>
      <p class="text-xs font-semibold leading-snug flex-1">{{ t.message }}</p>
      <button
        type="button"
        class="shrink-0 w-6 h-6 rounded-full flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity"
        :class="t.type === 'warning' ? 'hover:bg-[#C0252A]/10' : 'hover:bg-black/5'"
        aria-label="Fechar"
        @click="toastStore.dismiss(t.id)"
      >
        ×
      </button>
    </div>
  </div>
</template>
