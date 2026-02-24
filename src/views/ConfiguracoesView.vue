<script setup lang="ts">
import { ref, watch } from 'vue'
import { useQueryClient } from '@tanstack/vue-query'
import BottomNav from '@/components/BottomNav.vue'
import {
  useUpdateSettingsApiSettingsPatch,
  getGetSettingsApiSettingsGetQueryKey,
} from '@/api/generated/settings/settings'
import {
  useGetProfileApiUsersMeGet,
  useUpdateProfileApiUsersMePatch,
  getGetProfileApiUsersMeGetQueryKey,
} from '@/api/generated/users/users'
import { useAuth } from '@/composables/useAuth'
import { useUser } from '@/composables/useUser'
import { useSettings } from '@/composables/useSettings'

const queryClient = useQueryClient()
const { logout } = useAuth()

const { isLoading: profileLoading } = useGetProfileApiUsersMeGet()
const { name, email, initials } = useUser()
const nameError = ref('')
const formName = ref(name.value)

const updateProfile = useUpdateProfileApiUsersMePatch({
  mutation: {
    onSuccess: (response) => {
      queryClient.setQueryData(getGetProfileApiUsersMeGetQueryKey(), response)
      nameError.value = ''
    },
    onError: () => {
      nameError.value = 'O nome não pode ser vazio.'
    },
  },
})

const updateSettings = useUpdateSettingsApiSettingsPatch({
  mutation: {
    onSuccess: (response) => {
      queryClient.setQueryData(getGetSettingsApiSettingsGetQueryKey(), response)
    },
  },
})

const {
  isLoading: settingsLoading,
  alertLowBalance,
  monthlyReset,
  blockNegativeBalance,
} = useSettings()

const settingsForm = ref({
  alert_low_balance: false,
  monthly_reset: false,
  block_negative_balance: false,
})

watch(
  [alertLowBalance, monthlyReset, blockNegativeBalance],
  () => {
    settingsForm.value = {
      alert_low_balance: alertLowBalance.value,
      monthly_reset: monthlyReset.value,
      block_negative_balance: blockNegativeBalance.value,
    }
  },
  { immediate: true },
)

function saveProfile() {
  if (!formName.value) {
    nameError.value = 'O nome não pode ser vazio.'
    return
  }

  updateProfile.mutate({ data: { name: formName.value } })
}

