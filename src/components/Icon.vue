<script setup lang="ts">
import { defineAsyncComponent, computed, defineProps } from 'vue'

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
})

const icon = computed(() => defineAsyncComponent(() => import(`@/assets/${props.name}.svg`)))
</script>

<template>
  <component :is="icon" />
</template>
