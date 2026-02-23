import type { AxiosError } from 'axios'

export function useApiError() {
  function getErrorMessage(error: unknown): string {
    const axiosError = error as AxiosError<{ detail: string }>
    return axiosError.response?.data?.detail ?? 'Erro inesperado. Tente novamente.'
  }
  return { getErrorMessage }
}
