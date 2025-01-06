<template>
  <nav
    class="whitespace-nowrap mb-10 pb-2.5 overflow-x-auto border-0 border-b border-solid border-alto hidden-scrollbar"
  >
    <UIButton
      v-for="(tab, index) in tabs"
      :key="tab"
      class="group relative font-bold py-1.5 px-[18px] !text-base !leading-snug text-black-50 hover:text-black aria-pressed:text-black aria-pressed:cursor-default bg-transparent border-none"
      :type="meta.valid ? 'button' : 'submit'"
      :aria-pressed="currentStep === index"
      @click="emit('change-step', index)"
    >
      {{ tab }}
      <span
        class="absolute bg-transparent group-hover:bg-robins-egg-blue group-aria-pressed:bg-robins-egg-blue left-1/2 -translate-x-1/2 -bottom-2.5 w-[46px] h-[3px] transition-[background-color] duration-300"
      />
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
