<script setup lang="ts">
import { watch, nextTick } from 'vue'
import BottomNav from '@/components/BottomNav.vue'
import { categoryPercentage, barColor, balanceColor, formatBRL } from '@/utils/categoryHelpers'
import { useGreeting } from '@/composables/useGreeting'
import { useChat } from '@/composables/useChat'

const {
  categories,
  messages,
  historyLoading,
  inputText,
  messagesContainer,
  chat,
  sendMessage,
  currentTime,
} = useChat()
const { getGreetingWithEmoji } = useGreeting()

// Assim que o histórico terminar de carregar, scrolla para a última mensagem
watch(historyLoading, async (loading, wasLoading) => {
  if (wasLoading && !loading) {
    await nextTick()
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  }
})
</script>

<template>
  <div class="min-h-screen flex flex-col bg-[#F5EDD8] lg:min-h-0 lg:h-full">
    <!-- Mobile header -->
    <header
      class="flex items-center gap-2.5 px-4 py-3 shrink-0 border-b-2 border-[#E5D9C3] bg-white"
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

    <!-- Chat layout: messages + input; on desktop add sidebar -->
    <div class="flex-1 flex flex-col min-h-0 lg:grid lg:grid-cols-[1fr_320px]">
      <!-- Main: messages + input -->
      <div class="flex-1 flex flex-col min-h-0 border-r-0 lg:border-r lg:border-[#E5D9C3]">
        <div
          ref="messagesContainer"
          class="flex-1 overflow-y-auto p-3.5 lg:p-5 flex flex-col gap-2.5 lg:gap-3 bg-[#F5EDD8]"
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

            <template v-for="(message, messageIndex) in messages" :key="messageIndex">
              <!-- User message -->
              <div v-if="message.role === 'user'" class="max-w-[82%] lg:max-w-[65%] self-end">
                <div
                  class="py-2.5 px-3.5 lg:py-3 lg:px-4 rounded-2xl rounded-br text-xs lg:text-[13px] leading-relaxed text-white"
                  style="background: linear-gradient(135deg, #e8500a, #c03a00)"
                >
                  {{ message.text }}
                </div>
                <div class="text-[10px] text-[#7A6E5F] font-semibold mt-0.5 text-right">
                  {{ message.time }}
                </div>
              </div>

              <!-- Bot message — success (transaction registered) -->
              <div
                v-else-if="message.role === 'bot' && message.transaction"
                class="max-w-[82%] lg:max-w-[65%] self-start"
              >
                <div
                  class="py-2.5 px-3.5 lg:py-3 lg:px-4 rounded-2xl rounded-bl text-xs lg:text-[13px] leading-relaxed bg-white border border-[#E5D9C3] text-[#1A1008]"
                >
                  Anotado, cabra! ✅
                  <div
                    class="inline-flex items-center gap-1.5 rounded-full py-1 px-2.5 mt-1.5 text-[11px] font-bold text-[#1E8C45] border border-[#1E8C45]/20"
                    style="background: #e8f7ee"
                  >
                    {{ message.catIcon ?? '📦' }} − R$
                    {{ formatBRL(parseFloat(message.transaction.amount)) }} em
                    {{ message.catName ?? 'categoria' }}
                  </div>
                  <template v-if="message.remainingBalance !== undefined">
                    <br />
                    <span class="text-[11px] text-[#7A6E5F]">
                      Saldo restante: <strong>R$ {{ formatBRL(message.remainingBalance) }}</strong>
                    </span>
                  </template>
                  <div
                    class="mt-1.5 pt-1.5 border-t border-[#E5D9C3] text-[11px] text-[#7A6E5F] italic"
                  >
                    {{ message.text }}
                  </div>
                </div>
                <div class="text-[10px] text-[#7A6E5F] font-semibold mt-0.5">
                  {{ message.time }}
                </div>
              </div>

              <!-- Bot message — insufficient balance -->
              <div
                v-else-if="message.role === 'bot' && message.insufficientBalance"
                class="max-w-[82%] lg:max-w-[65%] self-start"
              >
                <div
                  class="py-2.5 px-3.5 lg:py-3 lg:px-4 rounded-2xl rounded-bl text-xs lg:text-[13px] leading-relaxed bg-[#FAEAEA] border border-[#C0252A]/20 text-[#1A1008]"
                >
                  🚫 {{ message.text }}
                  <div
                    class="mt-1.5 pt-1.5 border-t border-[#C0252A]/15 flex flex-col gap-0.5 text-[11px]"
                  >
                    <span class="text-[#7A6E5F]"
                      >Disponível:
                      <strong class="text-[#1A1008]"
                        >R$
                        {{ formatBRL(parseFloat(message.insufficientBalance.available)) }}</strong
                      ></span
                    >
                    <span class="text-[#7A6E5F]"
                      >Solicitado:
                      <strong class="text-[#C0252A]"
                        >R$
                        {{ formatBRL(parseFloat(message.insufficientBalance.requested)) }}</strong
                      ></span
                    >
                  </div>
                </div>
                <div class="text-[10px] text-[#7A6E5F] font-semibold mt-0.5">
                  {{ message.time }}
                </div>
              </div>

              <!-- Bot message — plain (info / error / welcome) -->
              <div v-else class="max-w-[82%] lg:max-w-[65%] self-start">
                <div
                  class="py-2.5 px-3.5 lg:py-3 lg:px-4 rounded-2xl rounded-bl text-xs lg:text-[13px] leading-relaxed bg-white border border-[#E5D9C3] text-[#1A1008]"
                  v-html="message.text.replace(/\n/g, '<br>')"
                />
                <div class="text-[10px] text-[#7A6E5F] font-semibold mt-0.5">
                  {{ message.time }}
                </div>
              </div>
            </template> </template
          ><!-- /v-else -->

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

        <!-- Input area -->
        <div
          class="shrink-0 flex gap-2 lg:gap-2.5 p-2.5 lg:p-4 border-t-2 lg:border-t border-[#E5D9C3] bg-white"
        >
          <input
            v-model="inputText"
            type="text"
            placeholder="Ex: gastei 80 reais no mercado..."
            class="flex-1 rounded-full py-2 px-3.5 lg:py-2.5 lg:px-4 text-xs lg:text-[13px] text-[#1A1008] bg-[#F5EDD8] border border-[#E5D9C3] outline-none"
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
              R$
              {{
                parseFloat(category.current_balance).toLocaleString('pt-BR', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })
              }}
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
