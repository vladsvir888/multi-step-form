<template>
  <div class="form-buttons">
    <UIButton
      v-if="!isFirstStep"
      class="form-buttons__button"
      variant="secondary"
      :disabled="!meta.valid"
      @click="emit('go-back')"
      >Назад</UIButton
    >
    <UIButton
      class="form-buttons__button"
      type="submit"
      :disabled="!meta.valid"
      variant="primary"
      >{{ isLastStep ? 'Готово' : 'Отправить' }}</UIButton
    >
  </div>
</template>

<script setup>
import UIButton from '@/components/UI/UIButton.vue'

defineProps({
  meta: {
    type: Object,
    required: true
  },
  isFirstStep: {
    type: Boolean,
    required: true
  },
  isLastStep: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['go-back'])
</script>

<style scoped>
.form-buttons {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px 20px;
  margin-top: 40px;

  @media (width <= 600px) {
    flex-direction: column;
    width: 100%;
    margin-top: 20px;

    > * {
      width: 100%;
    }
  }

  .form-buttons__button {
    min-width: 191px;

    @media (width <= 600px) {
      min-width: 150px;
    }
  }
}
</style>
