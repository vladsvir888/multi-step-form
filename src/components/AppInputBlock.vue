<template>
  <div class="input-block">
    <label :for="name" class="input-block__label">
      {{ label }}
    </label>
    <component
      :is="tag"
      :value="value"
      @input="value = $event.target.value"
      :name="name"
      :id="name"
      :type="type"
      :required="required"
      :placeholder="placeholder"
      :rows="rows"
      class="input-block__input"
      v-bind="$attrs"
    />
    <p v-show="errorMessage" class="input-block__error">
      {{ errorMessage }}
    </p>
  </div>
</template>

<script setup>
import { useField } from 'vee-validate'

defineOptions({
  inheritAttrs: false
})

const props = defineProps({
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
  tag: {
    type: [String, Object, Function],
    default: 'input'
  },
  rows: {
    type: String
  }
})

const { value, errorMessage } = useField(() => props.name)
</script>

<style>
.input-block {
  display: flex;
  flex-direction: column;

  .input-block__label {
    margin-bottom: 12px;

    &:has(~ .input-block__input[required]) {
      &::after {
        display: inline-flex;
        margin-left: 5px;
        color: #ec2b59;
        content: '*';
      }
    }
  }

  .input-block__input {
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
      border-color: #9ee2dc;
    }

    &:focus {
      box-shadow: 0px 0px 6px #00c4b329;
      border-color: #00c4b3;
    }
  }

  .input-block__error {
    margin-top: 5px;
    font-size: 12px;
    color: #ec2b59;
  }
}
</style>
