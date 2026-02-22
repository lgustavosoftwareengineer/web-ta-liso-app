<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router'

const route = useRoute()

function isActive(name: string) {
  return route.name === name
}
</script>

<template>
  <aside
    class="w-[240px] shrink-0 flex flex-col h-full"
    style="background: #1A1008"
  >
    <div class="py-6 px-5 border-b border-white/10">
      <div
        class="text-[22px] font-extrabold text-white leading-none"
        style="font-family: 'Baloo 2', cursive"
      >
        Tá <span class="text-[#F5C518]">Liso</span> 💸
      </div>
      <span class="text-[10px] text-white/30 block mt-0.5 font-medium">controle financeiro</span>
    </div>
    <nav class="flex-1 py-3 overflow-y-auto">
      <RouterLink
        to="/"
        class="flex items-center gap-2.5 py-2.5 px-5 text-[13px] font-semibold transition-all border-r-[3px] border-transparent no-underline"
        :class="isActive('home') ? 'text-[#F5C518] bg-[#F5C518]/10 border-[#F5C518]' : 'text-white/45 hover:text-white/80 hover:bg-white/5'"
      >
        <span class="text-[17px]">🏠</span> Início
      </RouterLink>
      <RouterLink
        to="/chat"
        class="flex items-center gap-2.5 py-2.5 px-5 text-[13px] font-semibold transition-all border-r-[3px] border-transparent no-underline"
        :class="isActive('chat') ? 'text-[#F5C518] bg-[#F5C518]/10 border-[#F5C518]' : 'text-white/45 hover:text-white/80 hover:bg-white/5'"
      >
        <span class="text-[17px]">💬</span> Chat
      </RouterLink>
      <RouterLink
        to="/categorias"
        class="flex items-center gap-2.5 py-2.5 px-5 text-[13px] font-semibold transition-all border-r-[3px] border-transparent no-underline"
        :class="isActive('categorias') ? 'text-[#F5C518] bg-[#F5C518]/10 border-[#F5C518]' : 'text-white/45 hover:text-white/80 hover:bg-white/5'"
      >
        <span class="text-[17px]">📂</span> Categorias
      </RouterLink>
      <RouterLink
        to="/resumo"
        class="flex items-center gap-2.5 py-2.5 px-5 text-[13px] font-semibold transition-all border-r-[3px] border-transparent no-underline"
        :class="isActive('resumo') ? 'text-[#F5C518] bg-[#F5C518]/10 border-[#F5C518]' : 'text-white/45 hover:text-white/80 hover:bg-white/5'"
      >
        <span class="text-[17px]">📊</span> Resumo
      </RouterLink>
      <div class="h-px bg-white/10 my-2 mx-5" />
      <RouterLink
        to="/configuracoes"
        class="flex items-center gap-2.5 py-2.5 px-5 text-[13px] font-semibold transition-all border-r-[3px] border-transparent no-underline"
        :class="isActive('configuracoes') ? 'text-[#F5C518] bg-[#F5C518]/10 border-[#F5C518]' : 'text-white/45 hover:text-white/80 hover:bg-white/5'"
      >
        <span class="text-[17px]">⚙️</span> Configurações
      </RouterLink>
    </nav>
    <div class="pt-4 pb-4 px-5 border-t border-white/10 flex items-center gap-2.5">
      <RouterLink
        to="/configuracoes"
        class="w-[34px] h-[34px] rounded-full flex items-center justify-center text-white text-[13px] font-extrabold shrink-0 no-underline"
        style="font-family: 'Baloo 2', cursive; background: linear-gradient(135deg, #E8500A 0%, #F5C518 100%)"
      >
        JA
      </RouterLink>
      <div>
        <div class="text-[12px] font-bold text-white/75">João Alves</div>
        <div class="text-[10px] text-white/35">joao@email.com</div>
      </div>
    </div>
  </aside>
</template>
