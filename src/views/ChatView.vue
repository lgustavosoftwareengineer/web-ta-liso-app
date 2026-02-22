<script setup lang="ts">
import { ref } from 'vue'
import BottomNav from '@/components/BottomNav.vue'

const inputText = ref('')

const categoryBalances = [
  { name: 'Feira e Mercado', icon: '🛒', balance: 'R$ 800', pct: 20, barColor: '#1E8C45', balanceColor: 'text-[#1E8C45]' },
  { name: 'Transporte', icon: '🚌', balance: 'R$ 650', pct: 35, barColor: '#F5C518', balanceColor: 'text-[#9A7000]' },
  { name: 'Lazer & Forró', icon: '🎉', balance: 'R$ 50', pct: 90, barColor: '#C0252A', balanceColor: 'text-[#C0252A]' },
  { name: 'Saúde', icon: '🏥', balance: 'R$ 900', pct: 10, barColor: '#1E8C45', balanceColor: 'text-[#1E8C45]' },
]

function sendMessage() {
  if (!inputText.value.trim()) return
  inputText.value = ''
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-[#F5EDD8] lg:min-h-0 lg:h-full">
    <!-- Mobile header -->
    <header class="flex items-center gap-2.5 px-4 py-3 shrink-0 border-b-2 border-[#E5D9C3] bg-white">
      <div
        class="w-9 h-9 rounded-[11px] flex items-center justify-center text-lg shrink-0"
        style="background: linear-gradient(135deg, #E8500A, #F5C518)"
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
        <div class="flex-1 overflow-y-auto p-3.5 lg:p-5 flex flex-col gap-2.5 lg:gap-3 bg-[#F5EDD8]">
          <!-- Bot: welcome -->
          <div class="max-w-[82%] lg:max-w-[65%] self-start">
            <div
              class="py-2.5 px-3.5 lg:py-3 lg:px-4 rounded-2xl rounded-bl text-xs lg:text-[13px] leading-relaxed bg-white border border-[#E5D9C3] text-[#1A1008]"
            >
              Eita, bão dia! 🌞<br>
              Manda seus gastos assim: <strong>descrição valor categoria</strong><br><br>
              Ex: <em>Feira 200 alimentação</em> ou <em>Uber 45 transporte</em>
            </div>
            <div class="text-[10px] text-[#7A6E5F] font-semibold mt-0.5">09:30</div>
          </div>

          <!-- User -->
          <div class="max-w-[82%] lg:max-w-[65%] self-end">
            <div
              class="py-2.5 px-3.5 lg:py-3 lg:px-4 rounded-2xl rounded-br text-xs lg:text-[13px] leading-relaxed text-white"
              style="background: linear-gradient(135deg, #E8500A, #C03A00)"
            >
              Mercado 200 alimentação
            </div>
            <div class="text-[10px] text-[#7A6E5F] font-semibold mt-0.5 text-right">09:41</div>
          </div>

          <!-- Bot: success -->
          <div class="max-w-[82%] lg:max-w-[65%] self-start">
            <div
              class="py-2.5 px-3.5 lg:py-3 lg:px-4 rounded-2xl rounded-bl text-xs lg:text-[13px] leading-relaxed bg-white border border-[#E5D9C3] text-[#1A1008]"
            >
              Anotado, cabra! ✅
              <div
                class="inline-flex items-center gap-1.5 rounded-full py-1 px-2.5 mt-1.5 text-[11px] font-bold text-[#1E8C45] border border-[#1E8C45]/20"
                style="background: #E8F7EE"
              >
                ✅ − R$ 200,00 em Feira e Mercado
              </div>
              <br><br>
              Saldo restante: <strong>R$ 800,00</strong> — ainda tá tranquilo!
            </div>
            <div class="text-[10px] text-[#7A6E5F] font-semibold mt-0.5">09:41</div>
          </div>

          <!-- User -->
          <div class="max-w-[82%] lg:max-w-[65%] self-end">
            <div
              class="py-2.5 px-3.5 lg:py-3 lg:px-4 rounded-2xl rounded-br text-xs lg:text-[13px] leading-relaxed text-white"
              style="background: linear-gradient(135deg, #E8500A, #C03A00)"
            >
              Show de forró 500 lazer
            </div>
            <div class="text-[10px] text-[#7A6E5F] font-semibold mt-0.5 text-right">09:42</div>
          </div>

          <!-- Bot: error + buttons -->
          <div class="max-w-[82%] lg:max-w-[65%] self-start">
            <div
              class="py-2.5 px-3.5 lg:py-3 lg:px-4 rounded-2xl rounded-bl text-xs lg:text-[13px] leading-relaxed bg-white border border-[#E5D9C3] text-[#1A1008]"
            >
              Eita, lasqueira! ⚠️
              <div
                class="inline-flex items-center gap-1.5 rounded-full py-1 px-2.5 mt-1.5 text-[11px] font-bold text-[#C0252A] border border-[#C0252A]/20"
                style="background: #FAEAEA"
              >
                ⚠️ Saldo insuficiente em Lazer & Forró
              </div>
              <br><br>
              Você tem só <strong>R$ 50,00</strong> mas quer gastar <strong>R$ 500,00</strong>.<br><br>
              Vai encarar mesmo assim?
              <div class="flex gap-2 mt-1.5 flex-wrap">
                <button
                  type="button"
                  class="flex-1 min-w-0 py-2 px-4 rounded-[10px] border border-[#E5D9C3] bg-white text-[12px] font-bold text-[#7A6E5F] cursor-pointer"
                  style="font-family: 'Baloo 2', cursive"
                >
                  Deixa pra lá
                </button>
                <button
                  type="button"
                  class="flex-1 min-w-0 py-2 px-4 rounded-[10px] border-0 text-white text-[12px] font-bold cursor-pointer"
                  style="font-family: 'Baloo 2', cursive; background: linear-gradient(135deg, #C0252A, #8B1010)"
                >
                  Confirmar 🤞
                </button>
              </div>
            </div>
            <div class="text-[10px] text-[#7A6E5F] font-semibold mt-0.5">09:42</div>
          </div>
        </div>

        <!-- Input area -->
        <div
          class="shrink-0 flex gap-2 lg:gap-2.5 p-2.5 lg:p-4 border-t-2 lg:border-t border-[#E5D9C3] bg-white"
        >
          <input
            v-model="inputText"
            type="text"
            placeholder="Ex: Tapioca 15 alimentação..."
            class="flex-1 rounded-full py-2 px-3.5 lg:py-2.5 lg:px-4 text-xs lg:text-[13px] text-[#1A1008] bg-[#F5EDD8] border border-[#E5D9C3] outline-none"
            @keydown.enter="sendMessage"
          >
          <button
            type="button"
            class="w-9 h-9 lg:w-10 lg:h-10 rounded-full flex items-center justify-center text-sm lg:text-base text-white shrink-0 cursor-pointer transition-opacity hover:opacity-90"
            style="background: linear-gradient(135deg, #E8500A, #F5C518); box-shadow: 0 4px 10px rgba(232,80,10,0.3)"
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
            v-for="cat in categoryBalances"
            :key="cat.name"
            class="flex items-center justify-between py-2.5 border-b border-[#E5D9C3] last:border-0"
          >
            <div class="flex items-center gap-2">
              <span class="text-lg">{{ cat.icon }}</span>
              <div>
                <div class="text-xs font-bold text-[#1A1008]" style="font-family: 'Baloo 2', cursive">{{ cat.name }}</div>
                <div class="w-[120px] h-1 rounded-full overflow-hidden bg-[#E5D9C3] mt-1">
                  <div
                    class="h-full rounded-full transition-all"
                    :style="{ width: cat.pct + '%', background: cat.barColor }"
                  />
                </div>
              </div>
            </div>
            <div
              class="text-[13px] font-extrabold shrink-0"
              style="font-family: 'Baloo 2', cursive"
              :class="cat.balanceColor"
            >
              {{ cat.balance }}
            </div>
          </div>
          <div
            class="mt-4 p-3 rounded-[10px] border border-[#E5D9C3] bg-[#F5EDD8]"
          >
            <div class="text-[10px] font-bold text-[#7A6E5F] uppercase tracking-wider mb-1.5">Como registrar</div>
            <div class="text-[11px] text-[#7A6E5F] leading-relaxed">
              <strong>descrição valor categoria</strong><br>
              Ex: Mercado 200 alimentação<br>
              Ex: Uber 45 transporte<br>
              Ex: Forró 80 lazer
            </div>
          </div>
        </div>
      </aside>
    </div>

    <BottomNav />
  </div>
</template>
