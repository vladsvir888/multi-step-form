<template>
  <div v-show="!summaryData" class="container container--two-cols">
    <div class="container__wrapper">
      <h1>Заявление на подключение</h1>
      <div v-html="text" class="text-block"></div>
    </div>
    <AppFormWizard
      @change-text="text = $event"
      @summary-data="summaryData = $event"
      :response-data="responseData"
    />
  </div>
  <div v-show="summaryData" class="container">
    <AppResultTable
      :data="summaryData"
      @reset-data="summaryData = $event"
      @response-data="handleResponseData"
    />
  </div>
  <AppModal
    :is-modal-visible="isModalVisible"
    @modal-close="isModalVisible = false"
    :title="responseData?.title"
  ></AppModal>
</template>

<script setup>
import { ref } from 'vue'
import AppFormWizard from '@/components/AppFormWizard.vue'
import AppResultTable from '@/components/AppResultTable.vue'
import AppModal from '@/components/AppModal.vue'

const text = ref('')
const summaryData = ref(null)
const responseData = ref({})
const isModalVisible = ref(false)

const handleResponseData = (data) => {
  responseData.value = data
  isModalVisible.value = true
}
</script>
