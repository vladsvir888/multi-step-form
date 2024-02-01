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

          <AppInput
            :label="data.steps.step1.personalData.fields.surname.label"
            :name="data.steps.step1.personalData.fields.surname.name"
            required
          />

          <AppInput
            :label="data.steps.step1.personalData.fields.name.label"
            :name="data.steps.step1.personalData.fields.name.name"
            required
          />

          <AppInput
            :label="data.steps.step1.personalData.fields.patronymic.label"
            :name="data.steps.step1.personalData.fields.patronymic.name"
            required
          />

          <AppInput
            v-maska
            :data-maska="data.steps.step1.personalData.fields.phone.mask"
            :placeholder="data.steps.step1.personalData.fields.phone.placeholder"
            :label="data.steps.step1.personalData.fields.phone.label"
            :name="data.steps.step1.personalData.fields.phone.name"
            type="tel"
            required
          />

          <AppInput
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
            v-model="values.order.tariffPlan"
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

        <!-- Аккордеон закрывается при размонтировании компонента (при переключении на другой step), <KeepAlive /> не помог. Решаю проблему через ref с активным табом и emits из api primevue -->
        <AppCollapse
          :active-index="connectionAddressActiveIndex"
          @change-index-active-tab="connectionAddressActiveIndex = $event"
          header="Адрес подключения"
        >
          <fieldset class="form__fieldset">
            <AppInput
              :label="data.steps.step2.connectionAddress.fields.postalCode.label"
              :name="data.steps.step2.connectionAddress.fields.postalCode.name"
            />

            <AppSelect
              v-model="values.order.connectionAddress.region"
              :options="data.steps.step2.connectionAddress.fields.region.options"
              :placeholder="data.steps.step2.connectionAddress.fields.region.placeholder"
              :label="data.steps.step2.connectionAddress.fields.region.label"
              :name="data.steps.step2.connectionAddress.fields.region.name"
            />

            <AppSelect
              v-model="values.order.connectionAddress.settlementType"
              :options="data.steps.step2.connectionAddress.fields.settlementType.options"
              :placeholder="data.steps.step2.connectionAddress.fields.settlementType.placeholder"
              :label="data.steps.step2.connectionAddress.fields.settlementType.label"
              :name="data.steps.step2.connectionAddress.fields.settlementType.name"
            />

            <AppSelect
              v-model="values.order.connectionAddress.settlement"
              :options="data.steps.step2.connectionAddress.fields.settlement.options"
              :placeholder="data.steps.step2.connectionAddress.fields.settlement.placeholder"
              :label="data.steps.step2.connectionAddress.fields.settlement.label"
              :name="data.steps.step2.connectionAddress.fields.settlement.name"
              filter
            />

            <AppSelect
              v-model="values.order.connectionAddress.streetType"
              :options="data.steps.step2.connectionAddress.fields.streetType.options"
              :placeholder="data.steps.step2.connectionAddress.fields.streetType.placeholder"
              :label="data.steps.step2.connectionAddress.fields.streetType.label"
              :name="data.steps.step2.connectionAddress.fields.streetType.name"
            />

            <AppSelect
              v-model="values.order.connectionAddress.street"
              :options="data.steps.step2.connectionAddress.fields.street.options"
              :placeholder="data.steps.step2.connectionAddress.fields.street.placeholder"
              :label="data.steps.step2.connectionAddress.fields.street.label"
              :name="data.steps.step2.connectionAddress.fields.street.name"
              :disabled="values.order.connectionAddress.noStreet"
              filter
            />

            <AppCheckbox
              :name="data.steps.step2.connectionAddress.fields.noStreet.name"
              :checked-value="true"
              :label="data.steps.step2.connectionAddress.fields.noStreet.label"
              @change="setFieldValue('order.connectionAddress.street', '')"
            />

            <div class="form__fieldset-wrapper">
              <AppInput
                :label="data.steps.step2.connectionAddress.fields.house.label"
                :name="data.steps.step2.connectionAddress.fields.house.name"
                :placeholder="data.steps.step2.connectionAddress.fields.house.placeholder"
              />

              <AppInput
                :label="data.steps.step2.connectionAddress.fields.building.label"
                :name="data.steps.step2.connectionAddress.fields.building.name"
                :placeholder="data.steps.step2.connectionAddress.fields.building.placeholder"
              />
            </div>

            <AppSelect
              v-model="values.order.connectionAddress.typeRoom"
              :options="data.steps.step2.connectionAddress.fields.typeRoom.options"
              :placeholder="data.steps.step2.connectionAddress.fields.typeRoom.placeholder"
              :label="data.steps.step2.connectionAddress.fields.typeRoom.label"
              :name="data.steps.step2.connectionAddress.fields.typeRoom.name"
            />

            <AppInput
              :label="data.steps.step2.connectionAddress.fields.room.label"
              :name="data.steps.step2.connectionAddress.fields.room.name"
              :placeholder="data.steps.step2.connectionAddress.fields.room.placeholder"
              :disabled="values.order.connectionAddress.noRoom"
            />

            <AppCheckbox
              :name="data.steps.step2.connectionAddress.fields.noRoom.name"
              :checked-value="true"
              :label="data.steps.step2.connectionAddress.fields.noRoom.label"
              @change="setFieldValue('order.connectionAddress.room', '')"
            />

            <AppInput
              tag="textarea"
              :label="data.steps.step2.connectionAddress.fields.addressCommentary.label"
              :name="data.steps.step2.connectionAddress.fields.addressCommentary.name"
              :placeholder="data.steps.step2.connectionAddress.fields.addressCommentary.placeholder"
              rows="5"
            />
          </fieldset>
        </AppCollapse>
      </AppStep>

      <AppStep :step-number="2" :current-step="currentStep">
        <fieldset class="form__fieldset">
          <AppRadioGroup :label="data.steps.step3.passportData.fields.resident.title">
            <div class="form__fieldset-wrapper">
              <!-- Почему-то эта радиокнопка триггерит валидацию на чекбоксе с политикой конфиденциальности, пока просто по умолчанию сделал чекбокс как checked -->
              <AppRadioButton
                :name="data.steps.step3.passportData.fields.resident.fields.yes.name"
                :checked-value="data.steps.step3.passportData.fields.resident.fields.yes.label"
                :label="data.steps.step3.passportData.fields.resident.fields.yes.label"
                @change="isResidentBelarus = true"
              />
              <AppRadioButton
                :name="data.steps.step3.passportData.fields.resident.fields.no.name"
                :checked-value="data.steps.step3.passportData.fields.resident.fields.no.label"
                :label="data.steps.step3.passportData.fields.resident.fields.no.label"
                @change="isResidentBelarus = false"
              />
            </div>
          </AppRadioGroup>

          <div class="form__fieldset" v-show="isResidentBelarus === false">
            <AppInput
              :label="data.steps.step3.passportData.fields.citizenship.label"
              :name="data.steps.step3.passportData.fields.citizenship.name"
              :placeholder="data.steps.step3.passportData.fields.citizenship.placeholder"
            />

            <AppRadioGroup
              :label="data.steps.step3.passportData.fields.temporaryRegistration.title"
            >
              <div class="form__fieldset-wrapper">
                <AppRadioButton
                  :name="data.steps.step3.passportData.fields.temporaryRegistration.fields.yes.name"
                  :checked-value="
                    data.steps.step3.passportData.fields.temporaryRegistration.fields.yes.label
                  "
                  :label="
                    data.steps.step3.passportData.fields.temporaryRegistration.fields.yes.label
                  "
                  @change="isTemporaryRegistration = true"
                />
                <AppRadioButton
                  :name="data.steps.step3.passportData.fields.temporaryRegistration.fields.no.name"
                  :checked-value="
                    data.steps.step3.passportData.fields.temporaryRegistration.fields.no.label
                  "
                  :label="
                    data.steps.step3.passportData.fields.temporaryRegistration.fields.no.label
                  "
                  @change="isTemporaryRegistration = false"
                />
              </div>
            </AppRadioGroup>
          </div>

          <AppSelect
            v-model="values.passportData.passportData.documentType"
            :options="data.steps.step3.passportData.fields.documentType.options"
            :name="data.steps.step3.passportData.fields.documentType.name"
            :label="data.steps.step3.passportData.fields.documentType.label"
            :placeholder="data.steps.step3.passportData.fields.documentType.placeholder"
          />

          <div class="form__fieldset-wrapper">
            <AppInput
              :label="data.steps.step3.passportData.fields.series.label"
              :name="data.steps.step3.passportData.fields.series.name"
              :placeholder="data.steps.step3.passportData.fields.series.placeholder"
            />

            <AppInput
              :label="data.steps.step3.passportData.fields.number.label"
              :name="data.steps.step3.passportData.fields.number.name"
              :placeholder="data.steps.step3.passportData.fields.number.placeholder"
            />
          </div>

          <AppInput
            :label="data.steps.step3.passportData.fields.dateOfIssue.label"
            :name="data.steps.step3.passportData.fields.dateOfIssue.name"
            type="date"
          />

          <AppInput
            :label="data.steps.step3.passportData.fields.dateOfExpiry.label"
            :name="data.steps.step3.passportData.fields.dateOfExpiry.name"
            :placeholder="data.steps.step3.passportData.fields.dateOfExpiry.placeholder"
            type="date"
          />

          <AppInput
            :label="data.steps.step3.passportData.fields.identificationNumber.label"
            :name="data.steps.step3.passportData.fields.identificationNumber.name"
          />

          <AppInput
            :label="data.steps.step3.passportData.fields.passportIssuedBy.label"
            :name="data.steps.step3.passportData.fields.passportIssuedBy.name"
            :placeholder="data.steps.step3.passportData.fields.passportIssuedBy.placeholder"
          />
        </fieldset>

        <AppCollapse
          v-show="isTemporaryRegistration !== false"
          :active-index="registrationAddressActiveIndex"
          @change-index-active-tab="registrationAddressActiveIndex = $event"
          header="Адрес регистрации"
        >
          <AppCheckbox
            :name="data.steps.step3.registrationAddress.fields.sameAsConnectionAddress.name"
            :checked-value="true"
            :label="data.steps.step3.registrationAddress.fields.sameAsConnectionAddress.label"
            @change="isSameAsConnectionAddress = !isSameAsConnectionAddress"
          />

          <fieldset v-show="!isSameAsConnectionAddress" class="form__fieldset">
            <AppInput
              :label="data.steps.step3.registrationAddress.fields.postalCode.label"
              :name="data.steps.step3.registrationAddress.fields.postalCode.name"
            />

            <AppSelect
              v-model="values.passportData.registrationAddress.region"
              :options="data.steps.step3.registrationAddress.fields.region.options"
              :placeholder="data.steps.step3.registrationAddress.fields.region.placeholder"
              :label="data.steps.step3.registrationAddress.fields.region.label"
              :name="data.steps.step3.registrationAddress.fields.region.name"
            />

            <AppSelect
              v-model="values.passportData.registrationAddress.settlementType"
              :options="data.steps.step3.registrationAddress.fields.settlementType.options"
              :placeholder="data.steps.step3.registrationAddress.fields.settlementType.placeholder"
              :label="data.steps.step3.registrationAddress.fields.settlementType.label"
              :name="data.steps.step3.registrationAddress.fields.settlementType.name"
            />

            <AppSelect
              v-model="values.passportData.registrationAddress.settlement"
              :options="data.steps.step3.registrationAddress.fields.settlement.options"
              :placeholder="data.steps.step3.registrationAddress.fields.settlement.placeholder"
              :label="data.steps.step3.registrationAddress.fields.settlement.label"
              :name="data.steps.step3.registrationAddress.fields.settlement.name"
              filter
            />

            <AppSelect
              v-model="values.passportData.registrationAddress.streetType"
              :options="data.steps.step3.registrationAddress.fields.streetType.options"
              :placeholder="data.steps.step3.registrationAddress.fields.streetType.placeholder"
              :label="data.steps.step3.registrationAddress.fields.streetType.label"
              :name="data.steps.step3.registrationAddress.fields.streetType.name"
            />

            <AppSelect
              v-model="values.passportData.registrationAddress.street"
              :options="data.steps.step3.registrationAddress.fields.street.options"
              :placeholder="data.steps.step3.registrationAddress.fields.street.placeholder"
              :label="data.steps.step3.registrationAddress.fields.street.label"
              :name="data.steps.step3.registrationAddress.fields.street.name"
              :disabled="values.passportData.registrationAddress.noStreet"
              filter
            />

            <AppCheckbox
              :name="data.steps.step3.registrationAddress.fields.noStreet.name"
              :checked-value="true"
              :label="data.steps.step3.registrationAddress.fields.noStreet.label"
              @change="setFieldValue('passportData.registrationAddress.street', '')"
            />

            <div class="form__fieldset-wrapper">
              <AppInput
                :label="data.steps.step3.registrationAddress.fields.house.label"
                :name="data.steps.step3.registrationAddress.fields.house.name"
                :placeholder="data.steps.step3.registrationAddress.fields.house.placeholder"
              />

              <AppInput
                :label="data.steps.step3.registrationAddress.fields.building.label"
                :name="data.steps.step3.registrationAddress.fields.building.name"
                :placeholder="data.steps.step3.registrationAddress.fields.building.placeholder"
              />
            </div>

            <AppSelect
              v-model="values.passportData.registrationAddress.typeRoom"
              :options="data.steps.step3.registrationAddress.fields.typeRoom.options"
              :placeholder="data.steps.step3.registrationAddress.fields.typeRoom.placeholder"
              :label="data.steps.step3.registrationAddress.fields.typeRoom.label"
              :name="data.steps.step3.registrationAddress.fields.typeRoom.name"
            />

            <AppInput
              :label="data.steps.step3.registrationAddress.fields.room.label"
              :name="data.steps.step3.registrationAddress.fields.room.name"
              :placeholder="data.steps.step3.registrationAddress.fields.room.placeholder"
              :disabled="values.passportData.registrationAddress.noRoom"
            />

            <AppCheckbox
              :name="data.steps.step3.registrationAddress.fields.noRoom.name"
              :checked-value="true"
              :label="data.steps.step3.registrationAddress.fields.noRoom.label"
              @change="setFieldValue('passportData.registrationAddress.room', '')"
            />

            <AppInput
              tag="textarea"
              :label="data.steps.step3.registrationAddress.fields.addressCommentary.label"
              :name="data.steps.step3.registrationAddress.fields.addressCommentary.name"
              :placeholder="
                data.steps.step3.registrationAddress.fields.addressCommentary.placeholder
              "
              rows="5"
            />
          </fieldset>
        </AppCollapse>

        <fieldset class="form__fieldset">
          <legend class="form__legend">{{ data.steps.step3.manager.title }}</legend>

          <AppSelect
            v-model="values.passportData.manager"
            :options="data.steps.step3.manager.fields.manager.options"
            :name="data.steps.step3.manager.fields.manager.name"
          />
        </fieldset>

        <fieldset class="form__fieldset">
          <legend class="form__legend">{{ data.steps.step3.otherWishes.title }}</legend>

          <AppInput
            tag="textarea"
            :label="data.steps.step3.otherWishes.fields.otherWishes.label"
            :name="data.steps.step3.otherWishes.fields.otherWishes.name"
            rows="5"
          />
        </fieldset>

        <div class="form__checkbox-wrapper">
          <AppCheckbox
            :name="data.steps.step3.privacyPolicy.fields.privacyPolicy.name"
            :checked-value="true"
            :label="data.steps.step3.privacyPolicy.fields.privacyPolicy.label"
            required
          />
        </div>
      </AppStep>
    </div>

    <div class="form__buttons">
      <AppButton
        v-if="!isFirstStep"
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

    <pre>
      values - {{ values }}
    </pre>
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

const emit = defineEmits(['change-text'])

const data = ref(null)

const connectionAddressActiveIndex = ref(null)
const registrationAddressActiveIndex = ref(null)
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
      surname: string().required().trim().matches(onlyLettersRegexp, onlyLettersMessage),
      name: string().required().trim().matches(onlyLettersRegexp, onlyLettersMessage),
      patronymic: string().required().trim().matches(onlyLettersRegexp, onlyLettersMessage),
      phone: string().required().matches(phoneRegexp, phoneMessage),
      email: string().required().email()
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
  keepValuesOnUnmount: true,
  initialValues: {
    personalData: {
      surname: '',
      name: '',
      patronymic: '',
      phone: '',
      email: ''
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
    console.log('Данные формы:', values)
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
    display: grid;
    row-gap: 30px;
    max-width: 400px;
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
