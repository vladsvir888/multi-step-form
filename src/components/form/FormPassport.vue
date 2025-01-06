<!-- eslint-disable vue/no-mutating-props -->
<template>
  <div class="form-block">
    <div class="form-block__inner">
      <div class="form-block__inner-label">
        {{ data.fields.resident.title }}
      </div>
      <div class="form-block__inner-grid">
        <component
          v-for="(value, key) in data.fields.resident.fields"
          :key="key"
          :is="value.component"
          v-bind="value.props"
          v-model="data.fields.resident.initialValue"
          v-on="value.handlers"
        />
      </div>
    </div>

    <div class="form-block" v-show="isResidentBelarus === false">
      <component
        :is="data.fields.citizenship.component"
        v-bind="data.fields.citizenship.props"
        v-model="data.fields.citizenship.initialValue"
      />
      <div class="form-block__inner">
        <div class="form-block__inner-label">
          {{ data.fields.temporaryRegistration.title }}
        </div>
        <div class="form-block__inner-grid">
          <component
            v-for="(value, key) in data.fields.temporaryRegistration.fields"
            :key="key"
            :is="value.component"
            v-bind="value.props"
            v-model="data.fields.temporaryRegistration.initialValue"
            v-on="value.handlers"
          />
        </div>
      </div>
    </div>

    <div class="form-block">
      <template v-for="(value, key) in data.fields" :key="key">
        <component
          v-if="isSpecialKey(key, ['resident', 'citizenship', 'temporaryRegistration'])"
          :is="value.component"
          v-bind="value.props"
          v-model="value.initialValue"
        />
      </template>
    </div>
  </div>
</template>

<script setup>
import { isSpecialKey } from '@/utils/isFunction'

defineProps({
  data: {
    type: Object,
    required: true
  },
  isResidentBelarus: {
    type: Boolean
  }
})
</script>
