<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import TokenCodeInput from '@/components/TokenCodeInput.vue'

const router = useRouter()
const route = useRoute()

const email = (route.query.email as string) || 'joao@email.com'
const code = ref('')

function submit() {
  router.push({ name: 'home' })
}
</script>

<template>
  <div
    class="min-h-screen flex flex-col relative overflow-hidden"
    style="background: #1A1008"
  >
    <!-- Banner strip -->
    <div
      style="position: relative; z-index: 10; display: flex; width: 100%; height: 14px; flex-shrink: 0"
    >
      <div style="flex: 1; min-width: 0; background: #F5C518" />
      <div style="flex: 1; min-width: 0; background: #E8500A" />
      <div style="flex: 1; min-width: 0; background: #C0252A" />
      <div style="flex: 1; min-width: 0; background: #6B2D8B" />
      <div style="flex: 1; min-width: 0; background: #1A5C9E" />
      <div style="flex: 1; min-width: 0; background: #1E8C45" />
      <div style="flex: 1; min-width: 0; background: #F5C518" />
      <div style="flex: 1; min-width: 0; background: #E8500A" />
    </div>

    <div
      class="absolute bottom-28 right-0 text-[120px] opacity-[0.04] pointer-events-none select-none"
      aria-hidden="true"
    >
      ★
    </div>
    <div
      class="absolute inset-0 pointer-events-none select-none"
      aria-hidden="true"
      style="background: radial-gradient(ellipse 80% 60% at 50% 40%, rgba(45,28,12,0.9) 0%, #1A1008 70%)"
    />

    <div class="relative z-10 flex flex-col flex-1 px-6 pt-6 pb-8">
      <div class="pt-2">
        <h1 class="text-3xl font-extrabold text-white leading-tight tracking-tight" style="font-family: 'Baloo 2', cursive">
          Tá <span style="color: #F5C518">Liso</span> 💸
        </h1>
        <p class="text-sm text-white/60 mt-1 font-medium italic" style="font-family: 'Nunito', sans-serif">
          "Bora organizar o dinheiro, visse?"
        </p>
      </div>

      <div class="flex-1 min-h-8" />

      <div class="space-y-4">
        <h2 class="text-2xl font-bold text-white" style="font-family: 'Baloo 2', cursive">
          Código chegou! 📬
        </h2>
        <p class="text-sm text-white/70 leading-snug max-w-sm" style="font-family: 'Nunito', sans-serif">
          Olha no teu e-mail e digita os 6 números aqui.
        </p>

        <div
          style="border-radius: 12px; padding: 12px 14px; border: 1px solid rgba(245,197,24,0.4); background: rgba(245,197,24,0.12); display: flex; align-items: flex-start; gap: 10px"
        >
          <span class="text-xl">✉️</span>
          <div class="text-sm text-white/80 leading-snug" style="font-family: 'Nunito', sans-serif">
            Código enviado pra {{ email }} —<br>
            chega rapidinho!
          </div>
        </div>

        <TokenCodeInput v-model="code" />

        <button
          type="button"
          class="w-full py-4 rounded-xl text-base font-bold text-white transition-opacity hover:opacity-95 active:opacity-90"
          style="font-family: 'Baloo 2', cursive; background: linear-gradient(90deg, #E8500A 0%, #F5C518 100%); box-shadow: 0 4px 20px rgba(232,80,10,0.35)"
          @click="submit"
        >
          Entrar de vez! 🎉
        </button>
      </div>
    </div>
  </div>
</template>
