export function weightKgError(kg: number | ''): string | undefined {
  if (kg === '' || kg < 20 || kg > 400 || !/^\d+(\.\d)?$/.test(String(kg))) {
    return 'Between 20 and 400 kg, one decimal.'
  }
}

export function measuredAtError(value: string, required: boolean): string | undefined {
  if (!value) return required ? 'Enter a time.' : undefined
  if (new Date(value) > new Date()) return "Can't be in the future."
}
