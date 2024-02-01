<template>
  <Accordion
    :active-index="activeIndex"
    @tab-open="$emit('change-index-active-tab', 0)"
    @tab-close="$emit('change-index-active-tab', null)"
  >
    <AccordionTab
      :header="header"
      :pt="{
        root: 'accordion-tab',
        headerAction: 'accordion-tab__header-action',
        headerIcon: 'accordion-tab__icon',
        content: 'accordion-tab__content'
      }"
    >
      <slot />
    </AccordionTab>
  </Accordion>
</template>

<script setup>
import Accordion from 'primevue/accordion'
import AccordionTab from 'primevue/accordiontab'

defineEmits(['change-index-active-tab'])

defineProps({
  activeIndex: {
    type: [Number, Array]
  },
  header: {
    type: String,
    required: true
  }
})
</script>

<style>
.accordion-tab {
  .accordion-tab__header-action {
    flex-direction: row-reverse;
    justify-content: space-between;
    padding-right: 0;
    padding-left: 0;
    color: #13284a;
    font-size: 21px;
    line-height: 1.33;
    font-weight: 600;
    border: none;
    background-color: #fff;
  }

  .accordion-tab__icon {
    margin-right: 0;
  }

  .accordion-tab__content {
    display: flex;
    flex-direction: column;
    row-gap: 20px;
    padding: 0;
    border: none;
    color: inherit;
  }
}
</style>
