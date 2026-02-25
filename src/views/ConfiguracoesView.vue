<script setup lang="ts">
import BottomNav from '@/components/BottomNav.vue'
import ConfiguracoesProfileCard from '@/components/ConfiguracoesProfileCard.vue'
import ConfiguracoesSettingToggle from '@/components/ConfiguracoesSettingToggle.vue'
import { useAuth } from '@/composables/useAuth'
import { useConfiguracoes } from '@/composables/useConfiguracoes'

const { logout } = useAuth()
const {
  profileLoading,
  settingsLoading,
  name,
  email,
  initials,
  formName,
  nameError,
  settingsForm,
  updateProfile,
  updateSettings,
  saveProfile,
  toggle,
} = useConfiguracoes()
</script>

<template>
  <div class="h-full min-h-0 flex flex-col bg-[#F5EDD8]">
    <header
      class="flex items-center justify-between px-4 py-3 shrink-0 border-b-2 border-[#E5D9C3] bg-white"
    >
      <span class="text-xl font-extrabold text-[#1A1008]" style="font-family: 'Baloo 2', cursive"
        >⚙️ Configurações</span
      >
      <div
        class="w-8.5 h-8.5 rounded-full flex items-center justify-center text-white text-[13px] font-bold shrink-0"
        style="
          font-family: 'Baloo 2', cursive;
          background: linear-gradient(135deg, #e8500a 0%, #f5c518 100%);
        "
      >
        {{ initials }}
      </div>
    </header>

    <main class="flex-1 min-h-0 overflow-y-auto p-4">
      <ConfiguracoesProfileCard
        :initials="initials"
        :name="name"
        :email="email"
        :is-loading="profileLoading"
      />

      <!-- Perfil edit -->
      <div
        class="text-[13px] font-bold text-[#7A6E5F] uppercase tracking-wider mb-2.5"
        style="font-family: 'Baloo 2', cursive"
      >
        Perfil
      </div>
      <div
        class="rounded-2xl border border-[#E5D9C3] bg-white overflow-hidden mb-4 p-4 flex flex-col gap-3"
      >
        <!-- Nome -->
        <div>
          <label class="text-[11px] font-bold text-[#7A6E5F] uppercase tracking-wider mb-1 block"
            >Seu nome</label
          >
          <input
            v-model="formName"
            type="text"
            placeholder="Ex: João Silva"
            class="w-full rounded-[10px] py-2 px-3 text-sm text-[#1A1008] bg-[#F5EDD8] border outline-none"
            :class="nameError ? 'border-[#C0252A]' : 'border-[#E5D9C3]'"
            :disabled="profileLoading"
          />
          <p v-if="nameError" class="text-[11px] text-[#C0252A] mt-1">{{ nameError }}</p>
        </div>
        <!-- E-mail (somente leitura) -->
        <div>
          <label class="text-[11px] font-bold text-[#7A6E5F] uppercase tracking-wider mb-1 block"
            >E-mail</label
          >
          <input
            :value="email"
            type="email"
            disabled
            class="w-full rounded-[10px] py-2 px-3 text-sm text-[#7A6E5F] bg-[#E5D9C3]/40 border border-[#E5D9C3] outline-none cursor-not-allowed"
          />
          <p class="text-[11px] text-[#7A6E5F] mt-1">O e-mail não pode ser alterado.</p>
        </div>
        <!-- Salvar -->
        <button
          type="button"
          class="w-full py-2.5 rounded-xl text-[13px] font-bold text-white cursor-pointer transition-opacity hover:opacity-90 disabled:opacity-50"
          style="background: linear-gradient(135deg, #e8500a 0%, #c03a00 100%)"
          :disabled="profileLoading || updateProfile.isPending.value"
          @click="saveProfile"
        >
          {{ updateProfile.isPending.value ? 'Salvando...' : 'Salvar alterações 💾' }}
        </button>
      </div>

      <!-- Orçamento -->
      <div
        class="text-[13px] font-bold text-[#7A6E5F] uppercase tracking-wider mb-2.5"
        style="font-family: 'Baloo 2', cursive"
      >
        Orçamento
      </div>

      <!-- Settings skeleton -->
      <div
        v-if="settingsLoading"
        class="rounded-2xl border border-[#E5D9C3] bg-white overflow-hidden mb-4"
      >
        <div
          v-for="i in 3"
          :key="i"
          class="flex items-center justify-between p-3.5 border-b last:border-b-0 border-[#E5D9C3]"
        >
          <div class="flex items-center gap-2.5">
            <div class="w-7 h-7 rounded-lg bg-[#E5D9C3] animate-pulse" />
            <div class="space-y-1.5">
              <div class="w-28 h-3 rounded bg-[#E5D9C3] animate-pulse" />
              <div class="w-40 h-2.5 rounded bg-[#E5D9C3] animate-pulse" />
            </div>
          </div>
          <div class="w-10.5 h-6 rounded-xl bg-[#E5D9C3] animate-pulse shrink-0" />
        </div>
      </div>

      <div v-else class="rounded-2xl border border-[#E5D9C3] bg-white overflow-hidden mb-4">
        <ConfiguracoesSettingToggle
          icon="🔄"
          title="Reset mensal"
          description="Zera saldos todo dia 1º"
          :model-value="settingsForm.monthly_reset"
          :disabled="settingsLoading || updateSettings.isPending.value"
          @update:model-value="toggle('monthly_reset')"
        />
        <ConfiguracoesSettingToggle
          icon="⚠️"
          title="Alertar saldo baixo"
          description="Quando atingir 20% do saldo"
          :model-value="settingsForm.alert_low_balance"
          :disabled="settingsLoading || updateSettings.isPending.value"
          @update:model-value="toggle('alert_low_balance')"
        />
        <ConfiguracoesSettingToggle
          icon="🚫"
          title="Bloquear saldo negativo"
          description="Impedir gastos acima do saldo"
          :model-value="settingsForm.block_negative_balance"
          :disabled="settingsLoading || updateSettings.isPending.value"
          @update:model-value="toggle('block_negative_balance')"
        />
      </div>

      <!-- Logout -->
      <button
        type="button"
        class="w-full py-3.5 rounded-[14px] border border-[#C0252A]/30 bg-[#FAEAEA] text-[14px] font-bold text-[#C0252A] cursor-pointer mb-2"
        style="font-family: 'Baloo 2', cursive"
        @click="logout"
      >
        Sair da conta 👋
      </button>
      <div class="text-center text-[10px] text-[#7A6E5F] font-semibold pb-1">
        Tá Liso App v1.0.0
      </div>
    </main>

    <BottomNav />
  </div>
</template>
