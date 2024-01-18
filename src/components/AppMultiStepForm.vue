<template>
  <form @submit="onSubmit" class="form" novalidate>
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
      </AppStep>

      <AppStep :step-number="1" :current-step="currentStep"> 2 </AppStep>

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
import AppInputBlock from '@/components/AppInputBlock.vue'
import AppButton from '@/components/AppButton.vue'
import AppStep from '@/components/AppStep.vue'
import '@/utils/locale.js'
import { onlyLetterRegexp, phoneRegexp } from '@/utils/regexp.js'
import { onlyLetterMessage, phoneMessage } from '@/utils/messages.js'

const navButtons = [
  {
    text: 'Личные данные'
  },
  {
    text: 'Заказ'
  },
  {
    text: 'Паспортные данные'
  }
]

const schemas = [
  yup.object({
    surname: yup.string().required().matches(onlyLetterRegexp, onlyLetterMessage),
    name: yup.string().required().matches(onlyLetterRegexp, onlyLetterMessage),
    patronymic: yup.string().required().matches(onlyLetterRegexp, onlyLetterMessage),
    phone: yup.string().required().matches().matches(phoneRegexp, phoneMessage),
    email: yup.string().required().email()
  }),
  null,
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
  if (currentStep.value === schemas.length - 1) {
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
    overflow-x: auto;
    white-space: nowrap;
    border-bottom: 1px solid #ddd;

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
    row-gap: 20px;
  }

  .form__buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    margin-top: 40px;
    margin-left: auto;
  }

  .form__button {
    min-width: 191px;

    @media (width <= 600px) {
      min-width: 150px;
    }
  }
}
</style>
