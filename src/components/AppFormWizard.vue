<template>
  <form v-if="data" @submit="onSubmit" class="form" novalidate>
    <nav class="form__nav">
      <AppButton
        v-for="(tab, index) in data.tabs"
        :key="tab"
        @click="onClickNavButton(index)"
        class="form__nav-button"
        :class="{ active: currentStep === index }"
        :type="meta.valid ? 'button' : 'submit'"
        :aria-pressed="currentStep === index"
      >
        {{ tab }}
      </AppButton>
    </nav>

    <div class="form__fields">
      <!-- Шаг 1 -->
      <AppStep :step-number="0" :current-step="currentStep">
        <fieldset class="form__fieldset">
          <legend class="form__legend">{{ data.steps.step1.personalData.title }}</legend>

          <AppInput v-bind="{ ...data.steps.step1.personalData.fields.surname, required: true }" />

          <AppInput v-bind="{ ...data.steps.step1.personalData.fields.name, required: true }" />

          <AppInput
            v-bind="{ ...data.steps.step1.personalData.fields.patronymic, required: true }"
          />

          <AppInput
            v-maska
            v-bind="{ ...data.steps.step1.personalData.fields.phone, type: 'tel', required: true }"
          />

          <AppInput
            v-bind="{
              ...data.steps.step1.personalData.fields.email,
              type: 'email',
              required: true
            }"
          />
        </fieldset>
      </AppStep>

      <!-- Шаг 2 -->
      <AppStep :step-number="1" :current-step="currentStep">
        <fieldset class="form__fieldset">
          <legend class="form__legend">{{ data.steps.step2.tariffPlan.title }}</legend>

          <AppSelect
            v-model="values.order.tariffPlan"
            v-bind="data.steps.step2.tariffPlan.fields.tariffPlan"
          />
        </fieldset>

        <fieldset class="form__fieldset">
          <legend class="form__legend">{{ data.steps.step2.addServices.title }}</legend>

          <AppCheckbox
            v-bind="{
              ...data.steps.step2.addServices.fields.router,
              checkedValue: data.steps.step2.addServices.fields.router.label
            }"
          />

          <AppCheckbox
            v-bind="{
              ...data.steps.step2.addServices.fields.staticIPAddress,
              checkedValue: data.steps.step2.addServices.fields.staticIPAddress.label
            }"
          />
        </fieldset>

        <AppCollapse :header="data.steps.step2.connectionAddress.title">
          <fieldset class="form__fieldset">
            <AppInput v-bind="data.steps.step2.connectionAddress.fields.postalCode" />

            <AppSelect
              v-model="values.order.connectionAddress.region"
              v-bind="data.steps.step2.connectionAddress.fields.region"
            />

            <AppSelect
              v-model="values.order.connectionAddress.settlementType"
              v-bind="data.steps.step2.connectionAddress.fields.settlementType"
            />

            <AppSelect
              v-model="values.order.connectionAddress.settlement"
              v-bind="{ ...data.steps.step2.connectionAddress.fields.settlement, filter: true }"
            />

            <AppSelect
              v-model="values.order.connectionAddress.streetType"
              v-bind="data.steps.step2.connectionAddress.fields.streetType"
            />

            <AppSelect
              v-model="values.order.connectionAddress.street"
              v-bind="{
                ...data.steps.step2.connectionAddress.fields.street,
                disabled: values.order.connectionAddress.noStreet,
                filter: true
              }"
            />

            <AppCheckbox
              v-bind="{ ...data.steps.step2.connectionAddress.fields.noStreet, checkedValue: true }"
              @change="
                setFieldValue(
                  'order.connectionAddress.street',
                  'В адресе отсутствует название улицы'
                )
              "
            />

            <div class="form__fieldset-wrapper">
              <AppInput v-bind="data.steps.step2.connectionAddress.fields.house" />

              <AppInput v-bind="data.steps.step2.connectionAddress.fields.building" />
            </div>

            <AppSelect
              v-model="values.order.connectionAddress.typeRoom"
              v-bind="data.steps.step2.connectionAddress.fields.typeRoom"
            />

            <AppInput
              v-bind="{
                ...data.steps.step2.connectionAddress.fields.room,
                disabled: values.order.connectionAddress.noRoom
              }"
            />

            <AppCheckbox
              v-bind="{ ...data.steps.step2.connectionAddress.fields.noRoom, checkedValue: true }"
              @change="
                setFieldValue('order.connectionAddress.room', 'Это единое строение, помещения нет')
              "
            />

            <AppInput
              v-bind="{
                ...data.steps.step2.connectionAddress.fields.addressCommentary,
                tag: 'textarea',
                rows: '5'
              }"
            />
          </fieldset>
        </AppCollapse>
      </AppStep>

      <!-- Шаг 3 -->
      <!-- Почему-то при переходе на последний этап триггерится валидация на обязательном чекбоксе с политикой конфиденциальности, пока просто сделал его по умолчанию checked -->
      <AppStep :step-number="2" :current-step="currentStep">
        <fieldset class="form__fieldset">
          <AppRadioGroup :label="data.steps.step3.passportData.fields.resident.title">
            <div class="form__fieldset-wrapper">
              <AppRadioButton
                v-bind="{
                  ...data.steps.step3.passportData.fields.resident.fields.yes,
                  checkedValue: data.steps.step3.passportData.fields.resident.fields.yes.label
                }"
                @change="isResidentBelarus = true"
              />

              <AppRadioButton
                v-bind="{
                  ...data.steps.step3.passportData.fields.resident.fields.no,
                  checkedValue: data.steps.step3.passportData.fields.resident.fields.no.label
                }"
                @change="isResidentBelarus = false"
              />
            </div>
          </AppRadioGroup>

          <div class="form__fieldset" v-show="isResidentBelarus === false">
            <AppInput v-bind="data.steps.step3.passportData.fields.citizenship" />

            <AppRadioGroup
              :label="data.steps.step3.passportData.fields.temporaryRegistration.title"
            >
              <div class="form__fieldset-wrapper">
                <AppRadioButton
                  v-bind="{
                    ...data.steps.step3.passportData.fields.temporaryRegistration.fields.yes,
                    checkedValue:
                      data.steps.step3.passportData.fields.temporaryRegistration.fields.yes.label
                  }"
                  @change="isTemporaryRegistration = true"
                />

                <AppRadioButton
                  v-bind="{
                    ...data.steps.step3.passportData.fields.temporaryRegistration.fields.no,
                    checkedValue:
                      data.steps.step3.passportData.fields.temporaryRegistration.fields.no.label
                  }"
                  @change="isTemporaryRegistration = false"
                />
              </div>
            </AppRadioGroup>
          </div>

          <AppSelect
            v-model="values.passportData.passportData.documentType"
            v-bind="data.steps.step3.passportData.fields.documentType"
          />

          <div class="form__fieldset-wrapper">
            <AppInput v-bind="data.steps.step3.passportData.fields.series" />

            <AppInput v-bind="data.steps.step3.passportData.fields.number" />
          </div>

          <AppInput
            v-bind="{ ...data.steps.step3.passportData.fields.dateOfIssue, type: 'date' }"
          />

          <AppInput
            v-bind="{ ...data.steps.step3.passportData.fields.dateOfExpiry, type: 'date' }"
          />

          <AppInput v-bind="data.steps.step3.passportData.fields.identificationNumber" />

          <AppInput v-bind="data.steps.step3.passportData.fields.passportIssuedBy" />
        </fieldset>

        <AppCollapse
          v-show="isTemporaryRegistration !== false"
          :header="data.steps.step3.registrationAddress.title"
        >
          <AppCheckbox
            v-bind="{
              ...data.steps.step3.registrationAddress.fields.sameAsConnectionAddress,
              checkedValue: true
            }"
            @change="isSameAsConnectionAddress = !isSameAsConnectionAddress"
          />

          <fieldset v-show="!isSameAsConnectionAddress" class="form__fieldset">
            <AppInput v-bind="data.steps.step3.registrationAddress.fields.postalCode" />

            <AppSelect
              v-model="values.passportData.registrationAddress.region"
              v-bind="data.steps.step3.registrationAddress.fields.region"
            />

            <AppSelect
              v-model="values.passportData.registrationAddress.settlementType"
              v-bind="data.steps.step3.registrationAddress.fields.settlementType"
            />

            <AppSelect
              v-model="values.passportData.registrationAddress.settlement"
              v-bind="{ ...data.steps.step3.registrationAddress.fields.settlement, filter: true }"
            />

            <AppSelect
              v-model="values.passportData.registrationAddress.streetType"
              v-bind="data.steps.step3.registrationAddress.fields.streetType"
            />

            <AppSelect
              v-model="values.passportData.registrationAddress.street"
              v-bind="{
                ...data.steps.step3.registrationAddress.fields.street,
                filter: true,
                disabled: values.passportData.registrationAddress.noStreet
              }"
            />

            <AppCheckbox
              v-bind="{
                ...data.steps.step3.registrationAddress.fields.noStreet,
                checkedValue: true
              }"
              @change="setFieldValue('passportData.registrationAddress.street', '')"
            />

            <div class="form__fieldset-wrapper">
              <AppInput v-bind="data.steps.step3.registrationAddress.fields.house" />

              <AppInput v-bind="data.steps.step3.registrationAddress.fields.building" />
            </div>

            <AppSelect
              v-model="values.passportData.registrationAddress.typeRoom"
              v-bind="data.steps.step3.registrationAddress.fields.typeRoom"
            />

            <AppInput
              v-bind="{
                ...data.steps.step3.registrationAddress.fields.room,
                disabled: values.passportData.registrationAddress.noRoom
              }"
            />

            <AppCheckbox
              v-bind="{ ...data.steps.step3.registrationAddress.fields.noRoom, checkedValue: true }"
              @change="setFieldValue('passportData.registrationAddress.room', '')"
            />

            <AppInput
              v-bind="{
                ...data.steps.step3.registrationAddress.fields.addressCommentary,
                tag: 'textarea',
                rows: '5'
              }"
            />
          </fieldset>
        </AppCollapse>

        <fieldset class="form__fieldset">
          <legend class="form__legend">{{ data.steps.step3.manager.title }}</legend>

          <AppSelect
            v-model="values.passportData.manager"
            v-bind="data.steps.step3.manager.fields.manager"
          />
        </fieldset>

        <fieldset class="form__fieldset">
          <legend class="form__legend">{{ data.steps.step3.otherWishes.title }}</legend>

          <AppInput
            v-bind="{
              ...data.steps.step3.otherWishes.fields.otherWishes,
              tag: 'textarea',
              rows: '5'
            }"
          />
        </fieldset>

        <div class="form__checkbox-wrapper">
          <AppCheckbox
            v-bind="{
              ...data.steps.step3.privacyPolicy.fields.privacyPolicy,
              required: true,
              checkedValue: true
            }"
          />
        </div>
      </AppStep>
    </div>

    <div class="form__buttons">
      <AppButton
        v-show="!isFirstStep"
        @click="onClickPreviousButton"
        class="form__button"
        variant="secondary"
        :disabled="!meta.valid"
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
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useForm } from 'vee-validate'
import { string, object, date, boolean } from 'yup'
import { vMaska } from 'maska'
import { useFetch } from '@vueuse/core'
import AppInput from '@/components/AppInput.vue'
import AppButton from '@/components/AppButton.vue'
import AppStep from '@/components/AppStep.vue'
import AppSelect from '@/components/AppSelect.vue'
import AppCheckbox from '@/components/AppCheckbox.vue'
import AppSkeletonForm from '@/components/AppSkeletonForm.vue'
import AppRadioGroup from '@/components/AppRadioGroup.vue'
import AppRadioButton from '@/components/AppRadioButton.vue'
import AppCollapse from '@/components/AppCollapse.vue'
import {
  onlyLettersRegexp,
  phoneRegexp,
  exactlySixNumbersRegexp,
  cyrillicAndNumbersRegexp,
  onlyNumbersRegexp,
  latinAndNumbersRegexp
} from '@/utils/regexp.js'
import {
  onlyLettersMessage,
  phoneMessage,
  exactlySixNumbersMessage,
  cyrillicAndNumbersMessage,
  onlyNumbersMessage,
  latinAndNumbersMessage,
  endDateMessages
} from '@/utils/messages.js'

