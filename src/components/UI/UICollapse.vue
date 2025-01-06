<template>
  <Accordion>
    <AccordionTab
      :header="header"
      :pt="{
        headerAction:
          'bg-white border-none justify-between flex-row-reverse pr-0 pl-0 text-blue-zodiac font-semibold text-[21px]',
        headerIcon: 'mr-0',
        content: 'flex flex-col p-0 border-none gap-y-5 text-blue-zodiac'
      }"
    >
      <slot />
    </AccordionTab>
  </Accordion>
</template>

<script setup>
import Accordion from 'primevue/accordion'
import AccordionTab from 'primevue/accordiontab'

defineProps({
  header: {
    type: String,
    required: true
  }
})
</script>