function toggle(field: 'alert_low_balance' | 'monthly_reset' | 'block_negative_balance') {
  if (field === 'alert_low_balance')
    settingsForm.value.alert_low_balance = !settingsForm.value.alert_low_balance
  if (field === 'monthly_reset')
    settingsForm.value.monthly_reset = !settingsForm.value.monthly_reset
  if (field === 'block_negative_balance')
    settingsForm.value.block_negative_balance = !settingsForm.value.block_negative_balance

  updateSettings.mutate({ data: { [field]: settingsForm.value[field] } })
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-[#F5EDD8]">
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

    <main class="flex-1 overflow-y-auto p-4">
      <!-- Perfil card -->
      <div
        class="rounded-[20px] p-5 mb-4 flex items-center gap-3.5 relative overflow-hidden"
        style="
          background: linear-gradient(135deg, #e8500a 0%, #c03a00 100%);
          box-shadow: 0 8px 24px rgba(232, 80, 10, 0.3);
        "
      >
        <span class="absolute text-[80px] -top-2 -right-2 opacity-10">💸</span>
        <div
          class="w-13.5 h-13.5 rounded-full flex items-center justify-center text-white text-[22px] font-extrabold shrink-0 border-2 border-white/30"
          style="font-family: 'Baloo 2', cursive; background: rgba(255, 255, 255, 0.2)"
        >
          <span v-if="profileLoading" class="w-6 h-6 rounded-full bg-white/30 animate-pulse" />
          <template v-else>{{ initials }}</template>
        </div>
        <div class="flex-1 min-w-0">
          <div v-if="profileLoading" class="w-32 h-3 rounded bg-white/30 animate-pulse mb-1" />
          <div
            v-else
            class="text-sm font-bold text-white truncate"
            style="font-family: 'Baloo 2', cursive"
          >
            {{ name || '—' }}
          </div>
          <div v-if="profileLoading" class="w-44 h-2.5 rounded bg-white/30 animate-pulse mt-1" />
          <div v-else class="text-xs text-white/60 font-semibold truncate">{{ email }}</div>
        </div>
      </div>

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
        <!-- Reset mensal -->
        <div
          class="flex items-center justify-between p-3.5 border-b border-[#E5D9C3] cursor-pointer"
        >
          <div class="flex items-center gap-2.5">
            <span class="text-lg">🔄</span>
            <div>
              <div
                class="text-[13px] font-bold text-[#1A1008]"
                style="font-family: 'Baloo 2', cursive"
              >
                Reset mensal
              </div>
              <div class="text-[11px] text-[#7A6E5F]">Zera saldos todo dia 1º</div>
            </div>
          </div>
          <button
            type="button"
            class="w-10.5 h-6 rounded-xl relative cursor-pointer border-0 transition-colors disabled:opacity-50"
            :class="settingsForm.monthly_reset ? 'bg-[#1E8C45]' : 'bg-[#E5D9C3]'"
            :disabled="settingsLoading || updateSettings.isPending.value"
            @click="toggle('monthly_reset')"
          >
            <span
              class="absolute w-5 h-5 bg-white rounded-full top-0.5 shadow-sm transition-all"
              :class="settingsForm.monthly_reset ? 'right-0.5' : 'left-0.5'"
            />
          </button>
        </div>

        <!-- Alertar saldo baixo -->
        <div
          class="flex items-center justify-between p-3.5 border-b border-[#E5D9C3] cursor-pointer"
        >
          <div class="flex items-center gap-2.5">
            <span class="text-lg">⚠️</span>
            <div>
              <div
                class="text-[13px] font-bold text-[#1A1008]"
                style="font-family: 'Baloo 2', cursive"
              >
                Alertar saldo baixo
              </div>
              <div class="text-[11px] text-[#7A6E5F]">Quando atingir 20% do saldo</div>
            </div>
          </div>
          <button
            type="button"
            class="w-10.5 h-6 rounded-xl relative cursor-pointer border-0 transition-colors disabled:opacity-50"
            :class="settingsForm.alert_low_balance ? 'bg-[#1E8C45]' : 'bg-[#E5D9C3]'"
            :disabled="settingsLoading || updateSettings.isPending.value"
            @click="toggle('alert_low_balance')"
          >
            <span
              class="absolute w-5 h-5 bg-white rounded-full top-0.5 shadow-sm transition-all"
              :class="settingsForm.alert_low_balance ? 'right-0.5' : 'left-0.5'"
            />
          </button>
        </div>

        <!-- Bloquear saldo negativo -->
        <div class="flex items-center justify-between p-3.5 cursor-pointer">
          <div class="flex items-center gap-2.5">
            <span class="text-lg">🚫</span>
            <div>
              <div
                class="text-[13px] font-bold text-[#1A1008]"
                style="font-family: 'Baloo 2', cursive"
              >
                Bloquear saldo negativo
              </div>
              <div class="text-[11px] text-[#7A6E5F]">Impedir gastos acima do saldo</div>
            </div>
          </div>
          <button
            type="button"
            class="w-10.5 h-6 rounded-xl relative cursor-pointer border-0 transition-colors disabled:opacity-50"
            :class="settingsForm.block_negative_balance ? 'bg-[#1E8C45]' : 'bg-[#E5D9C3]'"
            :disabled="settingsLoading || updateSettings.isPending.value"
            @click="toggle('block_negative_balance')"
          >
            <span
              class="absolute w-5 h-5 bg-white rounded-full top-0.5 shadow-sm transition-all"
              :class="settingsForm.block_negative_balance ? 'right-0.5' : 'left-0.5'"
            />
          </button>
        </div>
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
