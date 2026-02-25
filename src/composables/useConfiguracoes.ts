import { ref, watch } from 'vue'
import { useQueryClient } from '@tanstack/vue-query'
import {
  useUpdateSettingsApiSettingsPatch,
  getGetSettingsApiSettingsGetQueryKey,
} from '@/api/generated/settings/settings'
import {
  useGetProfileApiUsersMeGet,
  useUpdateProfileApiUsersMePatch,
  getGetProfileApiUsersMeGetQueryKey,
} from '@/api/generated/users/users'
import { useUser } from '@/composables/useUser'
import { useSettings } from '@/composables/useSettings'

export type ConfiguracoesSettingField =
  | 'alert_low_balance'
  | 'monthly_reset'
  | 'block_negative_balance'

export function useConfiguracoes() {
  const queryClient = useQueryClient()
  const { name, email, initials } = useUser()
  const {
    isLoading: settingsLoading,
    alertLowBalance,
    monthlyReset,
    blockNegativeBalance,
  } = useSettings()

  const { isLoading: profileLoading } = useGetProfileApiUsersMeGet()
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

  watch(name, (newName) => {
    formName.value = newName
  }, { immediate: true })

  function saveProfile() {
    if (!formName.value) {
      nameError.value = 'O nome não pode ser vazio.'
      return
    }
    updateProfile.mutate({ data: { name: formName.value } })
  }

  function toggle(field: ConfiguracoesSettingField) {
    if (field === 'alert_low_balance')
      settingsForm.value.alert_low_balance = !settingsForm.value.alert_low_balance
    if (field === 'monthly_reset')
      settingsForm.value.monthly_reset = !settingsForm.value.monthly_reset
    if (field === 'block_negative_balance')
      settingsForm.value.block_negative_balance =
        !settingsForm.value.block_negative_balance
    updateSettings.mutate({ data: { [field]: settingsForm.value[field] } })
  }

  return {
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
  }
}
