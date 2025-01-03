<template>
  <section class="form-block">
    <h2 class="form-block__title">
      {{ data.title }}
    </h2>
    <template v-for="(value, key) in data.fields" :key="key">
      <component
        v-if="key === 'phone'"
        :is="value.component"
        v-bind="value.props"
        v-model="value.initialValue"
        v-maska
      />
      <component v-else :is="value.component" v-bind="value.props" v-model="value.initialValue" />
    </template>
  </section>
</template>

<script setup>
import { vMaska } from 'maska'
import '@/assets/form-block.css'

defineProps({
  data: {
    type: Object,
    required: true
  }
})
</script>
