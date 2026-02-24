<script setup lang="ts">
import { ref } from 'vue'
import { useQueryClient } from '@tanstack/vue-query'
import BottomNav from '@/components/BottomNav.vue'
import {
  useListCategoriesApiCategoriesGet,
  useCreateCategoryApiCategoriesPost,
  useDeleteCategoryApiCategoriesCategoryIdDelete,
  getListCategoriesApiCategoriesGetQueryKey,
} from '@/api/generated/categories/categories'
import { useApiError } from '@/composables/useApiError'
import { categoryPercentage, barColor, formatBRL } from '@/utils/categoryHelpers'
import AppSpinner from '@/components/AppSpinner.vue'

const queryClient = useQueryClient()
const { getErrorMessage } = useApiError()

const categoryName = ref('')
const categoryBudget = ref('')
const selectedIcon = ref('🛒')
const createError = ref('')

const iconOptions = ['🛒', '🚌', '🏥', '🎉', '📚', '✈️', '🏠', '🌵']

const { data: categories, isLoading } = useListCategoriesApiCategoriesGet()

const createCategory = useCreateCategoryApiCategoriesPost({
  mutation: {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getListCategoriesApiCategoriesGetQueryKey() })
      categoryName.value = ''
      categoryBudget.value = ''
      selectedIcon.value = '🛒'
      createError.value = ''
    },
    onError: (e) => {
      createError.value = getErrorMessage(e)
    },
  },
})

const deleteCategory = useDeleteCategoryApiCategoriesCategoryIdDelete({
  mutation: {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getListCategoriesApiCategoriesGetQueryKey() })
    },
  },
})

function saveCategory() {
  if (!categoryName.value.trim() || !categoryBudget.value) return
  createCategory.mutate({
    data: {
      name: categoryName.value.trim(),
      icon: selectedIcon.value,
      initial_amount: parseFloat(categoryBudget.value),
    },
  })
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-[#F5EDD8]">
    <header
      class="flex items-center justify-between px-4 py-3 shrink-0 border-b-2 border-[#E5D9C3] bg-white"
    >
      <span class="text-xl font-extrabold text-[#1A1008]" style="font-family: 'Baloo 2', cursive"
        >Categorias</span
      >
    </header>

    <main class="flex-1 overflow-y-auto p-4">
      <!-- Nova Categoria -->
      <div class="rounded-[18px] p-4 mb-4 border border-[#E5D9C3] bg-white">
        <div
          class="text-base font-bold text-[#1A1008] mb-3"
          style="font-family: 'Baloo 2', cursive"
        >
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
              class="w-[38px] h-[38px] rounded-[10px] flex items-center justify-center text-[17px] border-2 transition-all hover:cursor-pointer"
              :class="
                selectedIcon === icon
                  ? 'border-[#E8500A] bg-[#FEF0E8]'
                  : 'border-[#E5D9C3] bg-[#F5EDD8]'
              "
              @click="selectedIcon = icon"
            >
              {{ icon }}
            </button>
          </div>
        </div>
        <p v-if="createError" class="text-xs text-[#C0252A] font-semibold mb-2">
          {{ createError }}
        </p>
        <button
          type="button"
          class="w-full py-3 rounded-[10px] text-white text-sm font-bold border-0 cursor-pointer mt-1 disabled:opacity-50"
          style="
            font-family: 'Baloo 2', cursive;
            background: linear-gradient(135deg, #e8500a 0%, #f5c518 100%);
            box-shadow: 0 4px 14px rgba(232, 80, 10, 0.3);
          "
          :disabled="createCategory.isPending.value"
          @click="saveCategory"
        >
          <span class="flex items-center justify-center gap-2">
            <AppSpinner v-if="createCategory.isPending.value" size="sm" />
            {{ createCategory.isPending.value ? 'Salvando...' : 'Salvar Categoria 💾' }}
          </span>
        </button>
      </div>

      <!-- Suas Categorias -->
      <div
        class="text-[13px] font-bold text-[#7A6E5F] uppercase tracking-wider mb-2.5"
        style="font-family: 'Baloo 2', cursive"
      >
        Suas Categorias
      </div>

      <div v-if="isLoading" class="flex flex-col gap-2.5">
        <div
          v-for="i in 3"
          :key="i"
          class="rounded-2xl p-3.5 border border-[#E5D9C3] bg-white h-[80px] animate-pulse"
        />
      </div>

      <div
        v-else-if="!categories?.length"
        class="rounded-2xl p-5 border border-[#E5D9C3] bg-white text-center"
      >
        <p class="text-sm text-[#7A6E5F]">Nenhuma categoria criada ainda.</p>
      </div>

      <div v-else class="flex flex-col gap-2.5">
        <div
          v-for="cat in categories"
          :key="cat.id"
          class="rounded-2xl p-3.5 border border-[#E5D9C3] bg-white cursor-pointer transition-all hover:-translate-y-px hover:shadow-md"
        >
          <div class="flex justify-between items-center mb-2.5">
            <div class="flex items-center gap-2.5">
              <div
                class="w-[38px] h-[38px] rounded-[11px] flex items-center justify-center text-lg shrink-0 bg-[#FEF0E8]"
              >
                {{ cat.icon ?? '📦' }}
              </div>
              <div>
                <div
                  class="text-sm font-bold text-[#1A1008]"
                  style="font-family: 'Baloo 2', cursive"
                >
                  {{ cat.name }}
                </div>
                <div class="text-[11px] text-[#7A6E5F] mt-0.5">
                  Orçamento: R$ {{ formatBRL(cat.initial_amount) }}
                </div>
              </div>
            </div>
            <div class="flex gap-2 items-center">
              <button
                type="button"
                class="text-[17px] text-[#C0252A] cursor-pointer disabled:opacity-40"
                :disabled="deleteCategory.isPending.value"
                @click="deleteCategory.mutate({ categoryId: cat.id })"
              >
                🗑️
              </button>
            </div>
          </div>
          <div class="h-1.5 rounded-full overflow-hidden bg-[#E5D9C3]">
            <div
              class="h-full rounded-full transition-all"
              :style="{ width: categoryPercentage(cat) + '%', background: barColor(categoryPercentage(cat)) }"
            />
          </div>
          <div class="text-[10px] text-[#7A6E5F] font-semibold mt-1">
            R$
            {{ formatBRL(parseFloat(cat.initial_amount) - parseFloat(cat.current_balance)) }} gasto
            · {{ categoryPercentage(cat) }}% usado
          </div>
        </div>
      </div>
    </main>

    <BottomNav />
  </div>
</template>
