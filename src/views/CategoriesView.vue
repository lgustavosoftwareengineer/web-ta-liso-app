<script setup lang="ts">
import { ref } from 'vue'
import BottomNav from '@/components/BottomNav.vue'

const categoryName = ref('Feira e Mercado')
const categoryBudget = ref('1000')
const selectedIcon = ref('🛒')

const iconOptions = ['🛒', '🚌', '🏥', '🎉', '📚', '✈️', '🏠', '🌵']

const categories = [
  { name: 'Feira e Mercado', icon: '🛒', iconBg: '#FEF0E8', budget: 'R$ 1.000', pct: 20, barColor: '#1E8C45' },
  { name: 'Transporte', icon: '🚌', iconBg: '#FEFAE8', budget: 'R$ 1.000', pct: 35, barColor: '#F5C518' },
]
</script>

<template>
  <div class="min-h-screen flex flex-col bg-[#F5EDD8]">
    <header class="flex items-center justify-between px-4 py-3 shrink-0 border-b-2 border-[#E5D9C3] bg-white">
      <span class="text-xl font-extrabold text-[#1A1008]" style="font-family: 'Baloo 2', cursive">Categorias</span>
      <button
        type="button"
        class="text-2xl text-[#E8500A] leading-none cursor-pointer"
        aria-label="Nova categoria"
      >
        ＋
      </button>
    </header>

    <main class="flex-1 overflow-y-auto p-4">
      <!-- Nova Categoria -->
      <div class="rounded-[18px] p-4 mb-4 border border-[#E5D9C3] bg-white">
        <div class="text-base font-bold text-[#1A1008] mb-3" style="font-family: 'Baloo 2', cursive">
          ➕ Nova Categoria
        </div>
        <div class="mb-3">
          <label class="text-[10px] font-bold text-[#7A6E5F] uppercase tracking-wider block mb-1">
            Nome da categoria
          </label>
          <input
            v-model="categoryName"
            type="text"
            placeholder="Ex: Feira, Forró, Uber..."
            class="w-full border border-[#E5D9C3] rounded-[10px] py-2.5 px-3 text-[13px] text-[#1A1008] bg-[#F5EDD8] outline-none focus:border-[#E8500A]"
          />
        </div>
        <div class="mb-3">
          <label class="text-[10px] font-bold text-[#7A6E5F] uppercase tracking-wider block mb-1">
            Orçamento do mês (R$)
          </label>
          <input
            v-model="categoryBudget"
            type="number"
            placeholder="0,00"
            class="w-full border border-[#E5D9C3] rounded-[10px] py-2.5 px-3 text-[13px] text-[#1A1008] bg-[#F5EDD8] outline-none focus:border-[#E8500A]"
          />
        </div>
        <div class="mb-3">
          <label class="text-[10px] font-bold text-[#7A6E5F] uppercase tracking-wider block mb-1">
            Escolhe um ícone
          </label>
          <div class="flex gap-1.5 flex-wrap">
            <button
              v-for="icon in iconOptions"
              :key="icon"
              type="button"
              class="w-[38px] h-[38px] rounded-[10px] flex items-center justify-center text-[17px] border-2 transition-all"
              :class="selectedIcon === icon ? 'border-[#E8500A] bg-[#FEF0E8]' : 'border-[#E5D9C3] bg-[#F5EDD8]'"
              @click="selectedIcon = icon"
            >
              {{ icon }}
            </button>
          </div>
        </div>
        <button
          type="button"
          class="w-full py-3 rounded-[10px] text-white text-sm font-bold border-0 cursor-pointer mt-1"
          style="font-family: 'Baloo 2', cursive; background: linear-gradient(135deg, #E8500A 0%, #F5C518 100%); box-shadow: 0 4px 14px rgba(232,80,10,0.3)"
        >
          Salvar Categoria 💾
        </button>
      </div>

      <!-- Suas Categorias -->
      <div class="text-[13px] font-bold text-[#7A6E5F] uppercase tracking-wider mb-2.5" style="font-family: 'Baloo 2', cursive">
        Suas Categorias
      </div>
      <div class="flex flex-col gap-2.5">
        <div
          v-for="cat in categories"
          :key="cat.name"
          class="rounded-2xl p-3.5 border border-[#E5D9C3] bg-white cursor-pointer transition-all hover:-translate-y-px hover:shadow-md"
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
                <div class="text-[11px] text-[#7A6E5F] mt-0.5">Orçamento: {{ cat.budget }}</div>
              </div>
            </div>
            <div class="flex gap-2 items-center">
              <span class="text-[17px] text-[#7A6E5F] cursor-pointer">✏️</span>
              <span class="text-[17px] text-[#C0252A] cursor-pointer">🗑️</span>
            </div>
          </div>
          <div class="h-1.5 rounded-full overflow-hidden bg-[#E5D9C3]">
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
