<template>
  <div v-show="stepNumber === currentStep" class="grid gap-[30px]">
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
