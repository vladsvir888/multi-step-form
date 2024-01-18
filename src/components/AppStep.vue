<template>
  <slot v-if="stepNumber === currentStep" />
</template>

<script setup>
defineProps({
  stepNumber: {
    type: Number,
    required: true
  },
  currentStep: {
    type: Number,
    required: true
  }
})
</script>

<style></style>
