<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue'
import BottomNav from '@/components/BottomNav.vue'
import ChatMessage from '@/components/ChatMessage.vue'
import { categoryPercentage, barColor, balanceColor, formatBRL } from '@/utils/categoryHelpers'
import { getGreetingWithEmoji } from '@/composables/useGreeting'
import { useChat } from '@/composables/useChat'

const {
  categories,
  messages,
  historyLoading,
  inputText,
  messagesContainer,
  chat,
  sendMessage,
  scrollToBottom,
  currentTime,
} = useChat()

const isAtBottom = ref(true)
const SCROLL_THRESHOLD = 80

function checkScrollPosition() {
  const el = messagesContainer.value
  if (!el) return
  const { scrollTop, scrollHeight, clientHeight } = el
  isAtBottom.value = scrollHeight - scrollTop - clientHeight <= SCROLL_THRESHOLD
}

function onScrollToBottomClick() {
  scrollToBottom()
  isAtBottom.value = true
}

// Anexa o listener quando o container estiver disponível (ref pode vir depois do mount)
watch(
  messagesContainer,
  (el, prevEl) => {
    if (prevEl) prevEl.removeEventListener('scroll', checkScrollPosition)
    if (!el) return
    el.addEventListener('scroll', checkScrollPosition)
    // Sincroniza estado inicial (ex.: usuário já rolou para cima)
    checkScrollPosition()
  },
  { immediate: true },
)
onUnmounted(() => {
  const el = messagesContainer.value
  if (el) el.removeEventListener('scroll', checkScrollPosition)
})
</script>

