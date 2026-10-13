export function formatKg(kg: number) {
  return `${kg.toFixed(1)} kg`
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { dateStyle: 'medium' })
}

export function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })
}
