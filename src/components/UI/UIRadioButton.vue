<template>
  <label
    class="relative block bg-white border border-solid border-alto text-center p-4 transition-all duration-300 text-[14px] leading-5 rounded-lg hover:border-robins-egg-blue hover:shadow-[0_0_16px_#3fdeca4d] has-[:checked]:border-robins-egg-blue has-[:checked]:bg-robins-egg-blue has-[:checked]:text-white"
  >
    <input
      :value="checkedValue"
      :checked="checked"
      class="sr-only"
      type="radio"
      v-bind="$attrs"
      @change="onChange"
    />
    {{ label }}
  </label>
</template>

<script setup>
import { useField } from 'vee-validate'
import { inject } from 'vue'

const updateDataInLocalStorage = inject('updateDataInLocalStorage')

defineOptions({
  inheritAttrs: false
})

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  checkedValue: {
    type: String,
    required: true
  },
  modelValue: {
    type: String
  },
  isNeedUpdateLocalStorage: {
    type: Boolean,
    default: true
  }
})

defineEmits(['update:modelValue'])

const { handleChange, checked } = useField(() => props.name, undefined, {
  type: 'radio',
  checkedValue: props.checkedValue,
  syncVModel: true
})

const onChange = () => {
  handleChange()

  if (props.isNeedUpdateLocalStorage) {
    updateDataInLocalStorage()
  }
}
</script>
