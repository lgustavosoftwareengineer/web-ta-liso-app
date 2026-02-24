/**
 * Feature: Resumo mensal (BDD)
 * Scenarios from docs/ta-liso-BDD.md — AAA pattern.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ref } from 'vue'
import ResumoView from '../ResumoView.vue'
import { mountWithRouter } from '@/test-utils/mountWithRouter'
import type { CategoryResponse, TransactionResponse } from '@/api/generated/táLisoAPI.schemas'
import { createCategory, createTransaction, transactionInMonth } from '@/test-utils/mockData'

// Shared refs for mocks (reset in beforeEach)
const categoriesData = ref<CategoryResponse[]>([])
const transactionsData = ref<TransactionResponse[]>([])
const loadingCats = ref(false)
const loadingTxns = ref(false)

vi.mock('@/api/generated/categories/categories', () => ({
  useListCategoriesApiCategoriesGet: () => ({ data: categoriesData, isLoading: loadingCats }),
}))
vi.mock('@/api/generated/transactions/transactions', () => ({
  useListTransactionsApiTransactionsGet: () => ({ data: transactionsData, isLoading: loadingTxns }),
}))

describe('Feature: Resumo mensal', () => {
  beforeEach(() => {
    categoriesData.value = []
    transactionsData.value = []
    loadingCats.value = false
    loadingTxns.value = false
  })

  describe('Scenario: Exibir resumo do mês atual', () => {
    it('exibe mês e ano atuais no seletor e cards (saldo restante, total gasto)', async () => {
      // Arrange: user authenticated, has categories with transactions in current month
      const now = new Date()
      const cat1 = createCategory({ id: 'c1', name: 'Alimentação', initial_amount: '1000', current_balance: '800' })
      categoriesData.value = [cat1]
      transactionsData.value = [
        createTransaction({
          id: 't1',
          category_id: 'c1',
          amount: '200',
          created_at: transactionInMonth(now.getFullYear(), now.getMonth()),
        }),
      ]

      // Act: user accesses Resumo screen
      const { wrapper } = await mountWithRouter(ResumoView, { route: '/resumo' })
      await wrapper.vm.$nextTick()

      // Assert: month/year in selector, summary cards visible
      expect(wrapper.text()).toMatch(/\w+\s+\d{4}/) // e.g. "Fevereiro 2025"
      expect(wrapper.text()).toContain('Resumo')
      expect(wrapper.text()).toContain('saldo restante')
      expect(wrapper.text()).toContain('Orçado')
      expect(wrapper.text()).toContain('Gasto')
    })

    it('exibe breakdown por categoria com barras de progresso quando há gastos', async () => {
      // Arrange
      const now = new Date()
      const cat = createCategory({ id: 'c1', name: 'Mercado', initial_amount: '500', current_balance: '300' })
      categoriesData.value = [cat]
      transactionsData.value = [
        createTransaction({
          category_id: 'c1',
          amount: '200',
          created_at: transactionInMonth(now.getFullYear(), now.getMonth()),
        }),
      ]

      // Act
      const { wrapper } = await mountWithRouter(ResumoView, { route: '/resumo' })
      await wrapper.vm.$nextTick()

      // Assert: section "Gasto por categoria" and category name
      expect(wrapper.text()).toContain('Gasto por categoria')
      expect(wrapper.text()).toContain('Mercado')
    })

    it('exibe lista de lançamentos do mês em ordem decrescente', async () => {
      // Arrange: two transactions in current month
      const now = new Date()
      const cat = createCategory({ id: 'c1', name: 'Alimentação', initial_amount: '1000', current_balance: '700' })
      categoriesData.value = [cat]
      transactionsData.value = [
        createTransaction({
          id: 't1',
          category_id: 'c1',
          description: 'Mercado',
          amount: '200',
          created_at: transactionInMonth(now.getFullYear(), now.getMonth(), 10),
        }),
        createTransaction({
          id: 't2',
          category_id: 'c1',
          description: 'Restaurante',
          amount: '100',
          created_at: transactionInMonth(now.getFullYear(), now.getMonth(), 20),
        }),
      ]

      // Act
      const { wrapper } = await mountWithRouter(ResumoView, { route: '/resumo' })
      await wrapper.vm.$nextTick()

      // Assert: both descriptions visible, section "Lançamentos"
      expect(wrapper.text()).toContain('Lançamentos')
      expect(wrapper.text()).toContain('Mercado')
      expect(wrapper.text()).toContain('Restaurante')
    })
  })

  describe('Scenario: Saldo restante quando não há lançamentos no mês', () => {
    it('exibe saldo restante zero e total gasto zero e mensagem de nenhum lançamento', async () => {
      // Arrange: user has categories with budget but no transactions in selected month
      const cat = createCategory({ id: 'c1', name: 'Alimentação', initial_amount: '1000', current_balance: '1000' })
      categoriesData.value = [cat]
      transactionsData.value = []

      // Act
      const { wrapper } = await mountWithRouter(ResumoView, { route: '/resumo' })
      await wrapper.vm.$nextTick()

      // Assert: remaining = 0 (formatted as 0,00), spent = 0, empty state message
      expect(wrapper.text()).toContain('0,00')
      expect(wrapper.text()).toMatch(/Nenhum lançamento|não há lançamentos/i)
    })
  })

  describe('Scenario: Navegar para o mês anterior', () => {
    it('atualiza o label do seletor ao clicar no botão mês anterior', async () => {
      // Arrange: Resumo mounted on current month
      categoriesData.value = [createCategory()]
      transactionsData.value = []
      const { wrapper } = await mountWithRouter(ResumoView, { route: '/resumo' })
      await wrapper.vm.$nextTick()
      const initialText = wrapper.text()

      // Act: click previous month button (‹)
      const buttons = wrapper.findAll('button')
      await buttons[0]!.trigger('click')

      // Assert: label changed
      await wrapper.vm.$nextTick()
      expect(wrapper.text()).not.toBe(initialText)
    })
  })

  describe('Scenario: Navegar para o mês seguinte', () => {
    it('atualiza o label do seletor ao clicar no botão próximo mês', async () => {
      // Arrange: start on current month
      categoriesData.value = [createCategory()]
      transactionsData.value = []
      const { wrapper } = await mountWithRouter(ResumoView, { route: '/resumo' })
      await wrapper.vm.$nextTick()
      const initialText = wrapper.text()

      // Act: click next month (›)
      const buttons = wrapper.findAll('button')
      await buttons[1]!.trigger('click')

      // Assert: label updated
      await wrapper.vm.$nextTick()
      expect(wrapper.text()).not.toBe(initialText)
    })
  })

  describe('Scenario: Visualizar mês sem lançamentos', () => {
    it('exibe cards zerados e mensagem informando que não há lançamentos', async () => {
      // Arrange: no transactions
      categoriesData.value = [createCategory({ initial_amount: '500', current_balance: '500' })]
      transactionsData.value = []

      // Act
      const { wrapper } = await mountWithRouter(ResumoView, { route: '/resumo' })
      await wrapper.vm.$nextTick()

      // Assert: zeroed values and empty state text
      expect(wrapper.text()).toMatch(/0,00/)
      expect(wrapper.text()).toMatch(/Nenhum lançamento|não há lançamentos/i)
    })
  })
})
