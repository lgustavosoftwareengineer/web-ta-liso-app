import { useGetProfileApiUsersMeGet } from '@/api/generated/users/users'
import { computed } from 'vue'

export function useUser() {
  const { data: profile } = useGetProfileApiUsersMeGet()

  const email = computed(() => profile.value?.email ?? '')
  const name = computed(() => profile.value?.name ?? '')

  const initials = computed(() => {
    if (!name.value) return 'EU'
    return name.value
      .split(' ')
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()
  })


  return { initials, email, name }
}
