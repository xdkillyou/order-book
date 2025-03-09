<script lang="ts" setup>
import { formatPrice } from '@/utils/format'
import { PriceStatus, type IPriceWsResponse } from '@/types/price'

enum WsStatus {
  'Idle',
  'Connected',
  'Close',
  'Error',
}

const wsInstance = ref<WebSocket | null>(null)
const wsStatus = ref<WsStatus>(WsStatus.Idle)

const priceStatus = ref<PriceStatus>(PriceStatus.Flat)
const priceStatusStyle = computed(() => {
  if (priceStatus.value === PriceStatus.Rising) {
    return 'bg-quoteBar-buy color-text-buyQuote'
  }
  if (priceStatus.value === PriceStatus.Falling) {
    return 'bg-quoteBar-sell color-text-sellQuote'
  }
  return 'bg-quoteBar-default color-text-default'
})

const price = ref<null | number>(null)
const formattedPrice = computed(() => price.value && formatPrice(price.value, 1))

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
        args: ['tradeHistoryApi:BTCPFC'],
      }),
    )
  }
}
function handlerReceive(event: MessageEvent) {
  // console.log(event)
  const data: IPriceWsResponse = JSON.parse(event.data)
  if (data.topic === 'tradeHistoryApi') {
    console.log('price', data.data[0].price)
    if (price.value) {
      if (data.data[0].price > price.value) {
        priceStatus.value = PriceStatus.Rising
        price.value = data.data[0].price
        return
      }
      if (data.data[0].price < price.value) {
        priceStatus.value = PriceStatus.Falling
        price.value = data.data[0].price
        return
      }
      if (data.data[0].price === price.value) {
        priceStatus.value = PriceStatus.Flat
        return
      }
    } else {
      price.value = data.data[0].price
    }
  }
}

function initWebSocket() {
  // Use the first price in the array as the last price.
  wsInstance.value = new WebSocket('wss://ws.btse.com/ws/futures')

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
        args: ['tradeHistoryApi:BTCPFC'],
      }),
    )
  }
})
</script>

<template>
  <div
    un-flex="~ gap-4px items-center justify-center"
    un-p="y-4px"
    un-m="y-4px"
    :class="priceStatusStyle"
  >
    <div un-text="24px" un-line-clamp="24px" un-font-bold>
      <div un-relative>
        <p>{{ formattedPrice }}</p>
        <!-- TODO: refactor -->
        <Icon
          v-show="priceStatus !== PriceStatus.Flat"
          name="arrowDown"
          un-absolute
          un-right="-28px"
          un-top="6px"
          :class="priceStatus === PriceStatus.Rising ? 'rotate-180' : ''"
        />
      </div>
    </div>
  </div>
</template>
