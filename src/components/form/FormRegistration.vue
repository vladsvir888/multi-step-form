<!-- eslint-disable vue/no-mutating-props -->
<template>
  <component
    :is="data.fields.sameAsConnectionAddress.component"
    v-bind="data.fields.sameAsConnectionAddress.props"
    v-model="data.fields.sameAsConnectionAddress.initialValue"
    v-on="data.fields.sameAsConnectionAddress.handlers"
  />
  <div v-show="!isSameAsConnectionAddress" class="form-block form-block--2">
    <template v-for="(value, key) in data.fields" :key="key">
      <component
        v-if="isSpecialKey(key, ['sameAsConnectionAddress'])"
        :is="value.component"
        v-bind="value.props"
        v-model="value.initialValue"
        v-on="value.handlers ?? {}"
      />
    </template>
  </div>
</template>

<script setup>
import { isSpecialKey } from '@/utils/isFunction'

defineProps({
  data: {
    type: Object,
    required: true
  },
  isSameAsConnectionAddress: {
    type: Boolean
  }
})
</script>
