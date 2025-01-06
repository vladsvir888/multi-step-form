<template>
  <div class="select">
    <p v-if="label" class="mb-3">{{ label }}</p>
    <Dropdown
      v-model="value"
      :name="name"
      :options="options"
      :placeholder="placeholder"
      :filter="filter"
      :disabled="disabled"
      :pt="{
        input: 'text-blue-zodiac py-3.5 px-2.5 tablet:px-5',
        trigger: 'text-alto group-hover:text-scorpion transition-[color] duration-300',
        panel: 'mt-1.5 border border-solid border-alto shadow-none text-blue-zodiac',
        filterInput:
          'border border-solid border-alto cursor-default rounded-lg enabled:hover:border-morning-glory enabled:focus:border-robins-egg-blue'
      }"
      class="group w-full border border-solid border-alto hover:border-morning-glory rounded-lg [&.p-overlay-open]:border-robins-egg-blue [&:not(.p-disabled).p-focus]:border-robins-egg-blue"
      empty-filter-message="Результатов не найдено"
      @change="onChange"
    />
  </div>
</template>

<script setup>
import Dropdown from 'primevue/dropdown'
import { useField } from 'vee-validate'
import { inject } from 'vue'

const updateDataInLocalStorage = inject('updateDataInLocalStorage')

const props = defineProps({
  label: {
    type: String
  },
  name: {
    type: String,
    required: true
  },
  modelValue: {
    type: String
  },
  options: {
    type: Array,
    required: true
  },
  placeholder: {
    type: String
  },
  filter: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  isNeedUpdateLocalStorage: {
    type: Boolean,
    default: true
  }
})

const { value } = useField(() => props.name, undefined, {
  syncVModel: true
})

const onChange = () => {
  if (props.isNeedUpdateLocalStorage) {
    updateDataInLocalStorage()
  }
}
</script>
