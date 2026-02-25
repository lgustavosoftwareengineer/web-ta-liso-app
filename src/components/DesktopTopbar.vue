<script setup lang="ts">
import { formatCurrentDate } from '@/utils/dateHelpers'
import { getGreetingWithEmoji } from '@/composables/useGreeting'
import { useUser } from '@/composables/useUser'
import { computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'

const route = useRoute()

const { name } = useUser()

const title = computed(() => {
  const meta = route.meta?.topbar as { title?: string; subtitle?: string } | undefined
  if (meta?.title) return meta.title
  const names: Record<string, string> = {
    home: `E aí, ${name.value}! 👋`,
    categorias: 'Categorias',
    chat: 'Chat',
    resumo: 'Resumo',
    configuracoes: 'Configurações',
  }
  return names[route.name as string] ?? (route.name as string)
})

const subtitle = computed(() => {
  const meta = route.meta?.topbar as { title?: string; subtitle?: string } | undefined
  if (meta?.subtitle) return meta.subtitle

  const names: Record<string, string> = {
    home: `${getGreetingWithEmoji()} · ${formatCurrentDate()}`,
    categorias: 'Gerencie suas categorias e orçamentos',
    chat: 'Registre gastos por mensagem',
    resumo: 'Visão geral do mês',
    configuracoes: 'Perfil e preferências',
  }
  return names[route.name as string] ?? ''
})
</script>

<template>
  <header
    class="shrink-0 flex items-center justify-between py-4 px-7 border-b border-[#E5D9C3]"
    style="background: #fff"
  >
    <div>
      <h1
        class="text-[20px] font-extrabold text-[#1A1008] leading-none"
        style="font-family: 'Baloo 2', cursive"
      >
        {{ title }}
      </h1>
      <p v-if="subtitle" class="text-[12px] text-[#7A6E5F] font-semibold mt-0.5">
        {{ subtitle }}
      </p>
    </div>
    <div v-if="route.name === 'home'" class="flex gap-2.5 items-center">
      <RouterLink
        to="/categorias"
        class="py-2 px-4 rounded-[10px] text-[12px] font-bold border border-[#E5D9C3] bg-[#F5EDD8] text-[#1A1008] no-underline cursor-pointer transition-opacity hover:opacity-90"
        style="font-family: 'Baloo 2', cursive"
      >
        + Nova categoria
      </RouterLink>
      <RouterLink
        to="/chat"
        class="py-2 px-4 rounded-[10px] text-[12px] font-bold border-0 text-white cursor-pointer transition-opacity hover:opacity-90 no-underline"
        style="
          font-family: 'Baloo 2', cursive;
          background: linear-gradient(135deg, #e8500a, #f5c518);
          box-shadow: 0 4px 12px rgba(232, 80, 10, 0.3);
        "
      >
        💬 Registrar gasto
      </RouterLink>
    </div>
  </header>
</template>
