<template>
  <section class="result-table">
    <div class="result-table__header">
      <h1 class="result-table__title result-table__title--main">
        ЗАЯВКА НА ПОДКЛЮЧЕНИЕ ИНТЕРНЕТА «ДЕЛОВОЙ СЕТИ»
      </h1>
      <div class="result-table__text">
        <p>Пожалуйста, проверьте правильность заполненной информации.</p>
        <p>
          Если информация верна – нажмите "Отправить". Если вы хотите внести изменения – нажмите
          "Вернуться к редактированию".
        </p>
      </div>
    </div>
    <div class="result-table__main">
      <template v-for="(blockValue, blockKey) in data" :key="blockKey">
        <div v-if="checkValues(blockValue)" class="result-table__block">
          <h2 class="result-table__title">
            {{ resultTableDictionary[blockKey] }}
          </h2>
          <div class="result-table__content-wrapper">
            <template v-for="(contentValue, contentKey) in blockValue" :key="contentKey">
              <div v-if="checkValues(contentValue)" class="result-table__content">
                <h3 class="result-table__content-title">
                  {{ resultTableDictionary[contentKey] }}
                </h3>
                <template v-if="isString(contentValue)">
                  <div class="result-table__list">
                    <div class="result-table__list-item">
                      <div class="result-table__term">
                        {{ resultTableDictionary[contentKey] }}
                      </div>
                      <div class="result-table__descr">
                        {{ contentValue }}
                      </div>
                    </div>
                  </div>
                </template>
                <template v-else-if="isArray(contentValue)">
                  <div class="result-table__list">
                    <div
                      v-for="arrayValue in contentValue"
                      :key="arrayValue"
                      class="result-table__list-item"
                    >
                      {{ arrayValue }}
                    </div>
                  </div>
                </template>
                <template v-else-if="isObject(contentValue)">
                  <dl class="result-table__list">
                    <template v-for="(valueObj, valueKey) in contentValue" :key="valueKey">
                      <div v-if="checkValues(valueObj)" class="result-table__list-item">
                        <dt class="result-table__term">
                          {{ resultTableDictionary[valueKey] }}
                        </dt>
                        <dd class="result-table__descr">
                          {{ valueObj }}
                        </dd>
                      </div>
                    </template>
                  </dl>
                </template>
              </div>
            </template>
          </div>
        </div>
      </template>
    </div>
    <div class="result-table__buttons">
      <UIButton
        class="result-table__button"
        variant="secondary"
        :disabled="isLoading"
        @click="resetData"
        >Вернуться к редактированию</UIButton
      >
      <UIButton
        class="result-table__button"
        variant="primary"
        :disabled="isLoading"
        @click="fetchData"
        ><span>{{ isLoading ? 'Отправка...' : 'Отправить' }}</span></UIButton
      >
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import UIButton from '@/components/UI/UIButton.vue'
import { keyInLocalStorage, resultTableDictionary } from '@/utils/constants'
import { isBoolean, isArray, isObject, isString } from '@/utils/isFunction'
import scrollUp from '@/utils/scrollUp'
import { getItemInLocalStorage, setItemInLocalStorage } from '@/utils/localStorage'

const emit = defineEmits(['reset-data', 'response-data'])

const props = defineProps({
  data: {
    type: Object
  }
})

const isLoading = ref(false)

const checkValues = (value) => {
  const values = []

  const checkNestedValues = (obj) => {
    for (let key in obj) {
      const data = obj[key]

      if (isString(data)) {
        values.push(!!data)
      } else if (isArray(data)) {
        values.push(!!data.length)
      } else if (isBoolean(data)) {
        // && key !== 'privacyPolicy'
        values.push(data)
      } else if (isObject(data)) {
        checkNestedValues(data)
      }
    }
  }

  checkNestedValues(value)

  return values.some((value) => value)
}

const resetData = () => {
  emit('reset-data', null)

  scrollUp()

  let data = getItemInLocalStorage(keyInLocalStorage)
  data = { ...data, summaryData: undefined }
  setItemInLocalStorage(keyInLocalStorage, data)
}

const fetchData = async () => {
  try {
    isLoading.value = true

    const response = await fetch(`${import.meta.env.VITE_API_URL}/form`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(props.data)
    })

    if (!response.ok) {
      throw new Error()
    }

    const result = await response.json()

    if (!result) {
      throw new Error()
    } else {
      emit('response-data', {
        title: 'Заявка успешно отправлена',
        success: true
      })
    }
  } catch {
    emit('response-data', {
      title: 'Произошла ошибка при отправке данных',
      success: false
    })
  } finally {
    resetData()
    isLoading.value = false
  }
}
</script>

<style scoped>
.result-table {
  max-width: 920px;
  margin: 0 auto;
  background: #fff;
  box-shadow: 0px 40px 40px #0000000d;
  border-radius: 10px;
  padding: 37px 50px;
  display: grid;
  row-gap: 30px;

  @media (width <= 900px) {
    padding: 25px;
  }

  &::before {
    content: '';
    position: fixed;
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

    &:not(.result-table__title--main) {
      align-self: start;
      position: sticky;
      top: 20px;

      @media (width <= 900px) {
        position: static;
      }
    }
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

    @media (width <= 900px) {
      grid-template-columns: 1fr;
      padding: 25px 0;
    }
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

    @media (width <= 600px) {
      grid-template-columns: 1fr;
    }
  }

  .result-table__term {
    color: #606060;
  }

  .result-table__buttons {
    display: flex;
    justify-content: flex-end;
    gap: 20px;

    @media (width <= 600px) {
      flex-direction: column;
      gap: 10px;
    }
  }

  .result-table__button {
    min-width: 225px;
  }
}
</style>
