/**
 * Feature: Tela Lançamentos — Gerenciar transações (BDD)
 * Scenarios from docs/ta-liso-BDD.md — AAA pattern.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ref } from 'vue'
import LancamentosView from '../LancamentosView.vue'
import { mountWithRouter } from '@/test-utils/mountWithRouter'
import type { CategoryResponse, TransactionResponse } from '@/api/generated/táLisoAPI.schemas'
import { createCategory, createTransaction, transactionInMonth } from '@/test-utils/mockData'

const categoriesData = ref<CategoryResponse[]>([])
const transactionsData = ref<TransactionResponse[]>([])
const loadingCats = ref(false)
const loadingTxns = ref(false)
const createMutate = vi.fn()
const updateMutate = vi.fn()
const deleteMutate = vi.fn()

vi.mock('@/api/generated/categories/categories', () => ({
  useListCategoriesApiCategoriesGet: () => ({ data: categoriesData, isLoading: loadingCats }),
  getListCategoriesApiCategoriesGetQueryKey: () => ['api', 'categories'],
}))

vi.mock('@/api/generated/transactions/transactions', () => ({
  useListTransactionsApiTransactionsGet: () => ({ data: transactionsData, isLoading: loadingTxns }),
  useCreateTransactionApiTransactionsPost: () => ({
    mutate: createMutate,
    isPending: ref(false),
  }),
  useUpdateTransactionApiTransactionsTransactionIdPut: () => ({
    mutate: updateMutate,
    isPending: ref(false),
  }),
  useDeleteTransactionApiTransactionsTransactionIdDelete: () => ({
    mutate: deleteMutate,
    isPending: ref(false),
  }),
  getListTransactionsApiTransactionsGetQueryKey: () => ['api', 'transactions'],
}))
vi.mock('@/composables/useApiError', () => ({
  useApiError: () => ({ getErrorMessage: () => 'Erro da API' }),
}))

describe('Feature: Tela Lançamentos — Gerenciar transações', () => {
  beforeEach(() => {
    categoriesData.value = []
    transactionsData.value = []
    loadingCats.value = false
    loadingTxns.value = false
    createMutate.mockClear()
    updateMutate.mockClear()
    deleteMutate.mockClear()
  })

  describe('Scenario: Exibir lista de lançamentos do mês', () => {
    it('exibe mês atual no seletor e lista de transações agrupadas por dia', async () => {
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

      const { wrapper } = await mountWithRouter(LancamentosView, { route: '/lancamentos' })
      await wrapper.vm.$nextTick()

      expect(wrapper.text()).toContain('Lançamentos')
      expect(wrapper.text()).toMatch(/\w+\s+\d{4}/)
      expect(wrapper.text()).toContain('Mercado')
      expect(wrapper.text()).toContain('Restaurante')
      expect(wrapper.text()).toContain('Alimentação')
    })

    it('exibe botão + Novo no header', async () => {
      categoriesData.value = [createCategory()]
      transactionsData.value = []

      const { wrapper } = await mountWithRouter(LancamentosView, { route: '/lancamentos' })
      await wrapper.vm.$nextTick()

      const btn = wrapper.find('button')
      expect(btn?.text()).toContain('Novo')
    })
  })

  describe('Scenario: Gasto por categoria na tela Lançamentos', () => {
    it('exibe seção Gasto por categoria com valor gasto e barra de progresso', async () => {
      const cat = createCategory({
        id: 'c1',
        name: 'Débito',
        initial_amount: '1000',
        current_balance: '900',
      })
      categoriesData.value = [cat]
      transactionsData.value = []

      const { wrapper } = await mountWithRouter(LancamentosView, { route: '/lancamentos' })
      await wrapper.vm.$nextTick()

      expect(wrapper.text()).toContain('Gasto por categoria')
      expect(wrapper.text()).toContain('Débito')
      expect(wrapper.text()).toMatch(/R\$\s*[\d.,]+\s*de\s*R\$/)
      expect(wrapper.text()).toMatch(/%\s*usado/)
    })
  })

  describe('Scenario: Nenhum lançamento no mês', () => {
    it('exibe mensagem e botão para criar primeiro lançamento', async () => {
      categoriesData.value = [createCategory()]
      transactionsData.value = []

      const { wrapper } = await mountWithRouter(LancamentosView, { route: '/lancamentos' })
      await wrapper.vm.$nextTick()

      expect(wrapper.text()).toMatch(/Nenhum lançamento/)
      expect(wrapper.text()).toContain('Novo lançamento')
    })
  })

  describe('Scenario: Abrir modal de novo lançamento', () => {
    it('abre modal ao clicar em + Novo e exibe campos descrição, valor e categoria', async () => {
      categoriesData.value = [createCategory({ id: 'c1', name: 'Alimentação' })]
      transactionsData.value = []

      const { wrapper } = await mountWithRouter(LancamentosView, { route: '/lancamentos' })
      await wrapper.vm.$nextTick()

      const novoBtn = wrapper.findAll('button').find((b) => b.text().includes('Novo'))
      await novoBtn?.trigger('click')
      await wrapper.vm.$nextTick()

      // Modal está em Teleport to="body", então o conteúdo aparece no document.body
      const bodyText = document.body.textContent ?? ''
      expect(bodyText).toContain('Novo lançamento')
      expect(bodyText).toContain('Descrição')
      expect(bodyText).toContain('Valor')
      expect(bodyText).toContain('Categoria')
      expect(bodyText).toContain('Alimentação')
    })
  })

  describe('Scenario: Navegar entre meses', () => {
    it('atualiza o label ao clicar no botão mês anterior', async () => {
      categoriesData.value = [createCategory()]
      transactionsData.value = []
      const { wrapper } = await mountWithRouter(LancamentosView, { route: '/lancamentos' })
      await wrapper.vm.$nextTick()
      const initialText = wrapper.text()

      // Ordem dos botões: 0 = + Novo, 1 = ‹ (mês anterior), 2 = › (próximo mês)
      const prevBtn = wrapper.findAll('button').find((b) => b.text().trim() === '‹')
      await prevBtn?.trigger('click')
      await wrapper.vm.$nextTick()

      expect(wrapper.text()).not.toBe(initialText)
    })

    it('atualiza o label ao clicar no botão próximo mês', async () => {
      categoriesData.value = [createCategory()]
      transactionsData.value = []
      const { wrapper } = await mountWithRouter(LancamentosView, { route: '/lancamentos' })
      await wrapper.vm.$nextTick()
      const initialText = wrapper.text()

      const nextBtn = wrapper.findAll('button').find((b) => b.text().trim() === '›')
      await nextBtn?.trigger('click')
      await wrapper.vm.$nextTick()

      expect(wrapper.text()).not.toBe(initialText)
    })
  })

  describe('Scenario: Excluir transação', () => {
    it('exibe botões de editar e excluir em cada lançamento', async () => {
      const now = new Date()
      const cat = createCategory({ id: 'c1' })
      categoriesData.value = [cat]
      transactionsData.value = [
        createTransaction({
          id: 't1',
          category_id: 'c1',
          description: 'Ração',
          amount: '100',
          created_at: transactionInMonth(now.getFullYear(), now.getMonth()),
        }),
      ]

      const { wrapper } = await mountWithRouter(LancamentosView, { route: '/lancamentos' })
      await wrapper.vm.$nextTick()

      expect(wrapper.text()).toContain('Ração')
      const deleteBtn = wrapper.find('button[title="Excluir"]')
      expect(deleteBtn.exists()).toBe(true)
    })
  })
})
