<template>
  <div class="radio-button">
    <label class="radio-button__label">
      <input
        :value="checkedValue"
        :checked="checked"
        @change="handleChange"
        class="radio-button__input"
        type="radio"
        v-bind="$attrs"
      />
      {{ label }}
    </label>
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
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  modelValue: {
    type: String
  }
})

const { handleChange, checked } = useField(() => props.name, undefined, {
  type: 'radio',
  checkedValue: props.checkedValue,
  syncVModel: true
})
</script>

<style>
.radio-button {
  .radio-button__label {
    position: relative;
    display: block;
    background-color: #fff;
    border: 1px solid #dddddd;
    border-radius: 10px;
    padding: 15px;
    text-align: center;
    font-size: 14px;
    line-height: 19px;
    transition-property: border-color, box-shadow, color, background-color;
    transition-duration: 0.3s;

    &:hover {
      border-color: #00c4b3;
      box-shadow: 0px 0px 16px #3fdeca4d;
    }

    &:has(.radio-button__input:checked) {
      border-color: #00c4b3;
      background-color: #00c4b3;
      color: #fff;
    }

    &:has(.radio-button__input:focus) {
      border-color: #00c4b3;
      background-color: #00c4b3;
      color: #fff;
    }
  }

  .radio-button__input {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: -1px;
    padding: 0;
    overflow: hidden;
    border: 0;
    clip: rect(0 0 0 0);
  }
}
</style>
