<template>
  <Dialog
    :visible="isModalVisible"
    modal
    :dismissableMask="true"
    :draggable="false"
    :show-header="false"
    class="modal"
    :pt="{
      content: 'flex flex-col items-center p-6 max-w-[400px] w-full rounded-lg'
    }"
    @update:visible="$emit('modal-close')"
  >
    <div class="mb-4 font-semibold text-[21px] leading-7">{{ title }}</div>
    <UIButton class="min-w-[200px]" variant="primary" @click="$emit('modal-close')"
      >Хорошо</UIButton
    >
  </Dialog>
</template>

<script setup>
import Dialog from 'primevue/dialog'
import UIButton from '@/components/UI/UIButton.vue'

defineEmits(['modal-close'])

defineProps({
  isModalVisible: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    required: true,
    default: 'Спасибо, заявка отправлена'
  }
})
</script>
