<template>
  <div
    class="flex flex-wrap items-center gap-x-2.5 gap-y-5 flex-col tablet:flex-row mt-5 tablet:mt-10"
  >
    <UIButton
      v-if="!isFirstStep"
      class="min-w-full tablet:min-w-[191px]"
      variant="secondary"
      :disabled="!meta.valid"
      @click="emit('go-back')"
      >Назад</UIButton
    >
    <UIButton
      class="min-w-full tablet:min-w-[191px]"
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
