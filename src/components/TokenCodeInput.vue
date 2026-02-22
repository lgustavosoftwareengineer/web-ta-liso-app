<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'

const TOKEN_LENGTH = 6

const model = defineModel<string>({ default: '' })

const inputRefs = ref<(HTMLInputElement | null)[]>(Array(TOKEN_LENGTH).fill(null))

const sanitize = (value: string) => value.replace(/[^a-zA-Z0-9]/g, '')

const toChars = (value: string): string[] =>
  Array.from({ length: TOKEN_LENGTH }, (_, i) => (sanitize(value).slice(0, TOKEN_LENGTH).split('')[i] ?? ''))

const setCharAt = (arr: string[], index: number, char: string): string[] =>
  arr.map((c, i) => (i === index ? char : c))

const chars = computed(() => toChars(model.value ?? ''))

function updateModelAt(index: number, char: string) {
  const arr = toChars(model.value ?? '')
  model.value = setCharAt(arr, index, char).join('')
}

function onInput(index: number, e: Event) {
  const target = e.target as HTMLInputElement
  const val = sanitize(target.value).slice(-1)
  updateModelAt(index, val)
  if (val && index < TOKEN_LENGTH - 1) {
    nextTick(() => inputRefs.value[index + 1]?.focus())
  }
}

function onKeydown(index: number, e: KeyboardEvent) {
  if (e.key !== 'Backspace' || chars.value[index] !== '' || index <= 0) return
  updateModelAt(index - 1, '')
  const prev = inputRefs.value[index - 1]
  nextTick(() => {
    prev?.focus()
    prev?.select()
  })
}

function onPaste(e: ClipboardEvent) {
  e.preventDefault()
  const pasted = sanitize(e.clipboardData?.getData('text') ?? '').slice(0, TOKEN_LENGTH)
  model.value = pasted
  const nextIndex = Math.min(pasted.length, TOKEN_LENGTH - 1)
  nextTick(() => inputRefs.value[nextIndex]?.focus())
}
</script>

<template>
  <div style="display: flex; gap: 8px">
    <input
      v-for="(c, i) in chars"
      :ref="(el) => { if (el) inputRefs[i] = el as HTMLInputElement }"
      :key="i"
      :value="c"
      type="text"
      inputmode="text"
      maxlength="1"
      autocomplete="one-time-code"
      style="flex: 1; min-width: 0; height: 52px; border-radius: 10px; text-align: center; font-family: 'Baloo 2', cursive; font-size: 22px; font-weight: 700; border: 2px solid rgba(255,255,255,0.2); background: rgba(255,255,255,0.06); color: #fff; outline: none; caret-color: #F5C518"
      :style="c ? { borderColor: '#F5C518', background: 'rgba(245,197,24,0.15)', color: '#F5C518' } : {}"
      @input="onInput(i, $event)"
      @keydown="onKeydown(i, $event)"
      @paste="onPaste"
    >
  </div>
</template>
