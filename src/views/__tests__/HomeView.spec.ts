/**
 * Feature: Tela Início — Visão geral do mês (BDD)
 * Scenario: Exibir resumo do mês atual ao entrar no app.
 * AAA pattern.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ref, computed } from 'vue'
import { createPinia, setActivePinia } from 'pinia'
import HomeView from '../HomeView.vue'
import { mountWithRouter } from '@/test-utils/mountWithRouter'
import type { CategoryResponse } from '@/api/generated/táLisoAPI.schemas'
import { createCategory } from '@/test-utils/mockData'

const categoriesRef = ref<CategoryResponse[]>([])
const loadingRef = ref(false)
const userInitials = ref('EU')

const monthLabelRef = ref('Fevereiro de 2025')

vi.mock('@/composables/useHome', () => ({
  useHome: () => ({
    categories: categoriesRef,
    isLoading: loadingRef,
    totalBudget: computed(() =>
      (categoriesRef.value ?? []).reduce((s, c) => s + parseFloat(c.initial_amount), 0),
    ),
    totalSpent: computed(() => {
      const list = categoriesRef.value ?? []
      return list.reduce(
        (s, c) => s + (parseFloat(c.initial_amount) - parseFloat(c.current_balance)),
        0,
      )
    }),
    totalRemaining: computed(() => {
      const list = categoriesRef.value ?? []
      const budget = list.reduce((s, c) => s + parseFloat(c.initial_amount), 0)
      const spent = list.reduce(
        (s, c) => s + (parseFloat(c.initial_amount) - parseFloat(c.current_balance)),
        0,
      )
      return budget - spent
    }),
    categoriesAlerts: computed(() =>
      (categoriesRef.value ?? []).filter((c) => {
        const initial = parseFloat(c.initial_amount)
        const balance = parseFloat(c.current_balance)
        if (!initial) return false
        const pct = Math.min(100, Math.round(((initial - balance) / initial) * 100))
        return pct >= 90
      }),
    ),
    monthLabel: computed(() => monthLabelRef.value),
  }),
}))
vi.mock('@/composables/useUser', () => ({
  useUser: () => ({ initials: userInitials }),
}))

describe('Feature: Tela Início — Visão geral do mês', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    categoriesRef.value = []
    loadingRef.value = false
    userInitials.value = 'EU'
    monthLabelRef.value = 'Fevereiro de 2025'
  })

  describe('Scenario: Exibir resumo do mês atual ao entrar no app', () => {
    it('exibe as iniciais do usuário no header', async () => {
      // Arrange: user authenticated, initials from useUser
      userInitials.value = 'JS'
      categoriesRef.value = [createCategory()]

      // Act: user accesses Home
      const { wrapper } = await mountWithRouter(HomeView, { route: '/' })
      await wrapper.vm.$nextTick()

      // Assert: header shows user initials
      expect(wrapper.text()).toContain('JS')
    })

    it('exibe o mês e ano atuais', async () => {
      // Arrange
      categoriesRef.value = [createCategory()]
      monthLabelRef.value = 'Fevereiro de 2025'

      // Act
      const { wrapper } = await mountWithRouter(HomeView, { route: '/' })
      await wrapper.vm.$nextTick()

      // Assert: month and year from useHome mock
      expect(wrapper.text()).toContain('Fevereiro de 2025')
    })

    it('exibe card de saldo disponível, total orçado e total gasto', async () => {
      // Arrange: categories with budget and spent
      categoriesRef.value = [
        createCategory({ initial_amount: '1000', current_balance: '700' }),
      ]

      // Act
      const { wrapper } = await mountWithRouter(HomeView, { route: '/' })
      await wrapper.vm.$nextTick()

      // Assert: labels present
      expect(wrapper.text()).toContain('Saldo disponível no mês')
      expect(wrapper.text()).toContain('Orçado')
      expect(wrapper.text()).toContain('Gasto')
      expect(wrapper.text()).toContain('Sobrou')
    })

    it('exibe navegação (links para categorias ou configurações)', async () => {
      // Arrange
      categoriesRef.value = [createCategory()]

      // Act
      const { wrapper } = await mountWithRouter(HomeView, { route: '/' })
      await wrapper.vm.$nextTick()

      // Assert: at least one RouterLink present
      const links = wrapper.findAll('a[href]')
      expect(links.length).toBeGreaterThan(0)
    })

    it('exibe estado vazio quando não há categorias', async () => {
      // Arrange: no categories
      categoriesRef.value = []
      loadingRef.value = false

      // Act
      const { wrapper } = await mountWithRouter(HomeView, { route: '/' })
      await wrapper.vm.$nextTick()

      // Assert: empty state message and link to create first category
      expect(wrapper.text()).toContain('Nenhuma categoria ainda.')
      expect(wrapper.text()).toMatch(/Criar primeira categoria|primeira categoria/i)
    })

    it('exibe lista de categorias com nome e progresso quando há categorias', async () => {
      // Arrange
      categoriesRef.value = [
        createCategory({ id: 'c1', name: 'Alimentação', initial_amount: '1000', current_balance: '600' }),
      ]

      // Act
      const { wrapper } = await mountWithRouter(HomeView, { route: '/' })
      await wrapper.vm.$nextTick()

      // Assert: section title, category name, "gasto" and "% usado"
      expect(wrapper.text()).toContain('Suas Categorias')
      expect(wrapper.text()).toContain('Alimentação')
      expect(wrapper.text()).toContain('gasto')
      expect(wrapper.text()).toMatch(/% usado/)
    })
  })
})
