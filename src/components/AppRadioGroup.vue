<template>
  <div class="radio-group">
    <p class="radio-group__label">{{ label }}</p>
    <slot />
  </div>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    required: true
  }
})
</script>

<style>
.radio-group {
  .radio-group__label {
    margin-bottom: 12px;
  }

  .radio-group__wrapper {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 20px;
  }
}
</style>
