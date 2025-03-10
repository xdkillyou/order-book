<script setup lang="ts">
// TODO: need web worker(高頻資料影響main thread render)
// TODO: 拆分use-websocket、order book row
// TODO: 該如何優化Map，使其自動排序
// TODO: 如何確定訂閱、取消訂閱確實執行
// TODO: 型別優化
import { formatPrice } from '@/utils/format'
import type { IOrderBookWsResponse } from '@/types/orderBook'

enum WsStatus {
  'Idle',
  'Connected',
  'Close',
  'Error',
}

function transformArray(arr) {
  const result = [arr[0]] // 第一個元素不變
  for (let i = 1; i < arr.length; i++) {
    result[i] = arr[i] * 1 + result[i - 1] * 1 // 當前元素加上前一個結果
  }
  return result
}

const wsInstance = ref<WebSocket | null>(null)
const wsStatus = ref<WsStatus>(WsStatus.Idle)
const latestSeqNum = ref<number | null>(null)

const asksMap = ref<Map<string, string> | null>(null)
const asksOldMap = ref<Map<string, string> | null>(null)
const asksOldPrices = ref<string[] | null>(null)
const asksRows = computed(() =>
  asksMap.value ? [...asksMap.value.entries()].sort((a, b) => b[0] - a[0]).slice(-8) : [],
)
const asksTotal = computed(() =>
  transformArray(asksRows.value.map(([_, amount]) => amount).toReversed()).reverse(),
)
const asksSizeSum = computed(() =>
  asksMap.value
    ? [...asksMap.value?.values()].reduce((acc, curr) => Number(acc) + Number(curr), 0)
    : 0,
)

const bidsMap = ref<Map<string, string> | null>(null)
const bidsOldMap = ref<Map<string, string> | null>(null)
const bidsOldPrices = ref<string[] | null>(null)
const bidsRows = computed(() =>
  bidsMap.value ? [...bidsMap.value.entries()].sort((a, b) => b[0] - a[0]).slice(0, 8) : [],
)
const bidsTotal = computed(() => transformArray(bidsRows.value.map(([_, amount]) => amount)))
const bidsSizeSum = computed(() =>
  bidsMap.value
    ? [...bidsMap.value?.values()].reduce((acc, curr) => Number(acc) + Number(curr), 0)
    : 0,
)

function handlerError(error: Event) {
  wsStatus.value = WsStatus.Error
  console.error('WebSocket 錯誤:', error)
}
function handlerClose() {
  wsStatus.value = WsStatus.Close
  console.log('WebSocket 連接關閉')
}
function handlerOpen() {
  if (wsInstance.value) {
    console.log('WebSocket 連接成功')
    wsStatus.value = WsStatus.Connected

    wsInstance.value.send(
      JSON.stringify({
        op: 'subscribe',
        args: ['update:BTCPFC_0'],
      }),
    )
  }
}

function handlerReceive(event: MessageEvent) {
  const response: IOrderBookWsResponse = JSON.parse(event.data)
  const { type, prevSeqNum, seqNum, asks, bids } = response.data
  // console.info(type, prevSeqNum, seqNum, asks, bids)

  if (type === 'snapshot') {
    asksMap.value = new Map(asks)
    bidsMap.value = new Map(bids)
  } else {
    asksOldMap.value = new Map(asksMap.value)
    bidsOldMap.value = new Map(bidsMap.value)
    asksOldPrices.value = asksRows.value.map(([price, _]) => price)
    for (let i = 0; i < asks.length; i += 1) {
      const [price, amount] = asks[i]
      if (amount === '0') {
        asksMap.value?.delete(price)
      } else {
        asksMap.value?.set(price, amount)
      }
    }

    bidsOldPrices.value = bidsRows.value.map(([price, _]) => price)
    for (let i = 0; i < bids.length; i += 1) {
      const [price, amount] = bids[i]
      if (amount === '0') {
        bidsMap.value?.delete(price)
      } else {
        bidsMap.value?.set(price, amount)
      }
    }
  }
  if (latestSeqNum.value && latestSeqNum.value !== prevSeqNum) {
    console.error('需要跑重新訂閱的流程')
    latestSeqNum.value = null

    wsInstance.value!.send(
      JSON.stringify({
        op: 'unsubscribe',
        args: ['update:BTCPFC_0'],
      }),
    )
    wsInstance.value!.send(
      JSON.stringify({
        op: 'subscribe',
        args: ['update:BTCPFC_0'],
      }),
    )
    return
  }
  latestSeqNum.value = seqNum
}

