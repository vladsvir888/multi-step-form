<template>
  <form v-if="data" @submit="onSubmit" class="form" novalidate>
    <nav class="form__nav">
      <AppButton
        v-for="(tab, index) in data.tabs"
        :key="tab.text"
        @click="onClickNavButton(index)"
        class="form__nav-button"
        :class="{ active: currentStep === index }"
        :type="meta.valid ? 'button' : 'submit'"
        :aria-pressed="currentStep === index"
      >
        {{ tab.text }}
      </AppButton>
    </nav>

    <div class="form__fields">
      <AppStep :step-number="0" :current-step="currentStep">
        <fieldset class="form__fieldset">
          <legend class="form__legend">{{ data.steps.step1.personalData.title }}</legend>

          <AppInputBlock
            :label="data.steps.step1.personalData.fields.surname.label"
            :name="data.steps.step1.personalData.fields.surname.name"
            required
          />

          <AppInputBlock
            :label="data.steps.step1.personalData.fields.name.label"
            :name="data.steps.step1.personalData.fields.name.name"
            required
          />

          <AppInputBlock
            :label="data.steps.step1.personalData.fields.patronymic.label"
            :name="data.steps.step1.personalData.fields.patronymic.name"
            required
          />

          <AppInputBlock
            v-maska
            :data-maska="data.steps.step1.personalData.fields.phone.mask"
            :placeholder="data.steps.step1.personalData.fields.phone.placeholder"
            :label="data.steps.step1.personalData.fields.phone.label"
            :name="data.steps.step1.personalData.fields.phone.name"
            type="tel"
            required
          />

          <AppInputBlock
            :label="data.steps.step1.personalData.fields.email.label"
            :name="data.steps.step1.personalData.fields.email.name"
            :placeholder="data.steps.step1.personalData.fields.email.placeholder"
            type="email"
            required
          />
        </fieldset>
      </AppStep>

      <AppStep :step-number="1" :current-step="currentStep">
        <fieldset class="form__fieldset">
          <legend class="form__legend">{{ data.steps.step2.tariffPlan.title }}</legend>

          <AppSelect
            v-model="selectedTariffPlan"
            :options="data.steps.step2.tariffPlan.fields.tariffPlan.options"
            :label="data.steps.step2.tariffPlan.fields.tariffPlan.label"
            :name="data.steps.step2.tariffPlan.fields.tariffPlan.name"
            :placeholder="data.steps.step2.tariffPlan.fields.tariffPlan.placeholder"
          />
        </fieldset>

        <fieldset class="form__fieldset">
          <legend class="form__legend">{{ data.steps.step2.addServices.title }}</legend>

          <AppCheckbox
            :name="data.steps.step2.addServices.fields.router.name"
            :checked-value="data.steps.step2.addServices.fields.router.label"
            :label="data.steps.step2.addServices.fields.router.label"
            :label-add="data.steps.step2.addServices.fields.router.labelAdd"
            :help-text="data.steps.step2.addServices.fields.router.helpText"
          />

          <AppCheckbox
            :name="data.steps.step2.addServices.fields.staticIPAddress.name"
            :checked-value="data.steps.step2.addServices.fields.staticIPAddress.label"
            :label="data.steps.step2.addServices.fields.staticIPAddress.label"
            :label-add="data.steps.step2.addServices.fields.staticIPAddress.labelAdd"
            :help-text="data.steps.step2.addServices.fields.staticIPAddress.helpText"
          />
        </fieldset>

        <!-- Аккордеон закрывается при размонтировании (при переключении на другой step), <KeepAlive /> не помогает. Решаю проблему через ref с активным табом и emits из api primevue -->
        <Accordion
          :active-index="connectionAddressActiveIndex"
          @tab-open="connectionAddressActiveIndex = 0"
          @tab-close="connectionAddressActiveIndex = null"
        >
          <AccordionTab
            :header="data.steps.step2.connectionAddress.title"
            :pt="{
              root: 'accordion-tab',
              headerAction: 'accordion-tab__header-action',
              headerIcon: 'accordion-tab__icon',
              content: 'accordion-tab__content'
            }"
          >
            <fieldset class="form__fieldset">
              <AppInputBlock
                :label="data.steps.step2.connectionAddress.fields.postalCode.label"
                :name="data.steps.step2.connectionAddress.fields.postalCode.name"
              />

              <AppSelect
                v-model="selectedRegion"
                :options="data.steps.step2.connectionAddress.fields.region.options"
                :placeholder="data.steps.step2.connectionAddress.fields.region.placeholder"
                :label="data.steps.step2.connectionAddress.fields.region.label"
                :name="data.steps.step2.connectionAddress.fields.region.name"
              />

              <AppSelect
                v-model="selectedSettlementType"
                :options="data.steps.step2.connectionAddress.fields.settlementType.options"
                :placeholder="data.steps.step2.connectionAddress.fields.settlementType.placeholder"
                :label="data.steps.step2.connectionAddress.fields.settlementType.label"
                :name="data.steps.step2.connectionAddress.fields.settlementType.name"
              />

              <AppSelect
                v-model="selectedSettlement"
                :options="data.steps.step2.connectionAddress.fields.settlement.options"
                :placeholder="data.steps.step2.connectionAddress.fields.settlement.placeholder"
                :label="data.steps.step2.connectionAddress.fields.settlement.label"
                :name="data.steps.step2.connectionAddress.fields.settlement.name"
                filter
              />

              <AppSelect
                v-model="selectedStreetType"
                :options="data.steps.step2.connectionAddress.fields.streetType.options"
                :placeholder="data.steps.step2.connectionAddress.fields.streetType.placeholder"
                :label="data.steps.step2.connectionAddress.fields.streetType.label"
                :name="data.steps.step2.connectionAddress.fields.streetType.name"
              />

              <AppSelect
                v-model="selectedStreet"
                :options="data.steps.step2.connectionAddress.fields.street.options"
                :placeholder="data.steps.step2.connectionAddress.fields.street.placeholder"
                :label="data.steps.step2.connectionAddress.fields.street.label"
                :name="data.steps.step2.connectionAddress.fields.street.name"
                filter
              />

              <AppCheckbox
                :name="data.steps.step2.connectionAddress.fields.noStreet.name"
                :checked-value="data.steps.step2.connectionAddress.fields.noStreet.label"
                :label="data.steps.step2.connectionAddress.fields.noStreet.label"
              />

              <div class="form__fieldset-wrapper">
                <AppInputBlock
                  :label="data.steps.step2.connectionAddress.fields.house.label"
                  :name="data.steps.step2.connectionAddress.fields.house.name"
                  :placeholder="data.steps.step2.connectionAddress.fields.house.placeholder"
                />

                <AppInputBlock
                  :label="data.steps.step2.connectionAddress.fields.building.label"
                  :name="data.steps.step2.connectionAddress.fields.building.name"
                  :placeholder="data.steps.step2.connectionAddress.fields.building.placeholder"
                />
              </div>

              <AppSelect
                v-model="selectedTypeRoom"
                :options="data.steps.step2.connectionAddress.fields.typeRoom.options"
                :placeholder="data.steps.step2.connectionAddress.fields.typeRoom.placeholder"
                :label="data.steps.step2.connectionAddress.fields.typeRoom.label"
                :name="data.steps.step2.connectionAddress.fields.typeRoom.name"
              />

              <AppInputBlock
                :label="data.steps.step2.connectionAddress.fields.room.label"
                :name="data.steps.step2.connectionAddress.fields.room.name"
                :placeholder="data.steps.step2.connectionAddress.fields.room.placeholder"
              />

              <AppCheckbox
                :name="data.steps.step2.connectionAddress.fields.noRoom.name"
                :checked-value="data.steps.step2.connectionAddress.fields.noRoom.label"
                :label="data.steps.step2.connectionAddress.fields.noRoom.label"
              />

              <AppInputBlock
                tag="textarea"
                :label="data.steps.step2.connectionAddress.fields.addressCommentary.label"
                :name="data.steps.step2.connectionAddress.fields.addressCommentary.name"
                :placeholder="
                  data.steps.step2.connectionAddress.fields.addressCommentary.placeholder
                "
                rows="5"
              />
            </fieldset>
          </AccordionTab>
        </Accordion>
      </AppStep>

      <AppStep :step-number="2" :current-step="currentStep">
        <fieldset class="form__fieldset">
          <legend class="form__legend">{{ data.steps.step3.manager.title }}</legend>

          <AppSelect
            v-model="selectedManager"
            :options="data.steps.step3.manager.options"
            :name="data.steps.step3.manager.name"
          />
        </fieldset>

        <fieldset class="form__fieldset">
          <legend class="form__legend">{{ data.steps.step3.otherWishes.title }}</legend>

          <AppInputBlock
            tag="textarea"
            :label="data.steps.step3.otherWishes.label"
            :name="data.steps.step3.otherWishes.name"
            rows="5"
          />
        </fieldset>
      </AppStep>
    </div>

    <div class="form__buttons">
      <AppButton
        v-if="!isFirstStep"
        @click="onClickPreviousButton"
        class="form__button"
        variant="secondary"
        >Назад</AppButton
      >
      <AppButton class="form__button" type="submit" :disabled="!meta.valid" variant="primary">{{
        isLastStep ? 'Готово' : 'Отправить'
      }}</AppButton>
    </div>
  </form>
  <AppSkeletonForm v-else />