<template>
  <div class="h-full min-h-0 flex flex-col bg-[#F5EDD8] lg:min-h-0">
    <!-- Mobile header: fixo no topo em mobile -->
    <header
      class="flex items-center gap-2.5 px-4 py-3 shrink-0 border-b-2 border-[#E5D9C3] bg-white fixed top-0 left-0 right-0 z-20 lg:static"
    >
      <div
        class="w-9 h-9 rounded-[11px] flex items-center justify-center text-lg shrink-0"
        style="background: linear-gradient(135deg, #e8500a, #f5c518)"
      >
        🤖
      </div>
      <div>
        <div class="text-sm font-bold text-[#1A1008]" style="font-family: 'Baloo 2', cursive">
          Assistente do Tá Liso
        </div>
        <div class="text-[11px] text-[#1E8C45] font-semibold">● Online, visse!</div>
      </div>
    </header>

    <!-- Spacer para header fixo no mobile -->
    <div class="shrink-0 h-14 lg:hidden" aria-hidden="true" />

    <!-- Chat layout: messages + input; on desktop add sidebar -->
    <div class="flex-1 flex flex-col min-h-0 lg:grid lg:grid-cols-[1fr_320px]">
      <!-- Main: messages + input -->
      <div class="flex-1 flex flex-col min-h-0 border-r-0 lg:border-r lg:border-[#E5D9C3] relative">
        <div
          ref="messagesContainer"
          class="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-3.5 lg:p-5 pb-12 lg:pb-5 flex flex-col gap-2.5 lg:gap-3 bg-[#F5EDD8] scroll-smooth"
        >
          <!-- History loading skeleton -->
          <template v-if="historyLoading">
            <div
              v-for="skeletonIndex in 4"
              :key="skeletonIndex"
              class="flex"
              :class="skeletonIndex % 2 === 0 ? 'justify-end' : 'justify-start'"
            >
              <div
                class="h-10 rounded-2xl animate-pulse"
                :class="skeletonIndex % 2 === 0 ? 'w-48 rounded-br' : 'w-56 rounded-bl'"
                style="background: #e5d9c3"
              />
            </div>
          </template>

          <template v-else>
            <!-- Welcome message when no history -->
            <div v-if="messages.length === 0" class="max-w-[82%] lg:max-w-[65%] self-start">
              <div
                class="py-2.5 px-3.5 lg:py-3 lg:px-4 rounded-2xl rounded-bl text-xs lg:text-[13px] leading-relaxed bg-white border border-[#E5D9C3] text-[#1A1008]"
              >
                Eita, {{ getGreetingWithEmoji() }}!<br />Manda aí teus gastos do jeito que cê fala,
                visse:<br /><br />Ex: <em>gastei 200 no mercado</em> ou <em>Uber 45 transporte</em>
              </div>
              <div class="text-[10px] text-[#7A6E5F] font-semibold mt-0.5">{{ currentTime() }}</div>
            </div>

            <ChatMessage
              v-for="(message, messageIndex) in messages"
              :key="messageIndex"
              :message="message"
            />
          </template>

          <!-- Typing indicator -->
          <div v-if="chat.isPending.value" class="max-w-[82%] self-start">
            <div
              class="py-2.5 px-4 rounded-2xl rounded-bl bg-white border border-[#E5D9C3] text-[#7A6E5F] text-xs flex items-center gap-1"
            >
              <span
                class="w-1.5 h-1.5 rounded-full bg-[#7A6E5F] animate-bounce [animation-delay:0ms]"
              />
              <span
                class="w-1.5 h-1.5 rounded-full bg-[#7A6E5F] animate-bounce [animation-delay:150ms]"
              />
              <span
                class="w-1.5 h-1.5 rounded-full bg-[#7A6E5F] animate-bounce [animation-delay:300ms]"
              />
            </div>
          </div>
        </div>

        <!-- Botão scroll: irmão do container de mensagens, absolute na coluna = fica fixo no canto da área visível (não rola com o conteúdo) -->
        <Transition name="fade">
          <button
            v-show="!isAtBottom"
            type="button"
            class="absolute bottom-20 right-4 z-30 w-11 h-11 rounded-full flex items-center justify-center text-white shadow-lg transition-transform hover:scale-105 active:scale-95 lg:bottom-20 lg:right-8"
            style="
              background: linear-gradient(135deg, #e8500a, #f5c518);
              box-shadow: 0 4px 14px rgba(232, 80, 10, 0.4);
            "
            aria-label="Ir para a última mensagem"
            @click="onScrollToBottomClick"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v9.586l4.293-4.293a1 1 0 111.414 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 12.586V3a1 1 0 011-1z" clip-rule="evenodd" />
            </svg>
          </button>
        </Transition>

        <!-- Input area: fixa na parte inferior em mobile (acima do BottomNav) -->
        <div
          class="shrink-0 flex gap-2 lg:gap-2.5 p-2.5 lg:p-4 border-t-2 lg:border-t border-[#E5D9C3] bg-white fixed left-0 right-0 bottom-[86px] z-20 lg:relative lg:bottom-auto lg:left-auto lg:right-auto"
        >
          <input
            v-model="inputText"
            type="text"
            placeholder="Ex: gastei 80 reais no mercado..."
            class="flex-1 min-w-0 w-full rounded-full py-2 px-3.5 lg:py-2.5 lg:px-4 text-base lg:text-[13px] text-[#1A1008] bg-[#F5EDD8] border border-[#E5D9C3] outline-none"
            @keydown.enter="sendMessage"
          />
          <button
            type="button"
            class="w-9 h-9 lg:w-10 lg:h-10 rounded-full flex items-center justify-center text-sm lg:text-base text-white shrink-0 cursor-pointer transition-opacity hover:opacity-90 disabled:opacity-50"
            style="
              background: linear-gradient(135deg, #e8500a, #f5c518);
              box-shadow: 0 4px 10px rgba(232, 80, 10, 0.3);
            "
            :disabled="chat.isPending.value"
            @click="sendMessage"
          >
            ➤
          </button>
        </div>

        <!-- Spacer para input fixo no mobile (evita que o flex quebre) -->
        <div class="shrink-0 h-16 lg:hidden" aria-hidden="true" />
      </div>

      <!-- Desktop sidebar: category balances -->
      <aside class="hidden lg:flex flex-col bg-white overflow-hidden">
        <div
          class="shrink-0 py-4 px-4 border-b border-[#E5D9C3] text-[13px] font-bold text-[#7A6E5F] uppercase tracking-wider"
          style="font-family: 'Baloo 2', cursive"
        >
          Saldos das categorias
        </div>
        <div class="flex-1 overflow-y-auto p-3">
          <div
            v-for="category in categories ?? []"
            :key="category.id"
            class="flex items-center justify-between py-2.5 border-b border-[#E5D9C3] last:border-0"
          >
            <div class="flex items-center gap-2">
              <span class="text-lg">{{ category.icon ?? '📦' }}</span>
              <div>
                <div
                  class="text-xs font-bold text-[#1A1008]"
                  style="font-family: 'Baloo 2', cursive"
                >
                  {{ category.name }}
                </div>
                <div class="w-[120px] h-1 rounded-full overflow-hidden bg-[#E5D9C3] mt-1">
                  <div
                    class="h-full rounded-full transition-all"
                    :style="{
                      width: categoryPercentage(category) + '%',
                      background: barColor(categoryPercentage(category)),
                    }"
                  />
                </div>
              </div>
            </div>
            <div
              class="text-[13px] font-extrabold shrink-0"
              style="font-family: 'Baloo 2', cursive"
              :class="balanceColor(categoryPercentage(category))"
            >
              R$ {{ formatBRL(category.current_balance) }}
            </div>
          </div>
          <div class="mt-4 p-3 rounded-[10px] border border-[#E5D9C3] bg-[#F5EDD8]">
            <div class="text-[10px] font-bold text-[#7A6E5F] uppercase tracking-wider mb-1.5">
              Como registrar
            </div>
            <div class="text-[11px] text-[#7A6E5F] leading-relaxed">
              Fala naturalmente:<br />
              Ex: gastei 80 reais no mercado<br />
              Ex: Uber 45 transporte<br />
              Ex: paguei 30 de forró
            </div>
          </div>
        </div>
      </aside>
    </div>

    <BottomNav />
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
