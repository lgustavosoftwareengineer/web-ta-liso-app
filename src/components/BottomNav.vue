<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router'

const route = useRoute()

function isActive(name: string) {
  return route.name === name
}
</script>

<template>
  <nav
    class="flex items-end shrink-0 pt-2 pb-5 border-t-2 border-[#E5D9C3]"
    style="background: #fff"
  >
    <RouterLink
      to="/"
      class="flex-1 flex flex-col items-center gap-0.5 py-1.5 text-[9px] font-bold uppercase tracking-wide transition-colors"
      style="font-family: 'Baloo 2', cursive"
      :style="{ color: isActive('home') ? '#E8500A' : '#7A6E5F' }"
    >
      <span class="text-xl">🏠</span>
      Início
    </RouterLink>
    <RouterLink
      to="/categorias"
      class="flex-1 flex flex-col items-center gap-0.5 py-1.5 text-[9px] font-bold uppercase tracking-wide transition-colors hover:text-[#1A1008]"
      style="font-family: 'Baloo 2', cursive"
      :style="{ color: isActive('categorias') ? '#E8500A' : '#7A6E5F' }"
    >
      <span class="text-xl">📂</span>
      Categ.
    </RouterLink>
    <div class="flex-1 flex justify-center items-start">
      <RouterLink
        to="/chat"
        class="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl -mt-6 shadow-lg transition-transform hover:-translate-y-0.5"
        style="background: linear-gradient(135deg, #E8500A 0%, #F5C518 100%); box-shadow: 0 8px 20px rgba(232,80,10,0.45)"
      >
        💬
      </RouterLink>
    </div>
    <RouterLink
      to="/resumo"
      class="flex-1 flex flex-col items-center gap-0.5 py-1.5 text-[9px] font-bold uppercase tracking-wide transition-colors hover:text-[#1A1008]"
      style="font-family: 'Baloo 2', cursive"
      :style="{ color: isActive('resumo') ? '#E8500A' : '#7A6E5F' }"
    >
      <span class="text-xl">📊</span>
      Resumo
    </RouterLink>
    <RouterLink
      to="/configuracoes"
      class="flex-1 flex flex-col items-center gap-0.5 py-1.5 text-[9px] font-bold uppercase tracking-wide transition-colors hover:text-[#1A1008]"
      style="font-family: 'Baloo 2', cursive"
      :style="{ color: isActive('configuracoes') ? '#E8500A' : '#7A6E5F' }"
    >
      <span class="text-xl">⚙️</span>
      Config.
    </RouterLink>
  </nav>
</template>
