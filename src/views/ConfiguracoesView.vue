<script setup lang="ts">
import { ref } from 'vue'
import BottomNav from '@/components/BottomNav.vue'

const userName = ref('João Alves')
const notificationsOn = ref(true)
const resetMensalOn = ref(true)
const alertarSaldoOn = ref(true)
const bloquearNegativoOn = ref(false)
</script>

<template>
  <div class="min-h-screen flex flex-col bg-[#F5EDD8]">
    <header class="flex items-center justify-between px-4 py-3 shrink-0 border-b-2 border-[#E5D9C3] bg-white">
      <span class="text-xl font-extrabold text-[#1A1008]" style="font-family: 'Baloo 2', cursive">⚙️ Configurações</span>
      <div
        class="w-[34px] h-[34px] rounded-full flex items-center justify-center text-white text-[13px] font-bold shrink-0"
        style="font-family: 'Baloo 2', cursive; background: linear-gradient(135deg, #E8500A 0%, #F5C518 100%)"
      >
        JA
      </div>
    </header>

    <main class="flex-1 overflow-y-auto p-4">
      <!-- Perfil card -->
      <div
        class="rounded-[20px] p-5 mb-4 flex items-center gap-3.5 relative overflow-hidden"
        style="background: linear-gradient(135deg, #E8500A 0%, #C03A00 100%); box-shadow: 0 8px 24px rgba(232,80,10,0.3)"
      >
        <span class="absolute text-[80px] -top-2 -right-2 opacity-10">💸</span>
        <div
          class="w-[54px] h-[54px] rounded-full flex items-center justify-center text-white text-[22px] font-extrabold shrink-0 border-2 border-white/30"
          style="font-family: 'Baloo 2', cursive; background: rgba(255,255,255,0.2)"
        >
          JA
        </div>
        <div>
          <div class="text-lg font-extrabold text-white" style="font-family: 'Baloo 2', cursive">João Alves</div>
          <div class="text-xs text-white/60 font-semibold">joao@email.com</div>
        </div>
      </div>

      <!-- Perfil -->
      <div class="text-[13px] font-bold text-[#7A6E5F] uppercase tracking-wider mb-2.5" style="font-family: 'Baloo 2', cursive">
        Perfil
      </div>
      <div class="rounded-2xl border border-[#E5D9C3] bg-white overflow-hidden mb-4">
        <div class="p-3.5 border-b border-[#E5D9C3]">
          <label class="text-[10px] font-bold text-[#7A6E5F] uppercase tracking-wider block mb-1.5">Seu nome</label>
          <input
            v-model="userName"
            type="text"
            class="w-full border border-[#E5D9C3] rounded-[10px] py-2 px-3 text-[13px] text-[#1A1008] bg-[#F5EDD8] outline-none"
          />
        </div>
        <div class="p-3.5 border-b border-[#E5D9C3]">
          <label class="text-[10px] font-bold text-[#7A6E5F] uppercase tracking-wider block mb-1.5">E-mail</label>
          <div class="text-[13px] text-[#7A6E5F] bg-[#F5EDD8] border border-[#E5D9C3] rounded-[10px] py-2 px-3">joao@email.com</div>
          <div class="text-[10px] text-[#7A6E5F] mt-1">O e-mail não pode ser alterado</div>
        </div>
        <div class="p-3.5">
          <button
            type="button"
            class="w-full py-2.5 rounded-[10px] border-0 text-white text-[13px] font-bold cursor-pointer"
            style="font-family: 'Baloo 2', cursive; background: linear-gradient(135deg, #E8500A, #F5C518)"
          >
            Salvar alterações 💾
          </button>
        </div>
      </div>

      <!-- Conta -->
      <div class="text-[13px] font-bold text-[#7A6E5F] uppercase tracking-wider mb-2.5" style="font-family: 'Baloo 2', cursive">
        Conta
      </div>
      <div class="rounded-2xl border border-[#E5D9C3] bg-white overflow-hidden mb-4">
        <div class="flex items-center justify-between p-3.5 cursor-pointer">
          <div class="flex items-center gap-2.5">
            <span class="text-lg">🔔</span>
            <div>
              <div class="text-[13px] font-bold text-[#1A1008]" style="font-family: 'Baloo 2', cursive">Notificações</div>
              <div class="text-[11px] text-[#7A6E5F]">Alertas de saldo baixo</div>
            </div>
          </div>
          <button
            type="button"
            class="w-[42px] h-6 rounded-xl relative cursor-pointer border-0 transition-colors"
            :class="notificationsOn ? 'bg-[#1E8C45]' : 'bg-[#E5D9C3]'"
            @click="notificationsOn = !notificationsOn"
          >
            <span
              class="absolute w-5 h-5 bg-white rounded-full top-0.5 shadow-sm transition-all"
              :class="notificationsOn ? 'right-0.5' : 'left-0.5'"
            />
          </button>
        </div>
      </div>

      <!-- Orçamento -->
      <div class="text-[13px] font-bold text-[#7A6E5F] uppercase tracking-wider mb-2.5" style="font-family: 'Baloo 2', cursive">
        Orçamento
      </div>
      <div class="rounded-2xl border border-[#E5D9C3] bg-white overflow-hidden mb-4">
        <div class="flex items-center justify-between p-3.5 border-b border-[#E5D9C3] cursor-pointer">
          <div class="flex items-center gap-2.5">
            <span class="text-lg">🔄</span>
            <div>
              <div class="text-[13px] font-bold text-[#1A1008]" style="font-family: 'Baloo 2', cursive">Reset mensal</div>
              <div class="text-[11px] text-[#7A6E5F]">Zera saldos todo dia 1º</div>
            </div>
          </div>
          <button
            type="button"
            class="w-[42px] h-6 rounded-xl relative cursor-pointer border-0 transition-colors"
            :class="resetMensalOn ? 'bg-[#1E8C45]' : 'bg-[#E5D9C3]'"
            @click="resetMensalOn = !resetMensalOn"
          >
            <span
              class="absolute w-5 h-5 bg-white rounded-full top-0.5 shadow-sm transition-all"
              :class="resetMensalOn ? 'right-0.5' : 'left-0.5'"
            />
          </button>
        </div>
        <div class="flex items-center justify-between p-3.5 border-b border-[#E5D9C3] cursor-pointer">
          <div class="flex items-center gap-2.5">
            <span class="text-lg">⚠️</span>
            <div>
              <div class="text-[13px] font-bold text-[#1A1008]" style="font-family: 'Baloo 2', cursive">Alertar saldo baixo</div>
              <div class="text-[11px] text-[#7A6E5F]">Quando atingir 20% do saldo</div>
            </div>
          </div>
          <button
            type="button"
            class="w-[42px] h-6 rounded-xl relative cursor-pointer border-0 transition-colors"
            :class="alertarSaldoOn ? 'bg-[#1E8C45]' : 'bg-[#E5D9C3]'"
            @click="alertarSaldoOn = !alertarSaldoOn"
          >
            <span
              class="absolute w-5 h-5 bg-white rounded-full top-0.5 shadow-sm transition-all"
              :class="alertarSaldoOn ? 'right-0.5' : 'left-0.5'"
            />
          </button>
        </div>
        <div class="flex items-center justify-between p-3.5 cursor-pointer">
          <div class="flex items-center gap-2.5">
            <span class="text-lg">🚫</span>
            <div>
              <div class="text-[13px] font-bold text-[#1A1008]" style="font-family: 'Baloo 2', cursive">Bloquear saldo negativo</div>
              <div class="text-[11px] text-[#7A6E5F]">Impedir gastos acima do saldo</div>
            </div>
          </div>
          <button
            type="button"
            class="w-[42px] h-6 rounded-xl relative cursor-pointer border-0 transition-colors"
            :class="bloquearNegativoOn ? 'bg-[#1E8C45]' : 'bg-[#E5D9C3]'"
            @click="bloquearNegativoOn = !bloquearNegativoOn"
          >
            <span
              class="absolute w-5 h-5 bg-white rounded-full top-0.5 shadow-sm transition-all"
              :class="bloquearNegativoOn ? 'right-0.5' : 'left-0.5'"
            />
          </button>
        </div>
      </div>

      <!-- Dados -->
      <div class="text-[13px] font-bold text-[#7A6E5F] uppercase tracking-wider mb-2.5" style="font-family: 'Baloo 2', cursive">
        Dados
      </div>
      <div class="rounded-2xl border border-[#E5D9C3] bg-white overflow-hidden mb-4">
        <div class="flex items-center justify-between p-3.5 border-b border-[#E5D9C3] cursor-pointer">
          <div class="flex items-center gap-2.5">
            <span class="text-lg">📋</span>
            <div>
              <div class="text-[13px] font-bold text-[#1A1008]" style="font-family: 'Baloo 2', cursive">Exportar histórico</div>
              <div class="text-[11px] text-[#7A6E5F]">Baixar CSV dos lançamentos</div>
            </div>
          </div>
          <span class="text-[#7A6E5F] text-base">›</span>
        </div>
        <div class="flex items-center justify-between p-3.5 cursor-pointer">
          <div class="flex items-center gap-2.5">
            <span class="text-lg">🗑️</span>
            <div>
              <div class="text-[13px] font-bold text-[#C0252A]" style="font-family: 'Baloo 2', cursive">Limpar todos os dados</div>
              <div class="text-[11px] text-[#7A6E5F]">Remove categorias e lançamentos</div>
            </div>
          </div>
          <span class="text-[#7A6E5F] text-base">›</span>
        </div>
      </div>

      <!-- Logout -->
      <button
        type="button"
        class="w-full py-3.5 rounded-[14px] border border-[#C0252A]/30 bg-[#FAEAEA] text-[14px] font-bold text-[#C0252A] cursor-pointer mb-2"
        style="font-family: 'Baloo 2', cursive"
      >
        Sair da conta 👋
      </button>
      <div class="text-center text-[10px] text-[#7A6E5F] font-semibold pb-1">
        Tá Liso App v1.0.0
      </div>
    </main>

    <BottomNav />
  </div>
</template>
