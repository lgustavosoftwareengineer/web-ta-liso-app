<script setup lang="ts">
import { useCounterStore } from '@/stores/counter'

const counter = useCounterStore()
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
    <main class="max-w-md w-full text-center space-y-8">
      <h1 class="text-4xl font-bold text-slate-800">
        Ta Liso
      </h1>
      <p class="text-slate-600">
        Bem-vindo ao seu projeto. Tailwind, Pinia e Vitest configurados.
      </p>

      <section class="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
        <h2 class="text-lg font-semibold text-slate-700">
          Pinia (contador)
        </h2>
        <p class="text-3xl font-mono text-slate-900">
          {{ counter.count }}
        </p>
        <p class="text-sm text-slate-500">
          Dobro: {{ counter.doubleCount }}
        </p>
        <button
          type="button"
          class="px-4 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors"
          @click="counter.increment()"
        >
          Incrementar
        </button>
      </section>
    </main>
  </div>
</template>
