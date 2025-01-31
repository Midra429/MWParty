export const pingSignal = (ping: number | null) => {
  if (!ping) return null
  if (600 <= ping) return 'low'
  if (300 <= ping) return 'middle'
  return 'high'
}
