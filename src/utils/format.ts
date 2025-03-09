export function formatPrice(num: number, decimalPlaces: number = 0): string {
  if (num < 1000) {
    return num.toFixed(decimalPlaces)
  }

  // 如果數字大於等於1000，使用 Intl.NumberFormat
  const formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  })

  return formatter.format(num)
}
