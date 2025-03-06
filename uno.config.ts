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
      bg: {
        default: '#131B29',
        hover: '#1E3059',
        buyQuoteBar: 'rgba(16, 186, 104, 0.12)',
        sellQuoteBar: 'rgba(255, 90, 90, 0.12)',
        flashGreen: 'rgba(0, 177, 93, 0.5)',
        flashRed: 'rgba(255, 91, 90, 0.5)',
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
    row: 'grid grid-cols-[25%_25%_50%]',
  },
})
