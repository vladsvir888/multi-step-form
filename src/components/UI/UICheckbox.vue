<template>
  <div class="flex flex-col gap-y-3">
    <label class="flex items-center">
      <input
        :value="checkedValue"
        :checked="checked"
        :required="required"
        class="m-0 w-[30px] h-[30px] mr-3 flex-shrink-0 bg-white border border-solid border-alto rounded-lg appearance-none bg-no-repeat bg-center bg-[length:12px] transition-[border-color, background-color] duration-300 checked:bg-robins-egg-blue checked:border-transparent checked:bg-check hover:[&:not(:checked)]:border-morning-glory"
        type="checkbox"
        v-bind="$attrs"
        @change="onChange"
      />
      <p>
        {{ label }}
        <span v-if="required" class="inline-flex text-amaranth ml-1 font-medium" aria-hidden="true"
          >*</span
        >
      </p>
      <p v-if="labelAdd" class="opacity-70 ml-auto">
        {{ labelAdd }}
      </p>
    </label>
    <p v-if="helpText" class="opacity-70">{{ helpText }}</p>
    <p v-if="errorMessage" class="text-amaranth text-[12px]" role="status">
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
  name: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  labelAdd: {
    type: String
  },
  helpText: {
    type: String
  },
  required: {
    type: Boolean,
    default: false
  },
  checkedValue: {
    type: [String, Boolean],
    required: true
  },
  modelValue: {
    type: [Boolean, Array]
  },
  isNeedUpdateLocalStorage: {
    type: Boolean,
    default: true
  }
})

defineEmits(['update:modelValue'])

const { handleChange, checked, errorMessage } = useField(() => props.name, undefined, {
  type: 'checkbox',
  checkedValue: props.checkedValue,
  uncheckedValue: false,
  syncVModel: true
})

const onChange = () => {
  handleChange()

  if (props.isNeedUpdateLocalStorage) {
    updateDataInLocalStorage()
  }
}
</script>
