<script setup lang="ts">
import { RouterLink } from 'vue-router'
import BottomNav from '@/components/BottomNav.vue'
import HomeBalanceCard from '@/components/HomeBalanceCard.vue'
import HomeAlertCard from '@/components/HomeAlertCard.vue'
import HomeCategoryCard from '@/components/HomeCategoryCard.vue'
import { useUser } from '@/composables/useUser'
import { useHome } from '@/composables/useHome'

const { initials } = useUser()
const {
  categories,
  isLoading,
  totalBudget,
  totalSpent,
  totalRemaining,
  categoriesAlerts,
  monthLabel,
} = useHome()
</script>

<template>
  <div class="h-full min-h-0 flex flex-col bg-[#F5EDD8]">
    <!-- App header -->
    <header
      class="flex items-center justify-between px-4 py-3 shrink-0 border-b-2 border-[#E5D9C3]"
      style="background: #fff"
    >
      <div
        class="font-bold text-[#1A1008] text-xl leading-none"
        style="font-family: 'Baloo 2', cursive"
      >
        Tá <span style="color: #e8500a">Liso</span> 💸
      </div>
      <RouterLink
        to="/configuracoes"
        class="w-8.5 h-8.5 rounded-full flex items-center justify-center text-white text-[13px] font-bold shrink-0 cursor-pointer no-underline"
        style="
          font-family: 'Baloo 2', cursive;
          background: linear-gradient(135deg, #e8500a 0%, #f5c518 100%);
        "
      >
        {{ initials }}
      </RouterLink>
    </header>

    <!-- Scrollable content -->
    <main class="flex-1 min-h-0 overflow-y-auto px-4 py-4">
      <HomeBalanceCard
        :total-budget="totalBudget"
        :total-spent="totalSpent"
        :total-remaining="totalRemaining"
        :month-label="monthLabel"
        :is-loading="isLoading"
      />

      <!-- Alerts: categorias ≥ 90% -->
      <HomeAlertCard
        v-for="categoryAlert in categoriesAlerts"
        :key="categoryAlert.id"
        :category="categoryAlert"
      />

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

      <!-- Loading state -->
      <div v-if="isLoading" class="flex flex-col gap-2.5 mb-5">
        <div
          v-for="i in 3"
          :key="i"
          class="rounded-2xl p-3.5 border border-[#E5D9C3] bg-white h-20 animate-pulse"
        />
      </div>

      <!-- Empty state -->
      <div
        v-else-if="!categories?.length"
        class="rounded-2xl p-5 border border-[#E5D9C3] bg-white text-center mb-5"
      >
        <p class="text-sm text-[#7A6E5F]">Nenhuma categoria ainda.</p>
        <RouterLink to="/categorias" class="text-sm font-bold text-[#E8500A] mt-1 block">
          Criar primeira categoria →
        </RouterLink>
      </div>

      <div v-else class="flex flex-col gap-2.5 mb-5">
        <HomeCategoryCard
          v-for="category in categories"
          :key="category.id"
          :category="category"
        />
      </div>
    </main>

    <BottomNav />
  </div>
</template>
