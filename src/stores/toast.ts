import { ref } from 'vue'
import { defineStore } from 'pinia'

export type ToastType = 'warning' | 'info' | 'success'

export type Toast = {
  id: number
  message: string
  type: ToastType
}

const DEFAULT_DURATION_MS = 5000

export const useToastStore = defineStore('toast', () => {
  const toasts = ref<Toast[]>([])
  let nextId = 0
  const timeoutsById = new Map<number, ReturnType<typeof setTimeout>>()

  function show(message: string, type: ToastType = 'warning', durationMs = DEFAULT_DURATION_MS) {
    const id = ++nextId
    toasts.value.push({ id, message, type })
    const timeoutId = setTimeout(() => {
      dismiss(id)
      timeoutsById.delete(id)
    }, durationMs)
    timeoutsById.set(id, timeoutId)
  }

  function dismiss(id: number) {
    const tid = timeoutsById.get(id)
    if (tid) clearTimeout(tid)
    timeoutsById.delete(id)
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }

  function dismissAll() {
    timeoutsById.forEach(clearTimeout)
    timeoutsById.clear()
    toasts.value = []
  }

  return { toasts, show, dismiss, dismissAll }
})
