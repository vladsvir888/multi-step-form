<template>
  <div class="flex flex-col" :class="inputWrapperClassName">
    <label :for="name" class="mb-3">
      {{ label }}
      <span v-if="required" class="inline-flex text-amaranth ml-1 font-medium" aria-hidden="true"
        >*</span
      >
    </label>
    <component
      :is="tag"
      :value="value"
      :id="name"
      :type="type"
      :required="required"
      :placeholder="placeholder"
      :disabled="disabled"
      :rows="rows"
      :data-maska="mask"
      class="w-full bg-white border border-solid border-alto rounded-lg cursor-default outline-none resize-none py-[14px] px-[10px] tablet:px-5 text-[16px] leading-none placeholder:opacity-50 text-[rgba(19,40,74,0.7)] focus:border-robins-egg-blue disabled:opacity-60 hover:[&:not(:disabled):not(:focus)]:border-morning-glory hover:[&:not(:disabled):not(:focus)]:shadow-[0_0_6px_theme('colors[hokey-pokey]')]"
      v-bind="$attrs"
      @input="value = $event.target.value"
      @change="onChange"
    />
    <p v-if="errorMessage" class="text-amaranth text-[12px] mt-1" role="status">
      {{ errorMessage }}
    </p>
  </div>
</template>

<script setup>
import { useField } from 'vee-validate'
import { inject } from 'vue'

const updateDataInLocalStorage = inject('updateDataInLocalStorage')

defineOptions({
  inheritAttrs: false
})

const props = defineProps({
  tag: {
    type: [String, Object, Function],
    default: 'input'
  },
  label: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'text'
  },
  required: {
    type: Boolean,
    default: false
  },
  placeholder: {
    type: String
  },
  disabled: {
    type: Boolean,
    default: false
  },
  mask: {
    type: String
  },
  rows: {
    type: String
  },
  modelValue: {
    type: String
  },
  inputWrapperClassName: {
    type: String
  },
  isNeedUpdateLocalStorage: {
    type: Boolean,
    default: true
  }
})

defineEmits(['update:modelValue'])

const { value, errorMessage } = useField(() => props.name, undefined, {
  syncVModel: true
})

const onChange = () => {
  if (props.isNeedUpdateLocalStorage) {
    updateDataInLocalStorage()
  }
}
</script>
