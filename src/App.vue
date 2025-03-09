<script setup lang="ts">
import { formatPrice } from '@/utils/format'

// const socket = ref(null)

// function initWebSocket() {
//   // 1秒約30筆資料進來
//   // socket.value = new WebSocket('wss://ws.btse.com/ws/oss/futures')

//   socket.value.onopen = () => {
//     console.log('WebSocket 連接成功')
//     // socket.value.send(
//     //   JSON.stringify({
//     //     op: 'subscribe',
//     //     args: ['update:BTCPFC_0'],
//     //   }),
//     // )\
//   }

//   socket.value.onmessage = (event) => {
//     const data = JSON.parse(event.data)
//     if (data.topic === 'tradeHistoryApi') {
//       console.log('event', JSON.parse(event.data))
//       price.value = data.data[0].price
//     }
//   }

//   socket.value.onerror = (error) => {
//     console.error('WebSocket 錯誤:', error)
//   }

//   socket.value.onclose = () => {
//     console.log('WebSocket 連接關閉')
//   }
// }

onMounted(() => {
  // initWebSocket()
})

onBeforeUnmount(() => {
  // socket.value.send(
  //   JSON.stringify({
  //     op: 'unsubscribe',
  //     args: ['update:BTCPFC_0'],
  //   }),
  // )
})
</script>

<template>
  <div>
    <!-- playgroud -->
    <div un-flex="~ gap-x-10px wrap" un-bg="default" un-p="y-10px">
      <div un-w="25px" un-h="25px" un-bg="hover"></div>
      <div un-w="25px" un-h="25px" un-bg="quoteBar-default"></div>
      <div un-w="25px" un-h="25px" un-bg="quoteBar-buy"></div>
      <div un-w="25px" un-h="25px" un-bg="quoteBar-sell"></div>
      <div un-w="25px" un-h="25px" un-bg="flash-green"></div>
      <div un-w="25px" un-h="25px" un-bg="flash-red"></div>
    </div>
    <div un-flex="~ col gap-x-10px wrap" un-bg="default" un-m="b-20px" un-p="y-10px">
      <div un-color="text-default">Lorem ipsum dolor sit amet</div>
      <div un-color="text-tableHead">Lorem ipsum dolor sit amet</div>
      <div un-color="text-buyQuote">Lorem ipsum dolor sit amet</div>
      <div un-color="text-sellQuote">Lorem ipsum dolor sit amet</div>
    </div>

    <div
      un-flex="~ col"
      un-bg="default"
      un-color="text-default"
      un-w="360px"
      un-p="y-8px"
      un-m="auto"
    >
      <h1 un-p="x-16px y-10px" un-text="20px" un-border-b="1px solid text-tableHead/10">
        Order Book
      </h1>
      <div un-row un-text="text-tableHead 16px" un-m="y-4px">
        <div>Price (USD)</div>
        <div un-text="right">Size</div>
        <div un-text="right">Total</div>
      </div>

      <!-- sell area -->
      <div v-for="index in 8" :key="index" un-row un-bg="hover:hover">
        <div un-text="text-sellQuote">{{ formatPrice(21613.5, 1) }}</div>
        <div un-text="right" un-m="r-8px">{{ formatPrice(1983834) }}</div>
        <div un-text="right">{{ formatPrice(4901) }}</div>
      </div>

      <!-- price -->
      <Price />

      <!-- buy area -->
      <div v-for="index in 8" :key="index" un-row un-bg=" hover:hover">
        <div un-text="text-buyQuote">{{ formatPrice(21330, 1) }}</div>
        <div un-text="right" un-m="r-6px" un-p="x-2px" un-bg="flash-green">
          {{ formatPrice(3691) }}
        </div>
        <!-- TODO: 會按照比例變動的bg -->
        <div un-text="right" un-bg="quoteBar-buy">{{ formatPrice(53) }}</div>
      </div>
    </div>
  </div>
</template>

<style>
html,
body {
  font-family: Helvetica, Arial;
  letter-spacing: 0.4px;
}
</style>
