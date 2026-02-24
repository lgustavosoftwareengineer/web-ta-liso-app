/**
 * Feature: Login sem senha via e-mail (BDD)
 * Scenarios from docs/ta-liso-BDD.md — AAA pattern.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ref } from 'vue'
import { mount } from '@vue/test-utils'
import LoginView from '../LoginView.vue'

const push = vi.fn()
const mutateAsync = vi.fn()
const getErrorMessage = vi.fn()

vi.mock('vue-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vue-router')>()
  return {
    ...actual,
    useRouter: () => ({ push }),
  }
})
vi.mock('@/api/generated/auth/auth', () => ({
  useRequestCodeApiAuthRequestCodePost: () => ({
    mutateAsync,
    isPending: ref(false),
  }),
}))
vi.mock('@/composables/useApiError', () => ({
  useApiError: () => ({ getErrorMessage }),
}))

describe('Feature: Login sem senha via e-mail', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    getErrorMessage.mockReturnValue('Formato de e-mail inválido.')
  })

  describe('Scenario: Usuário solicita código de acesso com e-mail válido', () => {
    it('redireciona para a tela de validação do token após sucesso', async () => {
      // Arrange: user on login screen, valid email
      mutateAsync.mockResolvedValue(undefined)
      const wrapper = mount(LoginView)
      const input = wrapper.find('input[type="email"]')
      await input.setValue('joao@email.com')

      // Act: click "Mandar o código"
      await wrapper.find('button').trigger('click')
      await wrapper.vm.$nextTick()

      // Assert: API called and redirect to token screen
      expect(mutateAsync).toHaveBeenCalledWith({ data: { email: 'joao@email.com' } })
      expect(push).toHaveBeenCalledWith({ name: 'token', query: { email: 'joao@email.com' } })
    })
  })

  describe('Scenario: Usuário solicita código com e-mail inválido', () => {
    it('exibe mensagem de erro e permanece na tela de login', async () => {
      // Arrange: API returns validation error
      mutateAsync.mockRejectedValue(new Error('validation'))
      getErrorMessage.mockReturnValue('Informe um e-mail válido.')

      const wrapper = mount(LoginView)
      const input = wrapper.find('input[type="email"]')
      await input.setValue('joaoemail.com')

      // Act: click "Mandar o código"
      await wrapper.find('button').trigger('click')
      await wrapper.vm.$nextTick()
      await vi.waitFor(() => {
        expect(wrapper.text()).toContain('Informe um e-mail válido.')
      })

      // Assert: error message shown, no redirect
      expect(mutateAsync).toHaveBeenCalled()
      expect(push).not.toHaveBeenCalled()
    })
  })
})
