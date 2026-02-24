/**
 * Feature: Tela Início — Visão geral do mês (BDD)
 * Scenario: Exibir resumo do mês atual ao entrar no app.
 * AAA pattern.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ref } from 'vue'
import { createPinia, setActivePinia } from 'pinia'
import HomeView from '../HomeView.vue'
import { mountWithRouter } from '@/test-utils/mountWithRouter'
import type { CategoryResponse } from '@/api/generated/táLisoAPI.schemas'
import { createCategory } from '@/test-utils/mockData'

const categoriesData = ref<CategoryResponse[]>([])
const loadingCategories = ref(false)
const userInitials = ref('EU')

vi.mock('@/api/generated/categories/categories', () => ({
  useListCategoriesApiCategoriesGet: () => ({ data: categoriesData, isLoading: loadingCategories }),
}))
vi.mock('@/composables/useUser', () => ({
  useUser: () => ({ initials: userInitials }),
}))

describe('Feature: Tela Início — Visão geral do mês', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    categoriesData.value = []
    loadingCategories.value = false
    userInitials.value = 'EU'
  })

  describe('Scenario: Exibir resumo do mês atual ao entrar no app', () => {
    it('exibe as iniciais do usuário no header', async () => {
      // Arrange: user authenticated, initials from useUser
      userInitials.value = 'JS'
      categoriesData.value = [createCategory()]

      // Act: user accesses Home
      const { wrapper } = await mountWithRouter(HomeView, { route: '/' })
      await wrapper.vm.$nextTick()

      // Assert: header shows user initials
      expect(wrapper.text()).toContain('JS')
    })

    it('exibe o mês e ano atuais', async () => {
      // Arrange
      categoriesData.value = [createCategory()]

      // Act
      const { wrapper } = await mountWithRouter(HomeView, { route: '/' })
      await wrapper.vm.$nextTick()

      // Assert: month and year (e.g. "fevereiro de 2025" or similar)
      const now = new Date()
      const monthYear = now.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
      const monthName = monthYear.split(' de ')[0] ?? monthYear
      expect(wrapper.text().toLowerCase()).toMatch(monthName)
    })

    it('exibe card de saldo disponível, total orçado e total gasto', async () => {
      // Arrange: categories with budget and spent
      categoriesData.value = [
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
      categoriesData.value = [createCategory()]

      // Act
      const { wrapper } = await mountWithRouter(HomeView, { route: '/' })
      await wrapper.vm.$nextTick()

      // Assert: at least one RouterLink present
      const links = wrapper.findAll('a[href]')
      expect(links.length).toBeGreaterThan(0)
    })

    it('exibe estado vazio quando não há categorias', async () => {
      // Arrange: no categories
      categoriesData.value = []
      loadingCategories.value = false

      // Act
      const { wrapper } = await mountWithRouter(HomeView, { route: '/' })
      await wrapper.vm.$nextTick()

      // Assert: empty state message and link to create first category
      expect(wrapper.text()).toContain('Nenhuma categoria ainda.')
      expect(wrapper.text()).toMatch(/Criar primeira categoria|primeira categoria/i)
    })

    it('exibe lista de categorias com nome e progresso quando há categorias', async () => {
      // Arrange
      categoriesData.value = [
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
