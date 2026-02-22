<script setup lang="ts">
import { ref, computed } from 'vue'
import BottomNav from '@/components/BottomNav.vue'

const currentDate = ref(new Date(2025, 1)) // Fevereiro 2025

const monthLabel = computed(() => {
  const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
  return `${months[currentDate.value.getMonth()]} ${currentDate.value.getFullYear()}`
})

function prevMonth() {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1)
}
function nextMonth() {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1)
}

const categorySpending = [
  { name: 'Feira e Mercado', icon: '🛒', spent: 'R$ 200', budget: 'R$ 1.000', pct: 20, barColor: '#1E8C45', isWarning: false },
  { name: 'Transporte', icon: '🚌', spent: 'R$ 350', budget: 'R$ 1.000', pct: 35, barColor: '#F5C518', isWarning: false },
  { name: 'Lazer & Forró', icon: '🎉', spent: 'R$ 450', budget: 'R$ 500', pct: 90, barColor: '#C0252A', isWarning: true },
  { name: 'Saúde', icon: '🏥', spent: 'R$ 100', budget: 'R$ 1.000', pct: 10, barColor: '#1E8C45', isWarning: false },
]

const entriesByDay = [
  { day: '21 de fevereiro', items: [{ title: 'Mercado', category: 'Feira e Mercado', icon: '🛒', iconBg: '#FEF0E8', value: '− R$ 200' }] },
  { day: '20 de fevereiro', items: [
    { title: 'Uber', category: 'Transporte', icon: '🚌', iconBg: '#FEFAE8', value: '− R$ 45' },
    { title: 'Ônibus', category: 'Transporte', icon: '🚌', iconBg: '#FEFAE8', value: '− R$ 5' },
  ]},
  { day: '18 de fevereiro', items: [
    { title: 'Forró do Beto', category: 'Lazer & Forró', icon: '🎉', iconBg: '#FAEAEA', value: '− R$ 80' },
    { title: 'Cerveja na feira', category: 'Lazer & Forró', icon: '🎉', iconBg: '#FAEAEA', value: '− R$ 30' },
  ]},
  { day: '15 de fevereiro', items: [{ title: 'Farmácia', category: 'Saúde', icon: '🏥', iconBg: '#E8F7EE', value: '− R$ 100' }] },
  { day: '12 de fevereiro', items: [{ title: 'Uber pro aeroporto', category: 'Transporte', icon: '🚌', iconBg: '#FEFAE8', value: '− R$ 90' }] },
  { day: '10 de fevereiro', items: [{ title: 'Cinema', category: 'Lazer & Forró', icon: '🎉', iconBg: '#FAEAEA', value: '− R$ 40' }] },
  { day: '5 de fevereiro', items: [
    { title: 'Feira livre', category: 'Feira e Mercado', icon: '🛒', iconBg: '#FEF0E8', value: '− R$ 120' },
    { title: 'Ônibus', category: 'Transporte', icon: '🚌', iconBg: '#FEFAE8', value: '− R$ 5' },
  ]},
]
</script>

