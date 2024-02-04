<template>
  <button class="button" :class="className" type="button">
    <slot />
  </button>
</template>

<script setup>
import { computed } from 'vue'

const variants = {
  primary: 'button--primary',
  secondary: 'button--secondary'
}

const props = defineProps({
  variant: {
    type: String,
    validator: (value) => ['primary', 'secondary'].includes(value)
  }
})

const className = computed(() => variants[props.variant])
</script>

<style>
.button {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  padding: 15px;
  text-align: center;
  font-size: 14px;
  line-height: 1.35;
  background-color: transparent;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition-property: background-color, box-shadow, color;
  transition-duration: 0.3s;

  &.button--primary {
    color: #fff;
    background-color: #00c4b3;

    &:hover:not(:disabled) {
      background-color: #3fdeca;
      box-shadow: 0px 0px 16px #3fdeca4d;
    }

    &:active:not(:disabled) {
      background-color: #00a99a;
    }
  }

  &.button--secondary {
    color: #707070;
    background-color: transparent;
    border: 1px solid #ddd;

    &:hover:not(:disabled) {
      background-color: #f5f5f5;
      box-shadow: none;
    }

    &:active:not(:disabled) {
      background-color: #ddd;
    }
  }

  &:disabled {
    background-color: rgba(221, 221, 221, 0.4);
    border-color: transparent;
    color: rgba(96, 96, 96, 0.3);
    cursor: not-allowed;
  }
}
</style>
