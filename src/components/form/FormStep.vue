<template>
  <div v-show="stepNumber === currentStep" class="step">
    <slot />
  </div>
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

<style scoped>
.step {
  display: grid;
  row-gap: 30px;
}
</style>