function initWebSocket() {
  // Use the first price in the array as the last price.
  wsInstance.value = new WebSocket('wss://ws.btse.com/ws/oss/futures')

  wsInstance.value.onopen = () => handlerOpen()
  wsInstance.value.onmessage = (event) => handlerReceive(event)
  wsInstance.value.onerror = (error) => handlerError(error)
  wsInstance.value.onclose = () => handlerClose()
}

onMounted(() => {
  initWebSocket()
})

onBeforeUnmount(() => {
  if (wsInstance.value) {
    wsInstance.value.send(
      JSON.stringify({
        op: 'unsubscribe',
        args: ['update:BTCPFC_0'],
      }),
    )
  }
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
      <div
        v-for="([price, amount], index) in asksRows"
        :key="price"
        un-row
        un-bg="hover:hover"
        class="fade-out"
        :class="asksOldPrices?.includes(price) ? '' : 'bg-flash-red'"
      >
        <div un-text="text-sellQuote">{{ formatPrice(price, 1) }}</div>
        <div
          un-text="right"
          un-m="r-8px"
          :class="
            asksOldMap?.get(price)
              ? Number(asksOldMap.get(price))! > Number(amount)
                ? 'bg-flash-green'
                : 'bg-flash-red'
              : ''
          "
          class="fade-out"
        >
          {{ formatPrice(amount) }}
        </div>
        <div un-text="right" un-relative>
          <p un-relative un-z="2">
            {{ formatPrice(asksTotal[index]) }}
          </p>
          <div
            un-bg="quoteBar-sell"
            un-absolute
            un-top="0"
            un-bottom="0"
            un-right="0"
            un-z="1"
            :class="`w-${((asksTotal[index] / asksSizeSum) * 100).toFixed(1)}%`"
          ></div>
        </div>
      </div>

      <!-- price -->
      <Price />

      <!-- buy area -->
      <div
        v-for="([price, amount], index) in bidsRows"
        :key="price"
        un-row
        un-bg="hover:hover"
        class="fade-out"
        :class="bidsOldPrices?.includes(price) ? '' : 'bg-flash-green'"
      >
        <div un-text="text-buyQuote">{{ formatPrice(price, 1) }}</div>
        <div
          un-text="right"
          un-m="r-6px"
          un-p="x-2px"
          :class="
            bidsOldMap?.get(price)
              ? Number(bidsOldMap.get(price))! > Number(amount)
                ? 'bg-flash-green'
                : 'bg-flash-red'
              : ''
          "
          class="fade-out"
        >
          {{ formatPrice(amount) }}
        </div>
        <!-- TODO: 會按照比例變動的bg -->
        <div un-text="right" un-relative>
          <p un-relative un-z="2">
            {{ formatPrice(bidsTotal[index]) }}
          </p>
          <div
            un-bg="quoteBar-buy"
            un-absolute
            un-top="0"
            un-bottom="0"
            un-right="0"
            un-z="1"
            :class="`w-${((bidsTotal[index] / bidsSizeSum) * 100).toFixed(1)}%`"
          ></div>
        </div>
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

.fade-out {
  animation: fadeOut 0.5s forwards;
}
@keyframes fadeOut {
  to {
    background: transparent;
  }
}
</style>