<template>
  <div class="min-h-screen flex flex-col bg-[#F5EDD8]">
    <header class="flex items-center justify-between px-4 py-3 shrink-0 border-b-2 border-[#E5D9C3] bg-white">
      <span class="text-xl font-extrabold text-[#1A1008]" style="font-family: 'Baloo 2', cursive">📊 Resumo</span>
    </header>

    <!-- Seletor de mês -->
    <div class="flex items-center justify-between py-2.5 px-4 border-b border-[#E5D9C3] bg-white shrink-0">
      <button
        type="button"
        class="w-8 h-8 rounded-full border border-[#E5D9C3] bg-[#F5EDD8] flex items-center justify-center text-[#1A1008] cursor-pointer text-base"
        @click="prevMonth"
      >
        ‹
      </button>
      <div class="text-center">
        <div class="text-[15px] font-extrabold text-[#1A1008]" style="font-family: 'Baloo 2', cursive">
          {{ monthLabel }}
        </div>
        <div class="text-[10px] text-[#7A6E5F] font-semibold">toque para ver outro mês</div>
      </div>
      <button
        type="button"
        class="w-8 h-8 rounded-full border border-[#E5D9C3] bg-[#F5EDD8] flex items-center justify-center text-[#1A1008] cursor-pointer text-base"
        @click="nextMonth"
      >
        ›
      </button>
    </div>

    <main class="flex-1 overflow-y-auto p-4">
      <!-- Saldo geral do mês -->
      <div
        class="rounded-[20px] p-5 mb-3.5 relative overflow-hidden"
        style="background: linear-gradient(135deg, #E8500A 0%, #C03A00 100%); box-shadow: 0 8px 24px rgba(232,80,10,0.35)"
      >
        <span class="absolute text-[80px] -top-2 -right-2 opacity-[0.12]">🌵</span>
        <div class="text-[10px] text-white/60 uppercase tracking-widest font-bold mb-1">
          Resumo · {{ monthLabel }}
        </div>
        <div class="text-white text-[34px] font-extrabold leading-tight tracking-tight" style="font-family: 'Baloo 2', cursive">
          <span class="text-[15px] font-medium opacity-70">R$</span> 2.850<span class="text-[15px] font-medium opacity-70">,00</span>
        </div>
        <div class="inline-flex items-center gap-1.5 rounded-full py-1 px-2.5 mt-2 text-[11px] font-bold text-white bg-white/15 backdrop-blur">
          💰 saldo restante no mês
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
            <div class="text-sm font-bold text-[#A8FFB3]" style="font-family: 'Baloo 2', cursive">63%</div>
          </div>
        </div>
      </div>

      <!-- Gasto por categoria -->
      <div class="rounded-2xl p-4 mb-3.5 border border-[#E5D9C3] bg-white">
        <div class="text-[13px] font-bold text-[#1A1008] mb-3.5" style="font-family: 'Baloo 2', cursive">
          Gasto por categoria
        </div>
        <div v-for="cat in categorySpending" :key="cat.name" class="mb-3 last:mb-0">
          <div class="flex justify-between items-center mb-1">
            <div class="flex items-center gap-1.5">
              <span class="text-sm">{{ cat.icon }}</span>
              <span class="text-xs font-bold text-[#1A1008]" style="font-family: 'Baloo 2', cursive">{{ cat.name }}</span>
            </div>
            <span
              class="text-xs font-bold"
              style="font-family: 'Baloo 2', cursive"
              :class="cat.isWarning ? 'text-[#C0252A]' : (cat.pct >= 35 ? 'text-[#9A7000]' : 'text-[#1E8C45]')"
            >
              {{ cat.spent }}
            </span>
          </div>
          <div class="h-2 rounded-full overflow-hidden bg-[#E5D9C3]">
            <div class="h-full rounded-full transition-all" :style="{ width: cat.pct + '%', background: cat.barColor }" />
          </div>
          <div class="text-[10px] text-[#7A6E5F] font-semibold mt-0.5">
            {{ cat.spent }} de {{ cat.budget }} · {{ cat.pct }}% usado {{ cat.isWarning ? '⚠️' : '' }}
          </div>
        </div>
      </div>

      <!-- Lançamentos -->
      <div class="text-[13px] font-bold text-[#7A6E5F] uppercase tracking-wider mb-2.5" style="font-family: 'Baloo 2', cursive">
        Lançamentos · {{ monthLabel }}
      </div>
      <div class="flex flex-col gap-2">
        <template v-for="group in entriesByDay" :key="group.day">
          <div class="text-[10px] font-bold text-[#7A6E5F] uppercase tracking-wider py-0.5 pt-2 first:pt-0">
            {{ group.day }}
          </div>
          <div
            v-for="(item, j) in group.items"
            :key="`${group.day}-${j}`"
            class="rounded-[13px] p-3 border border-[#E5D9C3] bg-white flex items-center justify-between"
          >
            <div class="flex items-center gap-2.5">
              <div
                class="w-[34px] h-[34px] rounded-[10px] flex items-center justify-center text-[15px] shrink-0"
                :style="{ background: item.iconBg }"
              >
                {{ item.icon }}
              </div>
              <div>
                <div class="text-[13px] font-bold text-[#1A1008]" style="font-family: 'Baloo 2', cursive">{{ item.title }}</div>
                <div class="text-[10px] text-[#7A6E5F] font-semibold">{{ item.category }}</div>
              </div>
            </div>
            <div class="text-sm font-extrabold text-[#C0252A]" style="font-family: 'Baloo 2', cursive">{{ item.value }}</div>
          </div>
        </template>
      </div>
    </main>

    <BottomNav />
  </div>
</template>
