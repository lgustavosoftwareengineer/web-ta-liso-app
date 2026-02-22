<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const email = ref('')

function sendCode() {
  router.push({ name: 'token', query: { email: email.value || undefined } })
}
</script>

<template>
  <div
    class="min-h-screen flex flex-col relative overflow-hidden"
    style="background: #1A1008"
  >
    <!-- Banner strip (above gradient) -->
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

    <!-- Subtle star decoration -->
    <div
      class="absolute bottom-28 right-0 text-[120px] opacity-[0.04] pointer-events-none select-none"
      aria-hidden="true"
    >
      ★
    </div>
    <!-- Radial gradient overlay -->
    <div
      class="absolute inset-0 pointer-events-none select-none"
      aria-hidden="true"
      style="background: radial-gradient(ellipse 80% 60% at 50% 40%, rgba(45,28,12,0.9) 0%, #1A1008 70%)"
    />

    <div class="relative z-10 flex flex-col flex-1 px-6 pt-6 pb-8">
      <!-- Brand + tagline -->
      <div class="pt-2">
        <h1 class="text-3xl font-extrabold text-white leading-tight tracking-tight" style="font-family: 'Baloo 2', cursive">
          Tá <span class="text-[#F5C518]">Liso</span> 💸
        </h1>
        <p class="text-sm text-white/60 mt-1 font-medium italic" style="font-family: 'Nunito', sans-serif">
          "Bora organizar o dinheiro, visse?"
        </p>
      </div>

      <!-- Spacer -->
      <div class="flex-1 min-h-16" />

      <!-- Login form -->
      <div class="space-y-4">
        <h2 class="text-2xl font-bold text-white" style="font-family: 'Baloo 2', cursive">
          Oxente, bora entrar!
        </h2>
        <p class="text-sm text-white/70 leading-snug max-w-sm" style="font-family: 'Nunito', sans-serif">
          Coloca seu e-mail aí que a gente manda um código. Sem senha, sem complicação.
        </p>

        <div class="space-y-2">
          <label class="block text-xs font-bold text-white/90 uppercase tracking-widest">
            Seu e-mail
          </label>
          <input
            v-model="email"
            type="email"
            placeholder="joao@email.com"
            class="w-full rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-white/40 bg-white/8 border border-white/20 outline-none transition-colors focus:border-[#F5C518]"
          >
        </div>

        <button
          type="button"
          class="w-full py-4 rounded-xl text-base font-bold text-white transition-opacity hover:opacity-95 active:opacity-90"
          style="font-family: 'Baloo 2', cursive; background: linear-gradient(90deg, #E8500A 0%, #F5C518 100%); box-shadow: 0 4px 20px rgba(232,80,10,0.35)"
          @click="sendCode"
        >
          Mandar o código 🚀
        </button>
      </div>
    </div>
  </div>
</template>
