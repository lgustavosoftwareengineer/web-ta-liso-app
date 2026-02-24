import { MONTH_NAMES } from '@/constants'

export function formatCurrentDate(): string {
  const now = new Date()
  const day = now.getDate()
  const month = MONTH_NAMES[now.getMonth()]
  const year = now.getFullYear()
  return `${day} de ${month} de ${year}`
}
