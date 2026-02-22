<script setup lang="ts">
import { RouterLink } from 'vue-router'
import BottomNav from '@/components/BottomNav.vue'

const categories = [
  { name: 'Feira e Mercado', icon: '🛒', iconBg: '#FEF0E8', balance: 'R$ 800', used: 'R$ 200 gasto', pct: 20, barColor: '#1E8C45', isOver: false },
  { name: 'Transporte', icon: '🚌', iconBg: '#FEFAE8', balance: 'R$ 650', used: 'R$ 350 gasto', pct: 35, barColor: '#F5C518', isOver: false },
  { name: 'Lazer & Forró', icon: '🎉', iconBg: '#FAEAEA', balance: 'R$ 50', used: 'R$ 450 gasto', pct: 90, barColor: '#C0252A', isOver: true },
  { name: 'Saúde', icon: '🏥', iconBg: '#E8F7EE', balance: 'R$ 900', used: 'R$ 100 gasto', pct: 10, barColor: '#1E8C45', isOver: false },
]
</script>

<template>
  <div class="min-h-screen flex flex-col bg-[#F5EDD8]">
    <!-- App header -->
    <header
      class="flex items-center justify-between px-4 py-3 shrink-0 border-b-2 border-[#E5D9C3]"
      style="background: #fff"
    >
      <div class="font-bold text-[#1A1008] text-xl leading-none" style="font-family: 'Baloo 2', cursive">
        Tá <span style="color: #E8500A">Liso</span> 💸
      </div>
      <div
        class="w-[34px] h-[34px] rounded-full flex items-center justify-center text-white text-[13px] font-bold shrink-0"
        style="font-family: 'Baloo 2', cursive; background: linear-gradient(135deg, #E8500A 0%, #F5C518 100%)"
      >
        JA
      </div>
    </header>

    <!-- Scrollable content -->
    <main class="flex-1 overflow-y-auto px-4 py-4">
      <!-- Summary card -->
      <div
        class="rounded-[20px] p-5 mb-4 relative overflow-hidden"
        style="background: linear-gradient(135deg, #E8500A 0%, #C03A00 100%); box-shadow: 0 8px 24px rgba(232,80,10,0.35)"
      >
        <span class="absolute text-[80px] -top-2 -right-2 opacity-[0.12]">🌵</span>
        <div class="text-[10px] text-white/60 uppercase tracking-widest font-bold mb-1">
          Saldo disponível no mês
        </div>
        <div class="text-white text-[34px] font-extrabold leading-tight tracking-tight" style="font-family: 'Baloo 2', cursive">
          <span class="text-[15px] font-medium opacity-70">R$</span> 2.850<span class="text-[15px] font-medium opacity-70">,00</span>
        </div>
        <div
          class="inline-flex items-center gap-1.5 rounded-full py-1 px-2.5 mt-2 text-[11px] font-bold text-white"
          style="background: rgba(255,255,255,0.15); backdrop-filter: blur(4px)"
        >
          📅 Fevereiro 2025
        </div>
        <div class="flex gap-0 mt-3.5 pt-3.5 border-t border-white/15">
          <div class="flex-1">
            <div class="text-[9px] text-white/50 uppercase tracking-wider font-bold mb-0.5">Orçado</div>
            <div class="text-sm font-bold text-white" style="font-family: 'Baloo 2', cursive">R$ 4.500</div>
          </div>
          <div class="flex-1 border-l border-white/15 pl-3">
            <div class="text-[9px] text-white/50 uppercase tracking-wider font-bold mb-0.5">Gasto</div>
            <div class="text-sm font-bold text-[#FFB3A0]" style="font-family: 'Baloo 2', cursive">R$ 1.650</div>
          </div>
          <div class="flex-1 border-l border-white/15 pl-3">
            <div class="text-[9px] text-white/50 uppercase tracking-wider font-bold mb-0.5">Sobrou</div>
            <div class="text-sm font-bold text-[#A8FFB3]" style="font-family: 'Baloo 2', cursive">R$ 2.850</div>
          </div>
        </div>
      </div>

      <!-- Alert -->
      <div
        class="rounded-[14px] p-3 px-3.5 flex items-center gap-2.5 mb-3 border"
        style="background: #FAEAEA; border-color: rgba(192,37,42,0.2)"
      >
        <span class="text-xl">⚠️</span>
        <p class="text-xs font-semibold text-[#C0252A] leading-snug">
          Lazer tá quase no limite! Só sobrou R$ 50,00, cabra!
        </p>
      </div>

      <!-- Section: Suas Categorias -->
      <div class="flex justify-between items-center mb-2.5">
        <span
          class="text-[13px] font-bold text-[#7A6E5F] uppercase tracking-wider"
          style="font-family: 'Baloo 2', cursive"
        >
          Suas Categorias
        </span>
        <RouterLink to="/categorias" class="text-xs font-bold text-[#E8500A] cursor-pointer">
          + Nova
        </RouterLink>
      </div>
      <div class="flex flex-col gap-2.5 mb-5">
        <div
          v-for="cat in categories"
          :key="cat.name"
          class="rounded-2xl p-3.5 border cursor-pointer transition-all hover:-translate-y-px hover:shadow-md bg-white"
          style="border-color: #E5D9C3"
        >
          <div class="flex justify-between items-center mb-2.5">
            <div class="flex items-center gap-2.5">
              <div
                class="w-[38px] h-[38px] rounded-[11px] flex items-center justify-center text-lg shrink-0"
                :style="{ background: cat.iconBg }"
              >
                {{ cat.icon }}
              </div>
              <div>
                <div class="text-sm font-bold text-[#1A1008]" style="font-family: 'Baloo 2', cursive">{{ cat.name }}</div>
                <div class="text-[11px] text-[#7A6E5F] mt-0.5">8 lançamentos</div>
              </div>
            </div>
            <div class="text-right">
              <div
                class="text-[15px] font-bold"
                :style="{ color: cat.isOver ? '#C0252A' : '#1A1008', fontFamily: 'Baloo 2, cursive' }"
              >
                {{ cat.balance }}
              </div>
              <div class="text-[11px]" :style="{ color: cat.isOver ? '#C0252A' : '#7A6E5F' }">{{ cat.used }}</div>
            </div>
          </div>
          <div class="h-1.5 rounded-full overflow-hidden" style="background: #E5D9C3">
            <div
              class="h-full rounded-full transition-all"
              :style="{ width: cat.pct + '%', background: cat.barColor }"
            />
          </div>
        </div>
      </div>
    </main>

    <BottomNav />
  </div>
</template>
