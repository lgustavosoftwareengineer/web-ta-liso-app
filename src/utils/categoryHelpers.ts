import type { CategoryResponse } from '@/api/generated/táLisoAPI.schemas'

export function categoryPercentage(category: CategoryResponse): number {
  const initial = parseFloat(category.initial_amount)
  const balance = parseFloat(category.current_balance)
  if (!initial) return 0
  return Math.min(100, Math.round(((initial - balance) / initial) * 100))
}

export function barColor(p: number): string {
  if (p >= 90) return '#C0252A'
  if (p >= 70) return '#F5C518'
  return '#1E8C45'
}

export function categorySpent(category: CategoryResponse): number {
  return parseFloat(category.initial_amount) - parseFloat(category.current_balance)
}

export function balanceColor(spentPercentage: number): string {
  if (spentPercentage >= 90) return 'text-[#C0252A]'
  if (spentPercentage >= 70) return 'text-[#9A7000]'
  return 'text-[#1E8C45]'
}

export function formatBRL(value: string | number): string {
  return parseFloat(String(value)).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}
