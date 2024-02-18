<template>
  <div class="select">
    <p v-if="label" class="select__text">{{ label }}</p>
    <Dropdown
      v-model="value"
      @change="updateDataInLocalStorage"
      :name="name"
      :options="options"
      :placeholder="placeholder"
      :filter="filter"
      :disabled="disabled"
      :pt="{
        input: 'select__input',
        trigger: 'select__trigger',
        panel: 'select-panel',
        item: 'select-panel__item',
        filterInput: 'select-panel__filter-input'
      }"
      class="select__header"
      empty-filter-message="Результатов не найдено"
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
  }
})

const { value } = useField(() => props.name, undefined, {
  syncVModel: true
})
</script>

<style>
.select {
  .select__text {
    margin-bottom: 12px;
  }

  .select__header {
    width: 100%;
    border-color: #ddd;
    border-radius: 10px;

    &:hover {
      border-color: #9ee2dc;

      .select__trigger {
        color: #606060;
      }
    }

    &:not(.p-disabled).p-focus {
      box-shadow: 0px 0px 6px #00c4b329;
      border-color: #00c4b3;
    }

    &.p-overlay-open {
      box-shadow: 0px 0px 6px #00c4b329;
      border-color: #00c4b3;

      .select__trigger {
        color: #606060;
      }
    }
  }

  .select__input {
    padding: 14px 20px;
    color: #13284a;

    @media (width <= 600px) {
      width: 200px;
      padding: 14px 10px;
    }
  }

  .select__trigger {
    color: #ddd;
    transition: color 0.3s;
  }
}

.select-panel {
  border: 1px solid #ddd;
  box-shadow: none;
  color: #13284a;

  @media (width <= 600px) {
    font-size: 14px;
  }

  .select-panel__item {
    @media (width <= 600px) {
      padding: 10px;
    }
  }

  .select-panel__filter-input {
    border-color: #ddd;
    border-radius: 10px;
    cursor: default;

    &:enabled:hover {
      border-color: #9ee2dc;
    }

    &:enabled:focus {
      box-shadow: 0px 0px 6px #00c4b329;
      border-color: #00c4b3;
    }
  }
}
</style>
