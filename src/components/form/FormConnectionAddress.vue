<template>
  <div class="form-block form-block--2">
    <component
      v-for="(value, key) in data.fields"
      :key="key"
      :is="value.component"
      v-bind="value.props"
      v-model="value.initialValue"
      v-on="value.handlers ?? {}"
    />
  </div>
</template>

<script setup>
defineProps({
  data: {
    type: Object,
    required: true
  }
})
</script>