</template>

<script setup>
import '@/utils/locale.js'
import { computed, onMounted, ref } from 'vue'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import { vMaska } from 'maska'
import Accordion from 'primevue/accordion'
import AccordionTab from 'primevue/accordiontab'
import AppInputBlock from '@/components/AppInputBlock.vue'
import AppButton from '@/components/AppButton.vue'
import AppStep from '@/components/AppStep.vue'
import AppSelect from '@/components/AppSelect.vue'
import AppCheckbox from '@/components/AppCheckbox.vue'
import AppSkeletonForm from '@/components/AppSkeletonForm.vue'
import {
  onlyLettersRegexp,
  phoneRegexp,
  exactlySixNumbersRegexp,
  cyrillicAndNumbersRegexp,
  onlyNumbersRegexp
} from '@/utils/regexp.js'
import {
  onlyLettersMessage,
  phoneMessage,
  exactlySixNumbersMessage,
  cyrillicAndNumbersMessage,
  onlyNumbersMessage
} from '@/utils/messages.js'

const data = ref(null)

const selectedTariffPlan = ref('')
const selectedRegion = ref('')
const selectedSettlementType = ref('')
const selectedSettlement = ref('')
const selectedStreetType = ref('')
const selectedStreet = ref('')
const selectedTypeRoom = ref('')
const selectedManager = ref('')

