const MONTH_NAMES = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
]

/**
 * Returns the current date formatted for display (e.g. "23 de Fevereiro de 2025").
 */
export function formatCurrentDate(): string {
  const now = new Date()
  const day = now.getDate()
  const month = MONTH_NAMES[now.getMonth()]
  const year = now.getFullYear()
  return `${day} de ${month} de ${year}`
}

export function useFormattedDate() {
  return { formatCurrentDate }
}
