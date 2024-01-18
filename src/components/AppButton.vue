<template>
  <button class="button" :class="className">
    <slot></slot>
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
    default: 'primary',
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
  transition-property: background-color, box-shadow;
  transition-duration: 0.3s;

  &:focus {
    outline: none;
  }

  &.button--primary {
    color: #fff;
    background-color: #00c4b3;

    &:hover {
      background-color: #3fdeca;
      box-shadow: 0px 0px 16px #3fdeca4d;
    }

    &:active {
      background-color: #00a99a;
    }

    &:focus-visible {
      background-color: #00a99a;
    }
  }

  &.button--secondary {
    color: #707070;
    background-color: transparent;
    border: 1px solid #ddd;

    &:hover {
      background-color: #f5f5f5;
      box-shadow: none;
    }

    &:active {
      background-color: #ddd;
    }

    &:focus-visible {
      background-color: #ddd;
    }
  }
}
</style>
