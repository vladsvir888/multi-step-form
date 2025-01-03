<!-- eslint-disable vue/no-mutating-props -->
<template>
  <section class="form-block">
    <h2 class="form-block__title">
      {{ data.title }}
    </h2>
    <component :is="data.component" v-bind="data.props" v-model="data.initialValue" />
  </section>
</template>

<script setup>
import '@/assets/form-block.css'

defineProps({
  data: {
    type: Object,
    required: true
  }
})
</script>
