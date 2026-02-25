/**
 * Returns a time-based greeting with emoji (Bom dia ☀️, Boa tarde 🌤️, Boa noite 🌙).
 */
export function getGreetingWithEmoji(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Bom dia ☀️'
  if (h < 18) return 'Boa tarde 🌤️'
  return 'Boa noite 🌙'
}
