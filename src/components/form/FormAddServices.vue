<!-- eslint-disable vue/no-mutating-props -->
<template>
  <section class="form-block">
    <h2 class="form-block__title">
      {{ data.title }}
    </h2>
    <component
      v-for="(value, key) in data.fields"
      :key="key"
      :is="value.component"
      v-bind="value.props"
      v-model="data.initialValue"
    />
  </section>
</template>

<script setup>
defineProps({
  data: {
    type: Object,
    required: true
  }
})
</script>
