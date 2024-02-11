<template>
  <div class="checkbox">
    <label class="checkbox__label">
      <input
        :value="checkedValue"
        :checked="checked"
        @change="handleChange"
        :required="required"
        class="checkbox__input"
        type="checkbox"
        v-bind="$attrs"
      />
      <p class="checkbox__label-text">{{ label }}</p>
      <p v-if="labelAdd" class="checkbox__label-text checkbox__label-text--add">{{ labelAdd }}</p>
    </label>
    <p v-if="helpText" class="checkbox__text">{{ helpText }}</p>
    <p v-show="errorMessage" class="checkbox__error" role="status">{{ errorMessage }}</p>
  </div>
</template>

<script setup>
import { useField } from 'vee-validate'

defineOptions({
  inheritAttrs: false
})

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  checkedValue: {
    type: [String, Boolean],
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
  modelValue: {
    type: [Boolean, Array]
  }
})

const { handleChange, checked, errorMessage } = useField(() => props.name, undefined, {
  type: 'checkbox',
  checkedValue: props.checkedValue,
  uncheckedValue: false,
  syncVModel: true
})
</script>

<style>
.checkbox {
  display: flex;
  flex-direction: column;
  row-gap: 12px;

  .checkbox__input {
    margin: 0;
    width: 30px;
    height: 30px;
    margin-right: 12px;
    flex-shrink: 0;
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 8px;
    appearance: none;
    background-repeat: no-repeat;
    background-position: center center;
    background-size: 12px;
    transition-property: border-color, background-color;
    transition-duration: 0.3s;

    &:checked {
      border-color: transparent;
      background-color: #00c4b3;
      background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0NDggNTEyIj4KICAgIDxwYXRoIGQ9Ik00MzguNiAxMDUuNGMxMi41IDEyLjUgMTIuNSAzMi44IDAgNDUuM2wtMjU2IDI1NmMtMTIuNSAxMi41LTMyLjggMTIuNS00NS4zIDBsLTEyOC0xMjhjLTEyLjUtMTIuNS0xMi41LTMyLjggMC00NS4zczMyLjgtMTIuNSA0NS4zIDBMMTYwIDMzOC43IDM5My40IDEwNS40YzEyLjUtMTIuNSAzMi44LTEyLjUgNDUuMyAweiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+');
    }

    &:not(:checked):has(~ .checkbox__label:hover) {
      border-color: #9ee2dc;
    }

    &:hover:not(:checked) {
      border-color: #9ee2dc;
    }

    &[required] ~ .checkbox__label-text {
      &::after {
        display: inline-flex;
        margin-left: 5px;
        color: #ec2b59;
        font-weight: 500;
        content: '*';
      }
    }
  }

  .checkbox__label {
    display: flex;
    align-items: center;
  }

  .checkbox__label-text--add {
    margin-left: auto;
    opacity: 0.7;
  }

  .checkbox__text {
    opacity: 0.7;
  }

  .checkbox__error {
    font-size: 12px;
    color: #ec2b59;
  }
}
</style>
