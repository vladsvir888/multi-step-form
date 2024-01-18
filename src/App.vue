<template>
  <div class="container">
    <h1>Заявление на подключение</h1>
    <div class="text-block">
      <p>
        <b>Не уверены, какой тариф лучше выбрать?</b>
      </p>
      <p>Обратитесь за консультацией в контакт-центр по телефону <b>174</b>.</p>
    </div>
    <form @submit="onSubmit" class="form" novalidate>
      <div class="form__wrapper">
        <AppInputBlock label="Фамилия" name="surname" required />
        <AppInputBlock label="Имя" name="name" required />
        <AppInputBlock label="Отчество" name="patronymic" required />
        <AppInputBlock label="Номер телефона" name="phone" type="tel" required />
        <AppInputBlock
          label="Адрес электронной почты"
          name="email"
          placeholder="test-email@gmail.com"
          type="email"
          required
        />
      </div>
      <div class="form__buttons">
        <AppButton class="form__button" variant="secondary">Назад</AppButton>
        <AppButton class="form__button">Отправить</AppButton>
      </div>
    </form>
  </div>
</template>

<script setup>
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import AppInputBlock from '@/components/AppInputBlock.vue'
import AppButton from '@/components/AppButton.vue'
import '@/utils/locale.js'
import { onlyLetterRegexp } from '@/utils/regexp.js'
import { onlyLetterMessage } from '@/utils/messages.js'

const { handleSubmit } = useForm({
  validationSchema: yup.object({
    surname: yup.string().required().matches(onlyLetterRegexp, onlyLetterMessage),
    name: yup.string().required().matches(onlyLetterRegexp, onlyLetterMessage),
    patronymic: yup.string().required().matches(onlyLetterRegexp, onlyLetterMessage),
    phone: yup.string().required().matches(),
    email: yup.string().required().email()
  })
})

const onSubmit = handleSubmit((values) => {
  console.log(values)
})
</script>

<style></style>
