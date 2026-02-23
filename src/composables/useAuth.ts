import { useQueryClient } from '@tanstack/vue-query'
import { useRouter } from 'vue-router'

export function useAuth() {
  const queryClient = useQueryClient()
  const router = useRouter()

  function logout() {
    localStorage.removeItem('access_token')
    queryClient.clear()
    router.push('/login')
  }

  return { logout }
}
