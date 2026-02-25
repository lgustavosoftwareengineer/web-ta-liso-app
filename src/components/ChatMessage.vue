<script setup lang="ts">
import { formatBRL } from '@/utils/categoryHelpers'
import type { ChatMessage } from '@/composables/useChat'

defineProps<{ message: ChatMessage }>()
</script>

<template>
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
      <div class="mt-1.5 pt-1.5 border-t border-[#E5D9C3] text-[11px] text-[#7A6E5F] italic">
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
      <div class="mt-1.5 pt-1.5 border-t border-[#C0252A]/15 flex flex-col gap-0.5 text-[11px]">
        <span class="text-[#7A6E5F]"
          >Disponível:
          <strong class="text-[#1A1008]"
            >R$ {{ formatBRL(parseFloat(message.insufficientBalance.available)) }}</strong
          ></span
        >
        <span class="text-[#7A6E5F]"
          >Solicitado:
          <strong class="text-[#C0252A]"
            >R$ {{ formatBRL(parseFloat(message.insufficientBalance.requested)) }}</strong
          ></span
        >
      </div>
    </div>
    <div class="text-[10px] text-[#7A6E5F] font-semibold mt-0.5">
      {{ message.time }}
    </div>
  </div>

  <!-- Bot message — plain (info / error) -->
  <div v-else class="max-w-[82%] lg:max-w-[65%] self-start">
    <div
      class="py-2.5 px-3.5 lg:py-3 lg:px-4 rounded-2xl rounded-bl text-xs lg:text-[13px] leading-relaxed bg-white border border-[#E5D9C3] text-[#1A1008]"
      v-html="message.text.replace(/\n/g, '<br>')"
    />
    <div class="text-[10px] text-[#7A6E5F] font-semibold mt-0.5">
      {{ message.time }}
    </div>
  </div>
</template>
