export function formatPrice(num: number | string, decimalPlaces: number = 0): string {
  if (Number(num) < 1000) {
    return Number(num).toFixed(decimalPlaces)
  }

  // 如果數字大於等於1000，使用 Intl.NumberFormat
  const formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  })

  return formatter.format(Number(num))
}
