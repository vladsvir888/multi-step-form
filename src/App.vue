<template>
  <div v-show="!resultData" class="container container--two-cols">
    <div class="container__wrapper">
      <h1>Заявление на подключение</h1>
      <div v-html="text" class="text-block"></div>
    </div>
    <AppFormWizard
      @change-text="text = $event"
      @get-result-data="resultData = $event"
      :is-successfull-submit="isSuccessfullSubmit"
    />
  </div>
  <div v-show="resultData" class="container">
    <AppResultTable
      :data="resultData"
      @reset-data="resultData = $event"
      @submit-data="isSuccessfullSubmit = $event"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AppFormWizard from '@/components/AppFormWizard.vue'
import AppResultTable from '@/components/AppResultTable.vue'

const text = ref('')
const resultData = ref(null)
const isSuccessfullSubmit = ref(null)
</script>

<style></style>
