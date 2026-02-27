<script setup lang="ts">
import BottomNav from '@/components/BottomNav.vue'
import { useTransactionsManagement } from '@/composables/useTransactionsManagement'
import { formatBRL, categoryPercentage, barColor, balanceColor, categorySpent } from '@/utils/categoryHelpers'

const {
  isLoading,
  monthLabel,
  prevMonth,
  nextMonth,
  entriesByDay,
  categoryMap,
  formOpen,
  editingId,
  formDescription,
  formAmount,
  formCategoryId,
  formError,
  categories,
  openCreate,
  openEdit,
  closeForm,
  saveTransaction,
  confirmDelete,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  maxAmountForCategory,
  sanitizeAmountInput,
} = useTransactionsManagement()
</script>

<template>
  <div class="h-full min-h-0 flex flex-col bg-[#F5EDD8]">
    <header
      class="flex items-center justify-between px-4 py-3 shrink-0 border-b-2 border-[#E5D9C3] bg-white"
    >
      <span class="text-xl font-extrabold text-[#1A1008]" style="font-family: 'Baloo 2', cursive">
        📋 Lançamentos
      </span>
      <button
        type="button"
        class="py-2 px-4 rounded-xl text-sm font-bold text-white border-0 cursor-pointer"
        style="font-family: 'Baloo 2', cursive; background: linear-gradient(135deg, #E8500A, #F5C518)"
        @click="openCreate"
      >
        + Novo
      </button>
    </header>

    <!-- Seletor de mês -->
    <div
      class="flex items-center justify-between py-2.5 px-4 border-b border-[#E5D9C3] bg-white shrink-0"
    >
      <button
        type="button"
        class="w-8 h-8 rounded-full border border-[#E5D9C3] bg-[#F5EDD8] flex items-center justify-center text-[#1A1008] cursor-pointer text-base"
        @click="prevMonth"
      >
        ‹
      </button>
      <div class="text-[15px] font-extrabold text-[#1A1008]" style="font-family: 'Baloo 2', cursive">
        {{ monthLabel }}
      </div>
      <button
        type="button"
        class="w-8 h-8 rounded-full border border-[#E5D9C3] bg-[#F5EDD8] flex items-center justify-center text-[#1A1008] cursor-pointer text-base"
        @click="nextMonth"
      >
        ›
      </button>
    </div>

    <main class="flex-1 min-h-0 overflow-y-auto p-4">
      <!-- Gasto por categoria (igual ao Resumo) -->
      <div
        v-if="categories?.length"
        class="rounded-2xl border border-[#E5D9C3] bg-white p-4 mb-4"
      >
        <div
          class="text-[13px] font-bold text-[#1A1008] mb-3.5"
          style="font-family: 'Baloo 2', cursive"
        >
          Gasto por categoria
        </div>
        <div v-for="cat in categories" :key="cat.id" class="mb-3 last:mb-0">
          <div class="flex justify-between items-center mb-1">
            <div class="flex items-center gap-1.5">
              <span class="text-sm">{{ cat.icon ?? '📦' }}</span>
              <span
                class="text-xs font-bold text-[#1A1008]"
                style="font-family: 'Baloo 2', cursive"
              >
                {{ cat.name }}
              </span>
            </div>
            <span
              class="text-xs font-bold shrink-0"
              style="font-family: 'Baloo 2', cursive"
              :class="balanceColor(categoryPercentage(cat))"
            >
              R$ {{ formatBRL(categorySpent(cat)) }}
            </span>
          </div>
          <div class="h-2 rounded-full overflow-hidden bg-[#E5D9C3]">
            <div
              class="h-full rounded-full transition-all"
              :style="{
                width: categoryPercentage(cat) + '%',
                background: barColor(categoryPercentage(cat)),
              }"
            />
          </div>
          <div class="text-[10px] text-[#7A6E5F] font-semibold mt-0.5">
            R$ {{ formatBRL(categorySpent(cat)) }} de R$
            {{ formatBRL(parseFloat(cat.initial_amount)) }} · {{ categoryPercentage(cat) }}% usado
            <span v-if="categoryPercentage(cat) >= 90">⚠️</span>
          </div>
        </div>
      </div>

      <div v-if="isLoading" class="flex flex-col gap-2">
        <div
          v-for="i in 5"
          :key="i"
          class="rounded-[13px] p-3 border border-[#E5D9C3] bg-white h-14 animate-pulse"
        />
      </div>

      <div
        v-else-if="!entriesByDay.length"
        class="rounded-2xl p-5 border border-[#E5D9C3] bg-white text-center"
      >
        <p class="text-sm text-[#7A6E5F]">Nenhum lançamento em {{ monthLabel }}.</p>
        <button
          type="button"
          class="mt-3 py-2 px-4 rounded-xl text-sm font-bold text-[#E8500A] border border-[#E8500A] bg-transparent cursor-pointer"
          style="font-family: 'Baloo 2', cursive"
          @click="openCreate"
        >
          + Novo lançamento
        </button>
      </div>

      <div v-else class="flex flex-col gap-2">
        <template v-for="group in entriesByDay" :key="group.day">
          <div
            class="text-[10px] font-bold text-[#7A6E5F] uppercase tracking-wider py-0.5 pt-2 first:pt-0"
          >
            {{ group.day }}
          </div>
          <div
            v-for="transaction in group.items"
            :key="transaction.id"
            class="rounded-[13px] p-3 border border-[#E5D9C3] bg-white flex items-center justify-between gap-2"
          >
            <div class="flex items-center gap-2.5 min-w-0">
              <div
                class="w-8.5 h-8.5 rounded-[10px] flex items-center justify-center text-[15px] shrink-0 bg-[#FEF0E8]"
              >
                {{ transaction.category_id ? (categoryMap[transaction.category_id]?.icon ?? '📦') : '💸' }}
              </div>
              <div class="min-w-0">
                <div
                  class="text-[13px] font-bold text-[#1A1008] truncate"
                  style="font-family: 'Baloo 2', cursive"
                >
                  {{ transaction.description }}
                </div>
                <div class="text-[10px] text-[#7A6E5F] font-semibold">
                  {{ transaction.category_id ? (categoryMap[transaction.category_id]?.name ?? 'Sem categoria') : 'Sem categoria' }}
                </div>
              </div>
            </div>
            <div class="flex items-center gap-2 shrink-0">
              <span
                class="text-sm font-extrabold text-[#C0252A]"
                style="font-family: 'Baloo 2', cursive"
              >
                − R$ {{ formatBRL(parseFloat(transaction.amount)) }}
              </span>
              <button
                type="button"
                class="p-1.5 rounded-lg text-[#7A6E5F] hover:bg-[#E5D9C3] cursor-pointer"
                title="Editar"
                @click="openEdit(transaction)"
              >
                ✏️
              </button>
              <button
                type="button"
                class="p-1.5 rounded-lg text-[#C0252A] hover:bg-[#FAEAEA] cursor-pointer"
                title="Excluir"
                :disabled="deleteTransaction.isPending.value"
                @click="confirmDelete(transaction)"
              >
                🗑️
              </button>
            </div>
          </div>
        </template>
      </div>
    </main>

    <!-- Modal: criar/editar lançamento -->
    <Teleport to="body">
      <div
        v-if="formOpen"
        class="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50"
        @click.self="closeForm"
      >
        <div
          class="w-full max-w-md rounded-2xl bg-white border border-[#E5D9C3] shadow-xl overflow-hidden"
          role="dialog"
          aria-modal="true"
          aria-labelledby="form-title"
        >
          <div class="p-4 border-b border-[#E5D9C3]">
            <h2 id="form-title" class="text-lg font-extrabold text-[#1A1008]" style="font-family: 'Baloo 2', cursive">
              {{ editingId ? 'Editar lançamento' : 'Novo lançamento' }}
            </h2>
          </div>
          <form class="p-4 space-y-3" @submit.prevent="saveTransaction">
            <div v-if="formError" class="p-2 rounded-lg bg-[#FAEAEA] text-sm text-[#C0252A]">
              {{ formError }}
            </div>
            <div>
              <label class="block text-[10px] font-bold text-[#7A6E5F] uppercase tracking-wider mb-1">
                Descrição
              </label>
              <input
                v-model="formDescription"
                type="text"
                placeholder="Ex: Mercado, Uber..."
                class="w-full rounded-xl px-3 py-2.5 text-sm text-[#1A1008] bg-[#F5EDD8] border border-[#E5D9C3] outline-none focus:border-[#E8500A]"
              />
            </div>
            <div>
              <label class="block text-[10px] font-bold text-[#7A6E5F] uppercase tracking-wider mb-1">
                Valor (R$)
              </label>
              <input
                :value="formAmount"
                type="text"
                inputmode="decimal"
                placeholder="0,00"
                class="w-full rounded-xl px-3 py-2.5 text-sm text-[#1A1008] bg-[#F5EDD8] border border-[#E5D9C3] outline-none focus:border-[#E8500A]"
                @input="(e) => (formAmount = sanitizeAmountInput((e.target as HTMLInputElement).value))"
              />
              <p
                v-if="maxAmountForCategory != null"
                class="text-[10px] text-[#7A6E5F] font-semibold mt-1"
              >
                Saldo disponível na categoria: R$ {{ formatBRL(maxAmountForCategory) }}
              </p>
            </div>
            <div>
              <label class="block text-[10px] font-bold text-[#7A6E5F] uppercase tracking-wider mb-1">
                Categoria
              </label>
              <select
                v-model="formCategoryId"
                class="w-full rounded-xl px-3 py-2.5 text-sm text-[#1A1008] bg-[#F5EDD8] border border-[#E5D9C3] outline-none focus:border-[#E8500A]"
              >
                <option value="">Sem categoria</option>
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                  {{ cat.icon }} {{ cat.name }}
                </option>
              </select>
            </div>
            <div class="flex gap-2 pt-2">
              <button
                type="button"
                class="flex-1 py-2.5 rounded-xl text-sm font-bold text-[#7A6E5F] border border-[#E5D9C3] bg-white cursor-pointer"
                style="font-family: 'Baloo 2', cursive"
                @click="closeForm"
              >
                Cancelar
              </button>
              <button
                type="submit"
                class="flex-1 py-2.5 rounded-xl text-sm font-bold text-white border-0 cursor-pointer disabled:opacity-60"
                style="font-family: 'Baloo 2', cursive; background: linear-gradient(135deg, #E8500A, #F5C518)"
                :disabled="createTransaction.isPending.value || updateTransaction.isPending.value"
              >
                {{ editingId ? 'Salvar' : 'Criar' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <BottomNav />
  </div>
</template>
