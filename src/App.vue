<template>
  <div class="container">
    <div class="container__wrapper">
      <h1>Заявление на подключение</h1>
      <div v-html="text" class="text-block"></div>
    </div>
    <AppMultiStepForm @change-text="text = $event" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AppMultiStepForm from '@/components/AppMultiStepForm.vue'

const text = ref('')
</script>

<style></style>