const connectionAddressActiveIndex = ref(null)

const schemas = [
  yup.object({
    personalData: yup.object({
      surname: yup.string().required().trim().matches(onlyLettersRegexp, onlyLettersMessage),
      name: yup.string().required().trim().matches(onlyLettersRegexp, onlyLettersMessage),
      patronymic: yup.string().required().trim().matches(onlyLettersRegexp, onlyLettersMessage),
      phone: yup.string().required().matches().matches(phoneRegexp, phoneMessage),
      email: yup.string().required().email()
    })
  }),
  yup.object({
    order: yup.object({
      connectionAddress: yup.object({
        postalCode: yup.string().trim().matches(exactlySixNumbersRegexp, exactlySixNumbersMessage),
        house: yup.string().trim().matches(cyrillicAndNumbersRegexp, cyrillicAndNumbersMessage),
        building: yup.string().trim().matches(onlyNumbersRegexp, onlyNumbersMessage),
        room: yup.string().trim().matches(cyrillicAndNumbersRegexp, cyrillicAndNumbersMessage)
      })
    })
  }),
  yup.object({
    passportData: yup.object({})
  })
]

const currentStep = ref(0)

const currentSchema = computed(() => {
  return schemas[currentStep.value]
})

const isFirstStep = computed(() => {
  return currentStep.value === 0
})

const isLastStep = computed(() => {
  return currentStep.value === schemas.length - 1
})

const { handleSubmit, meta } = useForm({
  validationSchema: currentSchema,
  keepValuesOnUnmount: true
})

const onClickNavButton = (value) => {
  if (!meta.value.valid) return

  currentStep.value = value
}

const onClickPreviousButton = () => {
  currentStep.value -= 1
}

const onSubmit = handleSubmit((values) => {
  if (isLastStep.value) {
    console.log('Данные формы:', values)
    return
  }

  currentStep.value += 1
})

onMounted(async () => {
  const response = await fetch('http://localhost:3000/data')
  data.value = await response.json()
})
</script>

<style>
.form {
  display: grid;

  .form__nav {
    margin-bottom: 40px;
    padding-bottom: 10px;
    white-space: nowrap;
    border-bottom: 1px solid #ddd;

    @media (width <= 600px) {
      overflow-x: auto;
    }

    &::-webkit-scrollbar {
      display: none;
    }
  }

  .form__nav-button {
    position: relative;
    padding: 6px 18px;
    font-size: 16px;
    line-height: 1.375;
    font-weight: 700;
    color: rgba(0, 0, 0, 0.5);

    &[aria-pressed='true'] {
      color: #000;

      &::after {
        background-color: #00c4b3;
      }
    }

    &::after {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      bottom: -10px;
      width: 46px;
      height: 3px;
      background-color: transparent;
      transition: background-color 0.3s;
      content: '';
    }

    &:hover {
      color: #000;

      &::after {
        background-color: #00c4b3;
      }
    }
  }

  .form__fields {
    display: grid;
    row-gap: 30px;
  }

  .form__fieldset {
    display: grid;
    row-gap: 20px;
  }

  .form__fieldset-wrapper {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px 30px;

    @media (width <= 600px) {
      grid-template-columns: 1fr;
    }
  }

  .form__legend {
    font-size: 21px;
    line-height: 1.33;
    font-weight: 600;
    margin-bottom: 20px;
  }

  .form__buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 10px 20px;
    margin-top: 40px;
    margin-left: auto;

    @media (width <= 600px) {
      flex-direction: column;
      width: 100%;
      margin-top: 20px;
    }
  }

  .form__button {
    min-width: 191px;

    @media (width <= 600px) {
      min-width: 150px;
    }
  }
}
</style>
