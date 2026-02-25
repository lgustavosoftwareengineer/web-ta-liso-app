<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useRequestCodeApiAuthRequestCodePost } from '@/api/generated/auth/auth'
import { useApiError } from '@/composables/useApiError'
import AppSpinner from '@/components/AppSpinner.vue'

const router = useRouter()
const { getErrorMessage } = useApiError()
const email = ref('')
const errorMsg = ref('')

const requestCode = useRequestCodeApiAuthRequestCodePost()

async function sendCode() {
  if (!email.value.trim()) return
  errorMsg.value = ''
  try {
    await requestCode.mutateAsync({ data: { email: email.value } })
    router.push({ name: 'token', query: { email: email.value } })
  } catch (e) {
    errorMsg.value = getErrorMessage(e)
  }
}
</script>

<template>
  <div
    class="min-h-screen flex flex-col lg:flex-row relative overflow-hidden"
    style="background: #1A1008"
  >
    <!-- Banner strip (above gradient) - full width -->
    <div
      class="absolute top-0 left-0 right-0 z-20 flex w-full h-3.5 shrink-0"
    >
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
          Tá <span class="text-[#F5C518]">Liso</span> 💸
        </h1>
        <p class="text-sm text-white/60 mt-1 font-medium italic" style="font-family: 'Nunito', sans-serif">
          "Bora organizar o dinheiro, visse?"
        </p>
      </div>
      <div class="flex-1 min-h-16" />
      <div class="space-y-4">
        <h2 class="text-2xl font-bold text-white" style="font-family: 'Baloo 2', cursive">
          Oxente, bora entrar!
        </h2>
        <p class="text-sm text-white/70 leading-snug max-w-sm" style="font-family: 'Nunito', sans-serif">
          Coloca seu e-mail aí que a gente manda um código. Sem senha, sem complicação.
        </p>
        <div class="space-y-2">
          <label class="block text-xs font-bold text-white/90 uppercase tracking-widest">Seu e-mail</label>
          <input
            v-model="email"
            type="email"
            placeholder="joao@email.com"
            class="w-full min-w-0 rounded-xl px-4 py-3.5 text-base text-white placeholder:text-white/40 bg-white/8 border border-white/20 outline-none focus:border-[#F5C518]"
            @keydown.enter="sendCode"
          >
          <p v-if="errorMsg" class="text-xs text-[#F5C518] font-semibold">{{ errorMsg }}</p>
        </div>
        <button
          type="button"
          class="w-full py-4 rounded-xl text-base font-bold text-white transition-opacity hover:opacity-95 active:opacity-90 disabled:opacity-50"
          style="font-family: 'Baloo 2', cursive; background: linear-gradient(90deg, #E8500A 0%, #F5C518 100%); box-shadow: 0 4px 20px rgba(232,80,10,0.35)"
          :disabled="requestCode.isPending.value"
          @click="sendCode"
        >
          <span class="flex items-center justify-center gap-2">
            <AppSpinner v-if="requestCode.isPending.value" size="sm" />
            {{ requestCode.isPending.value ? 'Enviando...' : 'Mandar o código 🚀' }}
          </span>
        </button>
      </div>
    </div>

    <!-- Desktop layout: left side (features) + right side (card) -->
    <div class="hidden lg:flex flex-1 items-center justify-center relative z-10 pt-14">
      <!-- Left: features -->
      <div class="flex-1 flex flex-col items-center justify-center py-10 px-10">
        <div class="text-[100px] mb-5 drop-shadow-lg" style="filter: drop-shadow(0 8px 24px rgba(232,80,10,0.4))">💸</div>
        <h2 class="text-[28px] font-extrabold text-white text-center leading-tight mb-2" style="font-family: 'Baloo 2', cursive">
          Seu dinheiro,<br>na palma da mão
        </h2>
        <p class="text-sm text-white/40 text-center leading-relaxed max-w-[280px] mb-7">
          Controle seus gastos com categorias personalizadas e registro via chat
        </p>
        <ul class="flex flex-col gap-3 list-none">
          <li class="flex items-center gap-2.5 text-[13px] text-white/60">
            <span class="w-1.5 h-1.5 rounded-full bg-[#F5C518] shrink-0" />Login sem senha — só o e-mail
          </li>
          <li class="flex items-center gap-2.5 text-[13px] text-white/60">
            <span class="w-1.5 h-1.5 rounded-full bg-[#F5C518] shrink-0" />Registre gastos conversando
          </li>
          <li class="flex items-center gap-2.5 text-[13px] text-white/60">
            <span class="w-1.5 h-1.5 rounded-full bg-[#F5C518] shrink-0" />Categorias com orçamento mensal
          </li>
          <li class="flex items-center gap-2.5 text-[13px] text-white/60">
            <span class="w-1.5 h-1.5 rounded-full bg-[#F5C518] shrink-0" />Resumo e histórico completo
          </li>
        </ul>
      </div>
      <!-- Right: login card -->
      <div class="w-[460px] flex items-center justify-center py-10 px-10 border-l border-white/10">
        <div
          class="w-[420px] rounded-3xl p-10 relative z-10 backdrop-blur-xl"
          style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1)"
        >
          <div class="text-[36px] font-extrabold text-white leading-none mb-1" style="font-family: 'Baloo 2', cursive">
            Tá <span class="text-[#F5C518]">Liso</span> 💸
          </div>
          <p class="text-[13px] text-white/40 italic mb-8">"Bora organizar o dinheiro, visse?"</p>
          <h3 class="text-[22px] font-bold text-white mb-1" style="font-family: 'Baloo 2', cursive">Oxente, bora entrar!</h3>
          <p class="text-[13px] text-white/45 leading-relaxed mb-6">
            Coloca teu e-mail aqui que a gente manda um código rapidinho. Sem senha, sem complicação.
          </p>
          <label class="block text-[10px] font-bold text-white/45 uppercase tracking-wider mb-1.5">Seu e-mail</label>
          <input
            v-model="email"
            type="email"
            placeholder="voce@email.com"
            class="w-full rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/40 bg-white/10 border border-white/20 outline-none mb-1 focus:border-[#F5C518]"
            @keydown.enter="sendCode"
          >
          <p v-if="errorMsg" class="text-xs text-[#F5C518] font-semibold mb-3">{{ errorMsg }}</p>
          <div v-else class="mb-4" />
          <button
            type="button"
            class="w-full py-4 rounded-xl text-[15px] font-bold text-white border-0 cursor-pointer transition-opacity hover:opacity-95 disabled:opacity-50"
            style="font-family: 'Baloo 2', cursive; background: linear-gradient(135deg, #E8500A, #F5C518); box-shadow: 0 6px 20px rgba(232,80,10,0.4)"
            :disabled="requestCode.isPending.value"
            @click="sendCode"
          >
            <span class="flex items-center justify-center gap-2">
              <AppSpinner v-if="requestCode.isPending.value" size="sm" />
              {{ requestCode.isPending.value ? 'Enviando...' : 'Mandar o código 🚀' }}
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
