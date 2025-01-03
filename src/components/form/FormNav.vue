<template>
  <nav class="form-nav">
    <UIButton
      v-for="(tab, index) in tabs"
      :key="tab"
      class="form-nav__button"
      :class="{ active: currentStep === index }"
      :type="meta.valid ? 'button' : 'submit'"
      :aria-pressed="currentStep === index"
      @click="emit('change-step', index)"
    >
      {{ tab }}
    </UIButton>
  </nav>
</template>

<script setup>
import UIButton from '@/components/UI/UIButton.vue'

defineProps({
  currentStep: {
    type: Number,
    required: true
  },
  meta: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['change-step'])

const tabs = ['Личные данные', 'Заказ', 'Паспортные данные']
</script>

<style scoped>
.form-nav {
  margin-bottom: 40px;
  padding-bottom: 10px;
  white-space: nowrap;
  border-bottom: 1px solid #ddd;

  @media (width <= 600px) {
    overflow-x: auto;
  }

  &::-webkit-scrollbar {
    display: none;
  }

  .form-nav__button {
    position: relative;
    padding: 6px 18px;
    font-size: 16px;
    line-height: 1.375;
    font-weight: 700;
    color: rgba(0, 0, 0, 0.5);

    &[aria-pressed='true'] {
      color: #000;
      cursor: default;

      &::after {
        background-color: #00c4b3;
      }
    }

    &::after {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      bottom: -10px;
      width: 46px;
      height: 3px;
      background-color: transparent;
      transition: background-color 0.3s;
      content: '';
    }

    &:hover {
      color: #000;

      &::after {
        background-color: #00c4b3;
      }
    }
  }
}
</style>