const emit = defineEmits(['change-text', 'get-result-data'])

const data = ref(null)

const isResidentBelarus = ref(null)
const isTemporaryRegistration = ref(null)
const isSameAsConnectionAddress = ref(null)

const addressSchema = object({
  postalCode: string().trim().matches(exactlySixNumbersRegexp, exactlySixNumbersMessage),
  house: string().trim().matches(cyrillicAndNumbersRegexp, cyrillicAndNumbersMessage),
  building: string().trim().matches(onlyNumbersRegexp, onlyNumbersMessage),
  room: string().trim().matches(cyrillicAndNumbersRegexp, cyrillicAndNumbersMessage)
})
const schemas = [
  object({
    personalData: object({
      contacts: object({
        surname: string().required().trim().matches(onlyLettersRegexp, onlyLettersMessage),
        name: string().required().trim().matches(onlyLettersRegexp, onlyLettersMessage),
        patronymic: string().required().trim().matches(onlyLettersRegexp, onlyLettersMessage),
        phone: string().required().matches(phoneRegexp, phoneMessage),
        email: string().required().email()
      })
    })
  }),
  object({
    order: object({
      connectionAddress: addressSchema
    })
  }),
  object({
    passportData: object({
      passportData: object({
        series: string().trim().matches(latinAndNumbersRegexp, latinAndNumbersMessage),
        number: string().trim().matches(latinAndNumbersRegexp, latinAndNumbersMessage),
        identificationNumber: string()
          .trim()
          .matches(latinAndNumbersRegexp, latinAndNumbersMessage),
        dateOfIssue: date(),
        dateOfExpiry: date()
          // изначально решение было через yup.ref(), но после оптимизации (подключения из yup только нужного с целью сокращения размера бандла) происходил конфликт с ref из vue. Решаю проблему через yup.when()
          .when(
            'dateOfIssue',
            ([dateOfIssue], schema) => dateOfIssue && schema.min(dateOfIssue, endDateMessages)
          )
      }),
      registrationAddress: addressSchema,
      privacyPolicy: boolean().required()
    })
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

const { handleSubmit, meta, setValues, setFieldValue, values, validate, setErrors } = useForm({
  validationSchema: currentSchema,
  initialValues: {
    personalData: {
      contacts: {
        surname: '',
        name: '',
        patronymic: '',
        phone: '',
        email: ''
      }
    },
    order: {
      tariffPlan: '',
      addServices: [],
      connectionAddress: {
        postalCode: '',
        region: '',
        settlementType: '',
        settlement: '',
        streetType: '',
        street: '',
        noStreet: null,
        house: '',
        building: '',
        typeRoom: '',
        room: '',
        noRoom: null,
        addressCommentary: ''
      }
    },
    passportData: {
      passportData: {
        resident: '',
        citizenship: '',
        temporaryRegistration: '',
        documentType: '',
        series: '',
        number: '',
        dateOfIssue: undefined,
        dateOfExpiry: undefined,
        identificationNumber: '',
        passportIssuedBy: ''
      },
      registrationAddress: {
        sameAsConnectionAddress: null,
        postalCode: '',
        region: '',
        settlementType: '',
        settlement: '',
        streetType: '',
        street: '',
        noStreet: null,
        house: '',
        building: '',
        typeRoom: '',
        room: '',
        noRoom: null,
        addressCommentary: ''
      },
      manager: '',
      otherWishes: '',
      privacyPolicy: true
    }
  }
  // не работает, скорее всего это связано с тем, что я данные получаю в onMounted и vee-validate вызывает валидацию тоже при onMounted
  // validateOnMount: true
})

watch(isSameAsConnectionAddress, () => {
  setValues({
    passportData: {
      registrationAddress: {
        postalCode: values.order.connectionAddress.postalCode,
        region: values.order.connectionAddress.region,
        settlementType: values.order.connectionAddress.settlementType,
        settlement: values.order.connectionAddress.settlement,
        streetType: values.order.connectionAddress.streetType,
        street: values.order.connectionAddress.street,
        noStreet: values.order.connectionAddress.noStreet,
        house: values.order.connectionAddress.house,
        building: values.order.connectionAddress.building,
        typeRoom: values.order.connectionAddress.typeRoom,
        room: values.order.connectionAddress.room,
        noRoom: values.order.connectionAddress.noRoom,
        addressCommentary: values.order.connectionAddress.addressCommentary
      }
    }
  })
})

const emitChangedText = () => {
  emit('change-text', data.value.texts[currentStep.value])
}

const onClickNavButton = (value) => {
  if (!meta.value.valid) return

  currentStep.value = value

  emitChangedText()
}

const onClickPreviousButton = () => {
  currentStep.value -= 1

  emitChangedText()
}

const onSubmit = handleSubmit(async (values) => {
  if (isLastStep.value) {
    console.log('Данные:', values)
    emit('get-result-data', values)
    return
  }

  currentStep.value += 1

  emitChangedText()
})

// todo: временный вариант, лучше реализовать работу через localStorage
const onBeforeUnload = (event) => {
  event.preventDefault()
  event.returnValue = ''
}

onMounted(async () => {
  const { data: responseData, error } = await useFetch('http://localhost:3000/data').json()

  if (error.value) {
    alert('Произошла ошибка в результате ответа сервера.')
    return
  }

  data.value = responseData.value
  emitChangedText()

  window.addEventListener('beforeunload', onBeforeUnload)

  console.log(responseData.value)
})

onUnmounted(() => window.removeEventListener('beforeunload', onBeforeUnload))
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
    max-width: 400px;

    @media (width <= 900px) {
      max-width: 100%;
    }
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
