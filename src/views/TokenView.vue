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
    class="min-h-screen flex flex-col lg:flex-row relative overflow-hidden"
    style="background: #1A1008"
  >
    <!-- Banner strip -->
    <div class="absolute top-0 left-0 right-0 z-20 flex w-full h-3.5 shrink-0">
      <div class="flex-1 min-w-0 bg-[#F5C518]" />
      <div class="flex-1 min-w-0 bg-[#E8500A]" />
      <div class="flex-1 min-w-0 bg-[#C0252A]" />
      <div class="flex-1 min-w-0 bg-[#6B2D8B]" />
      <div class="flex-1 min-w-0 bg-[#1A5C9E]" />
      <div class="flex-1 min-w-0 bg-[#1E8C45]" />
      <div class="flex-1 min-w-0 bg-[#F5C518]" />
      <div class="flex-1 min-w-0 bg-[#E8500A]" />
    </div>

    <!-- Decorative gradients (desktop) -->
    <div
      class="hidden lg:block absolute w-[600px] h-[600px] rounded-full pointer-events-none"
      style="background: radial-gradient(circle, rgba(232,80,10,0.25) 0%, transparent 70%); top: -150px; right: -100px"
      aria-hidden="true"
    />
    <div
      class="hidden lg:block absolute w-[400px] h-[400px] rounded-full pointer-events-none"
      style="background: radial-gradient(circle, rgba(245,197,24,0.15) 0%, transparent 70%); bottom: -100px; left: -80px"
      aria-hidden="true"
    />
    <!-- Mobile: star + radial overlay -->
    <div
      class="lg:hidden absolute bottom-28 right-0 text-[120px] opacity-[0.04] pointer-events-none select-none"
      aria-hidden="true"
    >
      ★
    </div>
    <div
      class="lg:hidden absolute inset-0 pointer-events-none"
      style="background: radial-gradient(ellipse 80% 60% at 50% 40%, rgba(45,28,12,0.9) 0%, #1A1008 70%)"
      aria-hidden="true"
    />

    <!-- Mobile layout -->
    <div class="lg:hidden relative z-10 flex flex-col flex-1 px-6 pt-14 pb-8">
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
          class="rounded-xl py-3 px-3.5 flex items-start gap-2.5"
          style="border: 1px solid rgba(245,197,24,0.4); background: rgba(245,197,24,0.12)"
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

    <!-- Desktop layout: centered card -->
    <div class="hidden lg:flex flex-1 items-center justify-center relative z-10 pt-14">
      <div
        class="w-[420px] rounded-3xl p-10 backdrop-blur-xl"
        style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1)"
      >
        <div class="text-[36px] font-extrabold text-white leading-none mb-1" style="font-family: 'Baloo 2', cursive">
          Tá <span class="text-[#F5C518]">Liso</span> 💸
        </div>
        <p class="text-[13px] text-white/40 italic mb-8">"Bora organizar o dinheiro, visse?"</p>
        <h3 class="text-[22px] font-bold text-white mb-1" style="font-family: 'Baloo 2', cursive">Código chegou! 📬</h3>
        <p class="text-[13px] text-white/45 leading-relaxed mb-6">
          Olha no teu e-mail e digita os 6 números aqui.
        </p>
        <div
          class="rounded-xl py-3 px-4 mb-6 flex items-start gap-2.5"
          style="border: 1px solid rgba(245,197,24,0.4); background: rgba(245,197,24,0.12)"
        >
          <span class="text-xl">✉️</span>
          <div class="text-sm text-white/80 leading-snug" style="font-family: 'Nunito', sans-serif">
            Código enviado pra {{ email }} — chega rapidinho!
          </div>
        </div>
        <TokenCodeInput v-model="code" />
        <button
          type="button"
          class="w-full py-4 rounded-xl text-[15px] font-bold text-white border-0 cursor-pointer mt-4 transition-opacity hover:opacity-95"
          style="font-family: 'Baloo 2', cursive; background: linear-gradient(135deg, #E8500A, #F5C518); box-shadow: 0 6px 20px rgba(232,80,10,0.4)"
          @click="submit"
        >
          Entrar de vez! 🎉
        </button>
      </div>
    </div>
  </div>
</template>
