<template>
  <Dialog
    :visible="isModalVisible"
    @update:visible="$emit('modal-close')"
    modal
    :dismissableMask="true"
    :draggable="false"
    :show-header="false"
    class="modal"
    :pt="{
      content: 'modal__content'
    }"
  >
    <div class="modal__title">{{ title }}</div>
    <AppButton class="modal__close" variant="primary" @click="$emit('modal-close')"
      >Хорошо</AppButton
    >
  </Dialog>
</template>

<script setup>
import Dialog from 'primevue/dialog'
import AppButton from '@/components/AppButton.vue'

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

<style>
.modal {
  .modal__content {
    max-width: 400px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 25px;
    border-radius: 10px;
  }

  .modal__title {
    font-size: 21px;
    line-height: 28px;
    font-weight: 600;
    margin-bottom: 16px;
  }

  .modal__text {
    font-size: 14px;
    line-height: 19px;
    margin-bottom: 40px;
  }

  .modal__close {
    min-width: 200px;
  }
}
</style>
