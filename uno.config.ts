import { defineConfig, presetAttributify, presetUno } from 'unocss'

// TODO: 有更好的做法嗎？
const integerPercentages = Array.from({ length: 100 }, (_, i) => `w-${i + 1}%`)

// TODO: 有更好的做法嗎？
const decimalPercentages = []
for (let i = 1; i <= 100; i += 0.1) {
  // 限制小數點位數，避免浮點數精度問題
  const percentage = Number(i.toFixed(1))
  if (percentage <= 100) {
    decimalPercentages.push(`w-${percentage}%`)
  }
}

export default defineConfig({
  presets: [
    presetAttributify({
      prefix: 'un-',
      prefixedOnly: true,
    }),
    presetUno(),
    // ...custom presets
  ],
  theme: {
    colors: {
      default: '#131B29',
      hover: '#1E3059',
      quoteBar: {
        default: 'rgba(134, 152, 170, 0.12)',
        buy: 'rgba(16, 186, 104, 0.12)',
        sell: 'rgba(255, 90, 90, 0.12)',
      },
      flash: {
        green: 'rgba(0, 177, 93, 0.5)',
        red: 'rgba(255, 91, 90, 0.5)',
      },
      text: {
        default: '#F0F4F8',
        tableHead: '#8698AA',
        buyQuote: '#00B15D',
        sellQuote: '#FF5B5A',
      },
    },
  },
  shortcuts: {
    row: 'grid grid-cols-[30%_25%_45%] p-x-16px p-y-2px text-18px',
  },
  safelist: [
    ...integerPercentages, // 整數：w-1%, w-2%, ..., w-100%
    ...decimalPercentages, // 小數點：w-1.0%, w-1.1%, ..., w-100.0%
  ],
})
