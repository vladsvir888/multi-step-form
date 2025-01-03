<template>
  <div class="input" :class="inputWrapperClassName">
    <label :for="name" class="input__label">
      {{ label }}
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
      class="input__field"
      v-bind="$attrs"
      @input="value = $event.target.value"
      @change="onChange"
    />
    <p v-if="errorMessage" class="input__error" role="status">
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

<style scoped>
.input {
  display: flex;
  flex-direction: column;

  .input__label {
    margin-bottom: 12px;

    &:has(~ .input__field[required]) {
      &::after {
        display: inline-flex;
        margin-left: 5px;
        color: #ec2b59;
        font-weight: 500;
        content: '*';
      }
    }
  }

  .input__field {
    width: 100%;
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 10px;
    padding: 14px 20px;
    color: rgba(19, 40, 74, 0.7);
    font: inherit;
    font-size: 16px;
    line-height: 1;
    cursor: default;
    outline: none;
    resize: none;

    @media (width <= 600px) {
      padding: 14px 10px;
    }

    &::placeholder {
      opacity: 0.5;
    }

    &:hover {
      &:not(:disabled) {
        border-color: #9ee2dc;
      }
    }

    &:focus {
      box-shadow: 0px 0px 6px #00c4b329;
      border-color: #00c4b3;
    }

    &:disabled {
      opacity: 0.6;
    }
  }

  .input__error {
    margin-top: 5px;
    font-size: 12px;
    color: #ec2b59;
  }
}
</style>
