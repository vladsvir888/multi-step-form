<template>
  <div v-show="!summaryData" class="container grid grid-cols-1 laptop:grid-cols-2 gap-5">
    <div class="laptop:sticky laptop:top-5 laptop:self-start">
      <h1>Заявление на подключение</h1>
      <div v-html="text" class="max-w-[380px] [&>:not(:last-child)]:mb-5"></div>
    </div>
    <FormWizard
      :response-data="responseData"
      @change-text="text = $event"
      @summary-data="summaryData = $event"
    />
  </div>
  <div v-show="summaryData" class="container">
    <ResultTable
      :data="summaryData"
      @reset-data="summaryData = $event"
      @response-data="handleResponseData"
    />
  </div>
  <UIModal
    :is-modal-visible="isModalVisible"
    :title="responseData?.title"
    @modal-close="isModalVisible = false"
  ></UIModal>
  <CallbackLink />
</template>

<script setup>
import { ref } from 'vue'
import FormWizard from '@/components/form/FormWizard.vue'
import ResultTable from '@/components/ResultTable.vue'
import UIModal from '@/components/UI/UIModal.vue'
import CallbackLink from '@/components/CallbackLink.vue'

const text = ref('')
const summaryData = ref(null)
const responseData = ref({ title: '', success: undefined })
const isModalVisible = ref(false)

const handleResponseData = (data) => {
  responseData.value = data
  isModalVisible.value = true
}
</script>
