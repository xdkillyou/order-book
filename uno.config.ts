import { defineConfig, presetAttributify, presetUno } from 'unocss'

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
    row: 'grid grid-cols-[30%_30%_40%] p-x-16px p-y-2px text-18px',
  },
})
