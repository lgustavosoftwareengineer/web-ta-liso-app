/**
 * Feature: Chat financeiro — Registro de gastos (BDD)
 * Scenarios from docs/ta-liso-BDD.md — AAA pattern.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ref } from 'vue'
import { createPinia, setActivePinia } from 'pinia'
import ChatView from '../ChatView.vue'
import { mountWithRouter } from '@/test-utils/mountWithRouter'
import { createCategory, createTransaction } from '@/test-utils/mockData'
import type { ChatMessage } from '@/composables/useChat'
import type { ChatResponseInsufficientBalance } from '@/api/generated/táLisoAPI.schemas'

// Shared refs for mocks (reset in beforeEach)
const messagesRef = ref<ChatMessage[]>([])
const historyLoadingRef = ref(false)
const inputTextRef = ref('')
const isPendingRef = ref(false)
const categoriesRef = ref(createCategory ? [createCategory()] : [])
const sendMessageMock = vi.fn()
const scrollToBottomMock = vi.fn()

vi.mock('@/composables/useChat', () => ({
  useChat: () => ({
    categories: categoriesRef,
    messages: messagesRef,
    historyLoading: historyLoadingRef,
    inputText: inputTextRef,
    messagesContainer: ref(null),
    chat: { isPending: isPendingRef },
    sendMessage: sendMessageMock,
    scrollToBottom: scrollToBottomMock,
    currentTime: () => '10:00',
  }),
}))

vi.mock('@/composables/useGreeting', () => ({
  getGreetingWithEmoji: () => 'Bom dia ☀️',
}))

describe('Feature: Chat financeiro — Registro de gastos', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    messagesRef.value = []
    historyLoadingRef.value = false
    inputTextRef.value = ''
    isPendingRef.value = false
    categoriesRef.value = [createCategory()]
    sendMessageMock.mockReset()
    scrollToBottomMock.mockReset()
  })

  describe('Scenario: Abrir chat sem histórico', () => {
    it('exibe mensagem de boas-vindas com saudação quando não há mensagens', async () => {
      // Arrange: no messages, not loading
      messagesRef.value = []
      historyLoadingRef.value = false

      // Act: user opens chat
      const { wrapper } = await mountWithRouter(ChatView, { route: '/chat' })
      await wrapper.vm.$nextTick()

      // Assert: welcome message contains greeting
      expect(wrapper.text()).toContain('Bom dia ☀️')
      expect(wrapper.text()).toContain('gastei 200 no mercado')
    })
  })

  describe('Scenario: Histórico carregando', () => {
    it('exibe skeleton de carregamento enquanto historyLoading é true', async () => {
      // Arrange: history is loading
      historyLoadingRef.value = true

      // Act
      const { wrapper } = await mountWithRouter(ChatView, { route: '/chat' })
      await wrapper.vm.$nextTick()

      // Assert: skeleton elements visible (animate-pulse elements), welcome message hidden
      expect(wrapper.find('.animate-pulse').exists()).toBe(true)
      expect(wrapper.text()).not.toContain('Bom dia')
    })
  })

  describe('Scenario: Exibir mensagem do usuário', () => {
    it('renderiza mensagem do usuário alinhada à direita', async () => {
      // Arrange: one user message
      messagesRef.value = [{ role: 'user', text: 'gastei 80 no mercado', time: '10:00' }]

      // Act
      const { wrapper } = await mountWithRouter(ChatView, { route: '/chat' })
      await wrapper.vm.$nextTick()

      // Assert: user message text visible
      expect(wrapper.text()).toContain('gastei 80 no mercado')
    })
  })

  describe('Scenario: Bot confirma transação registrada', () => {
    it('exibe confirmação "Anotado" com categoria e valor quando bot retorna transação', async () => {
      // Arrange: bot success message
      const transaction = createTransaction({ amount: '80', category_id: 'cat-1' })
      messagesRef.value = [
        {
          role: 'bot',
          text: 'Feito!',
          time: '10:01',
          transaction,
          catName: 'Alimentação',
          catIcon: '🛒',
          remainingBalance: 920,
        },
      ]

      // Act
      const { wrapper } = await mountWithRouter(ChatView, { route: '/chat' })
      await wrapper.vm.$nextTick()

      // Assert: success confirmation, amount, category name, remaining balance
      expect(wrapper.text()).toContain('Anotado, cabra!')
      expect(wrapper.text()).toContain('80,00')
      expect(wrapper.text()).toContain('Alimentação')
      expect(wrapper.text()).toContain('920,00')
    })
  })

  describe('Scenario: Saldo insuficiente bloqueia transação via chat', () => {
    it('exibe alerta de saldo insuficiente com valores disponível e solicitado', async () => {
      // Arrange: bot insufficient balance message
      messagesRef.value = [
        {
          role: 'bot',
          text: 'Não tem saldo suficiente!',
          time: '10:02',
          insufficientBalance: {
            available: '50',
            requested: '200',
            message: 'Saldo insuficiente',
          } satisfies ChatResponseInsufficientBalance,
        },
      ]

      // Act
      const { wrapper } = await mountWithRouter(ChatView, { route: '/chat' })
      await wrapper.vm.$nextTick()

      // Assert: warning icon, available and requested amounts
      expect(wrapper.text()).toContain('🚫')
      expect(wrapper.text()).toContain('Disponível')
      expect(wrapper.text()).toContain('50,00')
      expect(wrapper.text()).toContain('Solicitado')
      expect(wrapper.text()).toContain('200,00')
    })
  })

  describe('Scenario: Bot responde com mensagem simples', () => {
    it('exibe texto da mensagem bot sem card de transação', async () => {
      // Arrange: plain bot message
      messagesRef.value = [{ role: 'bot', text: 'Como posso ajudar?', time: '10:03' }]

      // Act
      const { wrapper } = await mountWithRouter(ChatView, { route: '/chat' })
      await wrapper.vm.$nextTick()

      // Assert: plain message text visible, no "Anotado" or "🚫"
      expect(wrapper.text()).toContain('Como posso ajudar?')
      expect(wrapper.text()).not.toContain('Anotado, cabra!')
      expect(wrapper.text()).not.toContain('🚫')
    })
  })

  describe('Scenario: Indicador de digitação do bot', () => {
    it('exibe indicador de digitação enquanto chat.isPending é true', async () => {
      // Arrange: chat mutation pending
      isPendingRef.value = true

      // Act
      const { wrapper } = await mountWithRouter(ChatView, { route: '/chat' })
      await wrapper.vm.$nextTick()

      // Assert: typing indicator dots visible
      expect(wrapper.find('.animate-bounce').exists()).toBe(true)
    })

    it('não exibe indicador de digitação quando chat não está pendente', async () => {
      // Arrange: chat not pending
      isPendingRef.value = false

      // Act
      const { wrapper } = await mountWithRouter(ChatView, { route: '/chat' })
      await wrapper.vm.$nextTick()

      // Assert: no bounce animation
      expect(wrapper.find('.animate-bounce').exists()).toBe(false)
    })
  })

  describe('Scenario: Enviar mensagem pelo campo de input', () => {
    it('chama sendMessage ao pressionar Enter no input', async () => {
      // Arrange
      const { wrapper } = await mountWithRouter(ChatView, { route: '/chat' })
      await wrapper.vm.$nextTick()

      // Act: press Enter in input
      const input = wrapper.find('input[type="text"]')
      await input.trigger('keydown.enter')

      // Assert: sendMessage called
      expect(sendMessageMock).toHaveBeenCalledTimes(1)
    })

    it('chama sendMessage ao clicar no botão enviar', async () => {
      // Arrange
      const { wrapper } = await mountWithRouter(ChatView, { route: '/chat' })
      await wrapper.vm.$nextTick()

      // Act: click send button
      const sendButton = wrapper.find('button[type="button"]:not([aria-label])')
      await sendButton.trigger('click')

      // Assert: sendMessage called
      expect(sendMessageMock).toHaveBeenCalledTimes(1)
    })

    it('botão enviar fica desabilitado enquanto chat.isPending é true', async () => {
      // Arrange: chat pending
      isPendingRef.value = true

      // Act
      const { wrapper } = await mountWithRouter(ChatView, { route: '/chat' })
      await wrapper.vm.$nextTick()

      // Assert: send button disabled
      const sendButton = wrapper.find('button[type="button"]:not([aria-label])')
      expect(sendButton.attributes('disabled')).toBeDefined()
    })
  })
})
