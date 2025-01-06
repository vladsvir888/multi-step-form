<template>
  <button
    class="inline-flex justify-center items-center p-[15px] text-center text-sm leading-[1.35] rounded-lg cursor-pointer transition-[color, background-color] duration-300 disabled:cursor-not-allowed disabled:bg-[rgba(221,221,221,0.4)] disabled:text-[rgba(96,96,96,0.3)] disabled:border-transparent"
    :class="className"
    type="button"
  >
    <slot />
  </button>
</template>

<script setup>
import { computed } from 'vue'

const variants = {
  primary:
    'text-white border border-transparent bg-robins-egg-blue [&:hover:not(:disabled)]:bg-[#3fdeca] [&:active:not(:disabled)]:bg-persian-green',
  secondary:
    'text-[#707070] border border-solid border-alto bg-transparent [&:hover:not(:disabled)]:bg-[#f5f5f5] [&:active:not(:disabled)]:bg-alto'
}

const props = defineProps({
  variant: {
    type: String,
    validator: (value) => ['primary', 'secondary'].includes(value)
  }
})

const className = computed(() => variants[props.variant])
</script>
