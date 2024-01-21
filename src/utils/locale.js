import { setLocale } from 'yup'

setLocale({
  mixed: {
    required: 'Обязательное поле'
  },
  string: {
    email: 'Введите правильный email, например, test-email@gmail.com',
  },
  // todo: не работает так, как в случае двух выше объектов
  // number: {
  //   integer: 'Введите только цифры'
  // }
})