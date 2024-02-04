<template>
  <section class="result-table">
    <div class="result-table__header">
      <h2 class="result-table__title">ЗАЯВКА НА ПОДКЛЮЧЕНИЕ ИНТЕРНЕТА «ДЕЛОВОЙ СЕТИ»</h2>
      <div class="result-table__text">
        <p>Пожалуйста, проверьте правильность заполненной информации.</p>
        <p>
          Если информация верна – нажмите "Отправить". Если вы хотите внести изменения – нажмите
          "Вернуться к редактированию".
        </p>
      </div>
    </div>
    <div class="result-table__main">
      <div class="result-table__block">
        <h3 class="result-table__title">Заголовок 1</h3>
        <div class="result-table__content-wrapper">
          <div class="result-table__content">
            <h4 class="result-table__content-title">Заголовок</h4>
            <dl class="result-table__list">
              <div class="result-table__list-item">
                <dt class="result-table__term">Термин</dt>
                <dd class="result-table__descr">Описание</dd>
              </div>
              <div class="result-table__list-item">
                <dt class="result-table__term">Термин</dt>
                <dd class="result-table__descr">Описание</dd>
              </div>
              <div class="result-table__list-item">
                <dt class="result-table__term">Термин</dt>
                <dd class="result-table__descr">Описание</dd>
              </div>
            </dl>
          </div>

          <div class="result-table__content">
            <h4 class="result-table__content-title">Заголовок</h4>
            <dl class="result-table__list">
              <div class="result-table__list-item">
                <dt class="result-table__term">Термин</dt>
                <dd class="result-table__descr">Описание</dd>
              </div>
              <div class="result-table__list-item">
                <dt class="result-table__term">Термин</dt>
                <dd class="result-table__descr">Описание</dd>
              </div>
              <div class="result-table__list-item">
                <dt class="result-table__term">Термин</dt>
                <dd class="result-table__descr">Описание</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      <div class="result-table__block">
        <h3 class="result-table__title">Заголовок 2</h3>
        <div class="result-table__content-wrapper">
          <div class="result-table__content">
            <h4 class="result-table__content-title">Заголовок</h4>
            <dl class="result-table__list">
              <div class="result-table__list-item">
                <dt class="result-table__term">Термин</dt>
                <dd class="result-table__descr">Описание</dd>
              </div>
              <div class="result-table__list-item">
                <dt class="result-table__term">Термин</dt>
                <dd class="result-table__descr">Описание</dd>
              </div>
              <div class="result-table__list-item">
                <dt class="result-table__term">Термин</dt>
                <dd class="result-table__descr">Описание</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
    <div class="result-table__buttons">
      <AppButton @click="$emit('reset-data')" class="result-table__button" variant="secondary"
        >Вернуться к редактированию</AppButton
      >
      <AppButton class="result-table__button" variant="primary">Отправить</AppButton>
    </div>
  </section>
</template>

<script setup>
// import resultTableDictionary from '@/utils/resultTableDictionary.js'
import AppButton from '@/components/AppButton.vue'

defineEmits(['reset-data'])

defineProps({
  data: {
    type: Object
  }
})
</script>

<style>
.result-table {
  max-width: 920px;
  margin: 0 auto;
  background: #fff;
  box-shadow: 0px 40px 40px #0000000d;
  border-radius: 10px;
  padding: 37px 50px;
  display: grid;
  row-gap: 30px;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: -1;
    background: linear-gradient(180deg, #00c4b3 0%, #13284a00 100%);
    height: 739px;
    clip-path: polygon(100% 0%, 0% 0%, 0% 100%);
  }

  .result-table__header {
    max-width: 400px;
  }

  .result-table__title {
    font-size: 24px;
    line-height: 121%;
    text-transform: uppercase;
  }

  .result-table__text {
    margin-top: 20px;

    > *:not(:last-child) {
      margin-bottom: 15px;
    }
  }

  .result-table__block {
    display: grid;
    grid-template-columns: 1fr 536px;
    gap: 30px;
    padding: 50px 0;
    border-bottom: 1px solid #e4e4e4;
  }

  .result-table__content:not(:last-child) {
    border-bottom: 1px solid #e4e4e4;
  }

  .result-table__content:first-child {
    padding-top: 0;
  }

  .result-table__content {
    padding: 30px 0;
  }

  .result-table__content:last-child {
    padding-bottom: 0;
  }

  .result-table__content-title {
    margin-bottom: 25px;
    font-size: 18px;
    line-height: 24px;
    font-weight: 700;
  }

  .result-table__list {
    display: grid;
    gap: 15px;
  }

  .result-table__list-item {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }

  .result-table__term {
    color: #606060;
  }

  .result-table__buttons {
    display: flex;
    justify-content: flex-end;
    gap: 20px;
  }

  .result-table__button {
    min-width: 225px;
  }
}
</style>
