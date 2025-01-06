<template>
  <section
    class="max-w-[920px] mx-auto my-0 laptop:py-[37px] py-[25px] laptop:px-[50px] px-[25px] bg-white rounded-lg grid gap-y-7 shadow-[0_40px_40px_#0000000d]"
  >
    <div
      class="fixed top-0 left-0 right-0 -z-[1] h-[739px] [clip-path:polygon(100%_0%,0%_0%,0%_100%)] bg-result-table-gradient"
    />
    <div class="max-w-[400px]">
      <h1 class="uppercase text-[24px] leading-[1.21]">
        ЗАЯВКА НА ПОДКЛЮЧЕНИЕ ИНТЕРНЕТА «ДЕЛОВОЙ СЕТИ»
      </h1>
      <div class="mt-5 [&>:not(:last-child)]:mb-4">
        <p>Пожалуйста, проверьте правильность заполненной информации.</p>
        <p>
          Если информация верна – нажмите "Отправить". Если вы хотите внести изменения – нажмите
          "Вернуться к редактированию".
        </p>
      </div>
    </div>
    <div>
      <template v-for="(blockValue, blockKey) in data" :key="blockKey">
        <div
          v-if="checkValues(blockValue)"
          class="grid grid-cols-1 laptop:grid-cols-[1fr_536px] gap-7 py-6 laptop:py-12 border-0 border-b border-solid border-[#e4e4e4]"
        >
          <h2
            class="uppercase text-[24px] leading-[1.21] laptop:sticky laptop:top-5 laptop:self-start"
          >
            {{ resultTableDictionary[blockKey] }}
          </h2>
          <div>
            <template v-for="(contentValue, contentKey) in blockValue" :key="contentKey">
              <div v-if="checkValues(contentValue)" class="py-[30px] first:pt-0 last:pb-0">
                <h3 class="mb-6 text-[18px] leading-6 font-bold">
                  {{ resultTableDictionary[contentKey] }}
                </h3>
                <template v-if="isString(contentValue)">
                  <div class="grid gap-4">
                    <div class="grid grid-cols-1 tablet:grid-cols-2 gap-[10px]">
                      <div class="text-scorpion">
                        {{ resultTableDictionary[contentKey] }}
                      </div>
                      <div>
                        {{ contentValue }}
                      </div>
                    </div>
                  </div>
                </template>
                <template v-else-if="isArray(contentValue)">
                  <div class="grid gap-4">
                    <div
                      v-for="arrayValue in contentValue"
                      :key="arrayValue"
                      class="grid grid-cols-1 tablet:grid-cols-2 gap-[10px]"
                    >
                      {{ arrayValue }}
                    </div>
                  </div>
                </template>
                <template v-else-if="isObject(contentValue)">
                  <dl class="grid gap-4">
                    <template v-for="(valueObj, valueKey) in contentValue" :key="valueKey">
                      <div
                        v-if="checkValues(valueObj)"
                        class="grid grid-cols-1 tablet:grid-cols-2 gap-[10px]"
                      >
                        <dt class="text-scorpion">
                          {{ resultTableDictionary[valueKey] }}
                        </dt>
                        <dd>
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
    <div class="flex justify-end gap-2 tablet:gap-5 flex-col tablet:flex-row">
      <UIButton class="min-w-[225px]" variant="secondary" :disabled="isLoading" @click="resetData"
        >Вернуться к редактированию</UIButton
      >
      <UIButton class="min-w-[225px]" variant="primary" :disabled="isLoading" @click="fetchData"
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
