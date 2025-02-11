export const getFormattedValue = (value: number): string => {
  return value.toLocaleString(navigator.languages, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export const parseNumericInput = (value: string): number => {
  const newValue = Number(value)
  if (Number.isNaN(newValue)) {
    return Number.NaN
  }
  return newValue
}
