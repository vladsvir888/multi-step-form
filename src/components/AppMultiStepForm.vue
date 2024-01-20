<template>
  <form @submit="onSubmit" class="form" novalidate>
    <pre>
      {{ values }}
    </pre>
    <nav class="form__nav">
      <AppButton
        v-for="(navButton, index) in navButtons"
        :key="navButton.text"
        @click="onClickNavButton(index)"
        class="form__nav-button"
        :class="{ active: currentStep === index }"
        :type="meta.valid ? 'button' : 'submit'"
        :aria-pressed="currentStep === index"
      >
        {{ navButton.text }}
      </AppButton>
    </nav>

    <div class="form__fields">
      <AppStep :step-number="0" :current-step="currentStep">
        <fieldset class="form__fieldset">
          <legend class="form__legend">Ваши контакты</legend>
          <AppInputBlock label="Фамилия" name="surname" required />
          <AppInputBlock label="Имя" name="name" required />
          <AppInputBlock label="Отчество" name="patronymic" required />
          <AppInputBlock
            v-maska
            data-maska="+375 (##) ###-##-##"
            placeholder="+375"
            label="Номер телефона"
            name="phone"
            type="tel"
            required
          />
          <AppInputBlock
            label="Адрес электронной почты"
            name="email"
            placeholder="test-email@gmail.com"
            type="email"
            required
          />
        </fieldset>
      </AppStep>

      <AppStep :step-number="1" :current-step="currentStep">
        <fieldset class="form__fieldset">
          <legend class="form__legend">Тарифный план</legend>
          <AppSelect
            v-model="selectedTariffPlan"
            :options="tariffPlans"
            placeholder="Выберите тарифный план"
            text="Выберите тарифный план"
            name="tariffPlan"
          />
        </fieldset>
        <fieldset class="form__fieldset">
          <legend class="form__legend">Дополнительные услуги</legend>
          <AppCheckbox
            name="addServices"
            checked-value="Маршрутизатор (Роутер)"
            help-text="Сетевое оборудование будет подобрано под ваши потребности. Ряд моделей доступны за дополнительную плату."
            label-text="Маршрутизатор (Роутер)"
            label-add-text="0р./Мес."
          />
          <AppCheckbox
            name="addServices"
            checked-value="Статический IP-адрес"
            help-text="Позволяет присвоить абоненту постоянный IP-адрес. Для выхода в интернет этот адрес не используется."
            label-text="Статический IP-адрес"
            label-add-text="4,20 руб./мес."
          />
        </fieldset>
        <Accordion>
          <AccordionTab
            header="Адрес подключения"
            :pt="{
              root: 'accordion-tab',
              headerAction: 'accordion-tab__header-action',
              headerIcon: 'accordion-tab__icon',
              content: 'accordion-tab__content'
            }"
          >
            <fieldset class="form__fieldset">
              <AppInputBlock label="Индекс" name="postalCode" />

              <AppSelect
                v-model="selectedRegion"
                :options="regions"
                placeholder="Выберите область"
                text="Область"
                name="region"
              />

              <AppSelect
                v-model="selectedSettlementType"
                :options="settlementsType"
                placeholder="Выберите тип населенного пункта"
                text="Тип населенного пункта"
                name="settlementType"
              />

              <AppSelect
                v-model="selectedSettlement"
                :options="settlements"
                placeholder="Выберите населенный пункт"
                text="Населенный пункт"
                name="settlement"
                filter
              />

              <AppSelect
                v-model="selectedStreetType"
                :options="streetsType"
                placeholder="Выберите тип улицы"
                text="Тип улицы"
                name="streetType"
              />

              <AppSelect
                v-model="selectedStreet"
                :options="streets"
                placeholder="Выберите улицу"
                text="Улица"
                name="street"
                filter
                :disabled="values.AddressDoesNotHaveStreet"
              />

              <AppCheckbox
                name="AddressDoesNotHaveStreet"
                :checked-value="true"
                label-text="В адресе отсутствует название улицы"
                @change="setFieldValue('street', undefined)"
              />
            </fieldset>
          </AccordionTab>
        </Accordion>
      </AppStep>

      <AppStep :step-number="2" :current-step="currentStep"> 3 </AppStep>
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
</template>

<script setup>
import { computed, ref } from 'vue'
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
import '@/utils/locale.js'
import { onlyLetterRegexp, phoneRegexp, postalCodeRegexp } from '@/utils/regexp.js'
import { onlyLetterMessage, phoneMessage, postalCodeMessage } from '@/utils/messages.js'

const selectedTariffPlan = ref('')
const tariffPlans = ref([
  'iDOM100+Megogo, 25,50 руб./мес.',
  'Мой бизнес PRO 100, 43 руб./мес.',
  'Мой бизнес PRO 80, 25,50 руб./мес.'
])

const selectedRegion = ref('')
const regions = ref([
  'Брестская область',
  'Витебская область',
  'Гомельская область',
  'Гродненская область',
  'Минская область',
  'Могилевская область'
])

const selectedSettlementType = ref('')
const settlementsType = ref(['Город', 'Поселок городского типа', 'Сельский населенный пункт'])

const selectedSettlement = ref('')
const settlements = ref([
  'Минск',
  'Гомель',
  'Могилёв',
  'Витебск',
  'Гродно',
  'Брест',
  'Барановичи',
  'Мозырь',
  'Бобруйск',
  'Слуцк'
])

const selectedStreetType = ref('')
const streetsType = ref([
  'Центральная улица',
  'Жилые улицы',
  'Промышленные улицы',
  'Торговые улицы',
  'Туристические улицы'
])

const selectedStreet = ref('')
const streets = ref(['Центральная', 'Молодежная', 'Садовая', 'Лесная', 'Полевая'])

const navButtons = ref([
  {
    text: 'Личные данные'
  },
  {
    text: 'Заказ'
  },
  {
    text: 'Паспортные данные'
  }
])

const schemas = [
  yup.object({
    surname: yup.string().required().matches(onlyLetterRegexp, onlyLetterMessage),
    name: yup.string().required().matches(onlyLetterRegexp, onlyLetterMessage),
    patronymic: yup.string().required().matches(onlyLetterRegexp, onlyLetterMessage),
    phone: yup.string().required().matches().matches(phoneRegexp, phoneMessage),
    email: yup.string().required().email()
  }),
  yup.object({
    postalCode: yup.string().matches(postalCodeRegexp, postalCodeMessage)
  }),
  null
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

const { handleSubmit, meta, values, setFieldValue } = useForm({
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
