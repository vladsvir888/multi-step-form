<template>
  <!-- Есть некоторая проблема, если я хочу сделать по умолчанию чекбокс как checked. Сейчас я checked получаю из useField()  -->
  <div class="checkbox">
    <label class="checkbox__label">
      <input
        :value="checkedValue"
        :checked="checked"
        @change="handleChange"
        class="checkbox__input"
        type="checkbox"
      />
      <p class="checkbox__label-text">{{ label }}</p>
      <p v-if="labelAdd" class="checkbox__label-text checkbox__label-text--add">{{
        labelAdd
      }}</p>
    </label>
    <p v-if="helpText" class="checkbox__text">{{ helpText }}</p>
  </div>
</template>

<script setup>
import { useField } from 'vee-validate'

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
  }
})

const { handleChange, checked } = useField(() => props.name, undefined, {
  type: 'checkbox',
  checkedValue: props.checkedValue
})
</script>

<style>
.checkbox {
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
  }

  .checkbox__label {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
  }

  .checkbox__label-text--add {
    margin-left: auto;
    opacity: 0.7;
  }

  .checkbox__text {
    grid-column: 1 / 3;
    opacity: 0.7;
  }

  .checkbox__error {
    grid-column: span 2;
    font-size: 12px;
    color: #ec2b59;
  }
}
</style>
