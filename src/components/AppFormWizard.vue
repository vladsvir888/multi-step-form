<template>
  <form @submit="onSubmit" class="form" novalidate>
    <nav class="form__nav">
      <AppButton
        v-for="(tab, index) in tabs"
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
        <!-- Контактные данные -->
        <section class="form__block">
          <h2 class="form__block-title">
            {{ fieldset.personalData.title }}
          </h2>

          <!-- todo: директиву v-maska прокинуть только на инпут с телефоном -->
          <component
            v-for="(value, key) in fieldset.personalData.fields"
            :key="key"
            :is="value.component"
            v-bind="value.props"
            v-model="value.initialValue"
            v-maska
          />
        </section>
      </AppStep>

      <!-- Шаг 2 -->
      <AppStep :step-number="1" :current-step="currentStep">
        <!-- Тарифный план -->
        <section class="form__block">
          <h2 class="form__block-title">
            {{ fieldset.tariffPlan.title }}
          </h2>

          <component
            :is="fieldset.tariffPlan.component"
            v-bind="fieldset.tariffPlan.props"
            v-model="fieldset.tariffPlan.initialValue"
          />
        </section>

        <!-- Доп.услуги -->
        <section class="form__block">
          <h2 class="form__block-title">
            {{ fieldset.addServices.title }}
          </h2>

          <component
            v-for="(value, key) in fieldset.addServices.fields"
            :key="key"
            :is="value.component"
            v-bind="value.props"
            v-model="fieldset.addServices.initialValue"
          />
        </section>

        <!-- Адрес подключения -->
        <AppCollapse :header="fieldset.connectionAddress.title">
          <div class="form__block form__block--2">
            <component
              v-for="(value, key) in fieldset.connectionAddress.fields"
              :key="key"
              :is="value.component"
              v-bind="value.props"
              v-model="value.initialValue"
              v-on="value.handlers ?? {}"
            />
          </div>
        </AppCollapse>
      </AppStep>

      <AppStep :step-number="2" :current-step="currentStep">
        <!-- Паспортные данные -->
        <div class="form__block">
          <AppRadioGroup :label="fieldset.passportData.fields.resident.title">
            <div class="radio-group__wrapper">
              <component
                v-for="(value, key) in fieldset.passportData.fields.resident.fields"
                :key="key"
                :is="value.component"
                v-bind="value.props"
                v-model="fieldset.passportData.fields.resident.initialValue"
                v-on="value.handlers"
              />
            </div>
          </AppRadioGroup>

          <div class="form__block" v-show="isResidentBelarus === false">
            <component
              :is="fieldset.passportData.fields.citizenship.component"
              v-bind="fieldset.passportData.fields.citizenship.props"
              v-model="fieldset.passportData.fields.citizenship.initialValue"
            />

            <AppRadioGroup :label="fieldset.passportData.fields.temporaryRegistration.title">
              <div class="radio-group__wrapper">
                <component
                  v-for="(value, key) in fieldset.passportData.fields.temporaryRegistration.fields"
                  :key="key"
                  :is="value.component"
                  v-bind="value.props"
                  v-model="fieldset.passportData.fields.temporaryRegistration.initialValue"
                  v-on="value.handlers"
                />
              </div>
            </AppRadioGroup>
          </div>

          <div class="form__block">
            <template v-for="(value, key) in fieldset.passportData.fields" :key="key">
              <component
                v-if="isSpecialKey(key, ['resident', 'citizenship', 'temporaryRegistration'])"
                :is="value.component"
                v-bind="value.props"
                v-model="value.initialValue"
              />
            </template>
          </div>
        </div>

        <!-- Адрес регистрации -->
        <AppCollapse
          v-show="isTemporaryRegistration !== false"
          :header="fieldset.registrationAddress.title"
        >
          <component
            :is="fieldset.registrationAddress.fields.sameAsConnectionAddress.component"
            v-bind="fieldset.registrationAddress.fields.sameAsConnectionAddress.props"
            v-model="fieldset.registrationAddress.fields.sameAsConnectionAddress.initialValue"
            v-on="fieldset.registrationAddress.fields.sameAsConnectionAddress.handlers"
          />

          <div v-show="!isSameAsConnectionAddress" class="form__block form__block--2">
            <template v-for="(value, key) in fieldset.registrationAddress.fields" :key="key">
              <component
                v-if="isSpecialKey(key, ['sameAsConnectionAddress'])"
                :is="value.component"
                v-bind="value.props"
                v-model="value.initialValue"
                v-on="value.handlers ?? {}"
              />
            </template>
          </div>
        </AppCollapse>

        <!-- Ваш менеджер -->
        <section class="form__block">
          <h2 class="form__block-title">{{ fieldset.manager.title }}</h2>

          <component
            :is="fieldset.manager.component"
            v-bind="fieldset.manager.props"
            v-model="fieldset.manager.initialValue"
          />
        </section>

        <!-- Иные пожелания -->
        <section class="form__block">
          <h2 class="form__block-title">{{ fieldset.otherWishes.title }}</h2>

          <component
            :is="fieldset.otherWishes.component"
            v-bind="fieldset.otherWishes.props"
            v-model="fieldset.otherWishes.initialValue"
          />
        </section>

        <!-- Согласие с политикой -->
        <component
          :is="fieldset.privacyPolicy.component"
          v-bind="fieldset.privacyPolicy.props"
          v-model="fieldset.privacyPolicy.initialValue"
        />
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
</template>

<script setup>
import '@/utils/locale.js'
import { computed, markRaw, ref, onMounted, onUnmounted, watch } from 'vue'
import { useForm } from 'vee-validate'
import { string, object, date, boolean } from 'yup'
import { vMaska } from 'maska'
import AppInput from '@/components/AppInput.vue'
import AppButton from '@/components/AppButton.vue'
import AppStep from '@/components/AppStep.vue'
import AppSelect from '@/components/AppSelect.vue'
import AppCheckbox from '@/components/AppCheckbox.vue'
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
  endDateMessages,
  privacyPolicyMessages
} from '@/utils/messages.js'

// emits
const emit = defineEmits(['change-text', 'get-result-data'])

// props
const props = defineProps({
  isSuccessfullSubmit: {
    type: Boolean
  }
})

// ref
const currentStep = ref(0)
const isResidentBelarus = ref(null)
const isTemporaryRegistration = ref(null)
const isDisabledConnectionAddressStreetSelect = ref(false)
const isDisabledConnectionAddressRoomSelect = ref(false)
const isDisabledRegistrationAddressStreetSelect = ref(false)
const isDisabledRegistrationAddressRoomSelect = ref(false)
const isSameAsConnectionAddress = ref(null)
const tabs = ref(['Личные данные', 'Заказ', 'Паспортные данные'])
const texts = ref([
  '<p><b>Не уверены, какой тариф лучше выбрать?</b></p><p>Обратитесь за консультацией в контакт-центр по телефону <b>174</b>.</p>',
  'В этом разделе вам нужно выбрать желаемый тариф и указать адрес подключения.',
  '<p>Введите, пожалуйста, паспортные данные и адрес регистрации.</p><p>Корректное и подробное заполнение поможет ускорить процесс подключения и устранить возможные ошибки.</p>'
])
const fieldset = ref({
  personalData: {
    title: 'Ваши контакты',
    fields: {
      surname: {
        component: markRaw(AppInput),
        props: {
          name: 'personalData.contacts.surname',
          label: 'Фамилия',
          required: true
        },
        initialValue: ''
      },
      name: {
        component: markRaw(AppInput),
        props: {
          name: 'personalData.contacts.name',
          label: 'Имя',
          required: true
        },
        initialValue: ''
      },
      patronymic: {
        component: markRaw(AppInput),
        props: {
          name: 'personalData.contacts.patronymic',
          label: 'Отчество',
          required: true
        },
        initialValue: ''
      },
      phone: {
        component: markRaw(AppInput),
        props: {
          name: 'personalData.contacts.phone',
          label: 'Номер телефона',
          placeholder: '+375',
          mask: '+375 (##) ###-##-##',
          type: 'tel',
          required: true
        },
        initialValue: ''
      },
      email: {
        component: markRaw(AppInput),
        props: {
          name: 'personalData.contacts.email',
          label: 'Адрес электронной почты',
          placeholder: 'test-email@gmail.com',
          type: 'email',
          required: true
        },
        initialValue: ''
      }
    }
  },
  tariffPlan: {
    title: 'Тарифный план',
    component: markRaw(AppSelect),
    props: {
      name: 'order.tariffPlan',
      label: 'Выберите тарифный план',
      placeholder: 'Выберите тарифный план',
      options: [
        'iDOM100+Megogo, 25,50 руб./мес.',
        'Мой бизнес PRO 100, 43 руб./мес.',
        'Мой бизнес PRO 80, 25,50 руб./мес.'
      ]
    },
    initialValue: ''
  },
  addServices: {
    title: 'Дополнительные услуги',
    fields: {
      router: {
        component: markRaw(AppCheckbox),
        props: {
          name: 'order.addServices',
          label: 'Маршрутизатор (Роутер)',
          labelAdd: '0р./Мес.',
          helpText:
            'Сетевое оборудование будет подобрано под ваши потребности. Ряд моделей доступны за дополнительную плату.',
          checkedValue: 'Маршрутизатор (Роутер)'
        }
      },
      staticIPAddress: {
        component: markRaw(AppCheckbox),
        props: {
          name: 'order.addServices',
          label: 'Статический IP-адрес',
          labelAdd: '4,20 руб./мес.',
          helpText:
            'Позволяет присвоить абоненту постоянный IP-адрес. Для выхода в интернет этот адрес не используется.',
          checkedValue: 'Статический IP-адрес'
        }
      }
    },
    initialValue: []
  },
  connectionAddress: {
    title: 'Адрес подключения',
    fields: {
      postalCode: {
        component: markRaw(AppInput),
        props: {
          name: 'order.connectionAddress.postalCode',
          label: 'Индекс'
        },
        initialValue: ''
      },
      region: {
        component: markRaw(AppSelect),
        props: {
          name: 'order.connectionAddress.region',
          label: 'Область',
          placeholder: 'Выберите область',
          options: [
            'Брестская область',
            'Витебская область',
            'Гомельская область',
            'Гродненская область',
            'Минская область',
            'Могилевская область'
          ]
        },
        initialValue: ''
      },
      settlementType: {
        component: markRaw(AppSelect),
        props: {
          name: 'order.connectionAddress.settlementType',
          label: 'Тип населенного пункта',
          placeholder: 'Выберите тип населенного пункта',
          options: ['Город', 'Поселок городского типа', 'Сельский населенный пункт']
        },
        initialValue: ''
      },
      settlement: {
        component: markRaw(AppSelect),
        props: {
          name: 'order.connectionAddress.settlement',
          label: 'Населенный пункт',
          placeholder: 'Выберите населенный пункт',
          options: [
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
          ],
          filter: true
        },
        initialValue: ''
      },
      streetType: {
        component: markRaw(AppSelect),
        props: {
          name: 'order.connectionAddress.streetType',
          label: 'Тип улицы',
          placeholder: 'Выберите тип улицы',
          options: [
            'Центральная улица',
            'Жилые улицы',
            'Промышленные улицы',
            'Торговые улицы',
            'Туристические улицы'
          ]
        },
        initialValue: ''
      },
      street: {
        component: markRaw(AppSelect),
        props: {
          name: 'order.connectionAddress.street',
          label: 'Улица',
          placeholder: 'Выберите улицу',
          options: ['Центральная', 'Молодежная', 'Садовая', 'Лесная', 'Полевая'],
          filter: true,
          disabled: isDisabledConnectionAddressStreetSelect
        },
        initialValue: ''
      },
      noStreet: {
        component: markRaw(AppCheckbox),
        props: {
          name: 'order.connectionAddress.noStreet',
          label: 'В адресе отсутствует название улицы',
          checkedValue: true
        },
        handlers: {
          change: () => {
            isDisabledConnectionAddressStreetSelect.value =
              !isDisabledConnectionAddressStreetSelect.value

            if (isDisabledConnectionAddressStreetSelect.value) {
              setFieldValue('order.connectionAddress.street', 'В адресе отсутствует название улицы')
            } else {
              setFieldValue('order.connectionAddress.street', '')
            }
          }
        },
        initialValue: false
      },
      house: {
        component: markRaw(AppInput),
        props: {
          inputWrapperClassName: 'form__block-control',
          name: 'order.connectionAddress.house',
          label: 'Дом',
          placeholder: '51В'
        },
        initialValue: ''
      },
      building: {
        component: markRaw(AppInput),
        props: {
          inputWrapperClassName: 'form__block-control',
          name: 'order.connectionAddress.building',
          label: 'Корпус / Строение',
          placeholder: '1'
        },
        initialValue: ''
      },
      typeRoom: {
        component: markRaw(AppSelect),
        props: {
          name: 'order.connectionAddress.typeRoom',
          label: 'Тип помещения',
          placeholder: 'Выберите тип помещения',
          options: ['Офис', 'Квартира']
        },
        initialValue: ''
      },
      room: {
        component: markRaw(AppInput),
        props: {
          name: 'order.connectionAddress.room',
          label: 'Помещение',
          placeholder: '196',
          disabled: isDisabledConnectionAddressRoomSelect
        },
        initialValue: ''
      },
      noRoom: {
        component: markRaw(AppCheckbox),
        props: {
          name: 'order.connectionAddress.noRoom',
          label: 'Это единое строение, помещения нет',
          checkedValue: true
        },
        handlers: {
          change: () => {
            isDisabledConnectionAddressRoomSelect.value =
              !isDisabledConnectionAddressRoomSelect.value

            if (isDisabledConnectionAddressRoomSelect.value) {
              setFieldValue('order.connectionAddress.room', 'Это единое строение, помещения нет')
            } else {
              setFieldValue('order.connectionAddress.room', '')
            }
          }
        },
        initialValue: false
      },
      addressCommentary: {
        component: markRaw(AppInput),
        props: {
          name: 'order.connectionAddress.addressCommentary',
          label: 'Комментарий по адресу',
          placeholder: '3 этаж, справа от входа',
          tag: 'textarea',
          rows: '5'
        },
        initialValue: ''
      }
    }
  },
  passportData: {
    fields: {
      resident: {
        title: 'Являетесь ли Вы резидентом Республики Беларусь?',
        fields: {
          yes: {
            component: markRaw(AppRadioButton),
            props: {
              name: 'passportData.passportData.resident',
              label: 'Да',
              checkedValue: 'Да'
            },
            handlers: {
              change: () => {
                isResidentBelarus.value = true
                setValues({
                  passportData: {
                    passportData: {
                      citizenship: '',
                      temporaryRegistration: ''
                    }
                  }
                })
              }
            }
          },
          no: {
            component: markRaw(AppRadioButton),
            props: {
              name: 'passportData.passportData.resident',
              label: 'Нет',
              checkedValue: 'Нет'
            },
            handlers: {
              change: () => (isResidentBelarus.value = false)
            }
          }
        },
        initialValue: ''
      },
      citizenship: {
        component: markRaw(AppInput),
        props: {
          name: 'passportData.passportData.citizenship',
          label: 'Гражданство',
          placeholder: 'Испания'
        },
        initialValue: ''
      },
      temporaryRegistration: {
        title: 'Есть ли у вас временная регистрация?',
        fields: {
          yes: {
            component: markRaw(AppRadioButton),
            props: {
              name: 'passportData.passportData.temporaryRegistration',
              label: 'Да',
              checkedValue: 'Да'
            },
            handlers: {
              change: () => (isTemporaryRegistration.value = true)
            }
          },
          no: {
            component: markRaw(AppRadioButton),
            props: {
              name: 'passportData.passportData.temporaryRegistration',
              label: 'Нет',
              checkedValue: 'Нет'
            },
            handlers: {
              change: () => (isTemporaryRegistration.value = false)
            }
          }
        },
        initialValue: ''
      },
      documentType: {
        component: markRaw(AppSelect),
        props: {
          name: 'passportData.passportData.documentType',
          label: 'Вид документа',
          placeholder: 'Выберите вид документа',
          options: ['Паспорт', 'Удостоверение']
        },
        initialValue: ''
      },
      series: {
        component: markRaw(AppInput),
        props: {
          name: 'passportData.passportData.series',
          label: 'Серия',
          placeholder: 'MP'
        },
        initialValue: ''
      },
      number: {
        component: markRaw(AppInput),
        props: {
          name: 'passportData.passportData.number',
          label: 'Номер паспорта',
          placeholder: '2024468'
        },
        initialValue: ''
      },
      dateOfIssue: {
        component: markRaw(AppInput),
        props: {
          name: 'passportData.passportData.dateOfIssue',
          label: 'Дата выдачи паспорта',
          type: 'date'
        }
        // initialValue: ''
      },
      dateOfExpiry: {
        component: markRaw(AppInput),
        props: {
          name: 'passportData.passportData.dateOfExpiry',
          label: 'Срок действия паспорта',
          type: 'date'
        }
        // initialValue: ''
      },
      identificationNumber: {
        component: markRaw(AppInput),
        props: {
          name: 'passportData.passportData.identificationNumber',
          label: 'Идентификационный номер'
        },
        initialValue: ''
      },
      passportIssuedBy: {
        component: markRaw(AppInput),
        props: {
          name: 'passportData.passportData.passportIssuedBy',
          label: 'Кем выдан паспорт',
          placeholder: 'Московским РУВД'
        },
        initialValue: ''
      }
    }
  },
  registrationAddress: {
    title: 'Адрес регистрации',
    fields: {
      sameAsConnectionAddress: {
        component: markRaw(AppCheckbox),
        props: {
          name: 'passportData.registrationAddress.sameAsConnectionAddress',
          label: 'Совпадает с адресом подключения',
          checkedValue: true
        },
        handlers: {
          change: () => {
            isSameAsConnectionAddress.value = !isSameAsConnectionAddress.value
            isDisabledRegistrationAddressStreetSelect.value = true
            isDisabledRegistrationAddressRoomSelect.value = true

            setValues({
              passportData: {
                registrationAddress: values.order.connectionAddress
              }
            })
          }
        },
        initialValue: false
      },
      postalCode: {
        component: markRaw(AppInput),
        props: {
          name: 'passportData.registrationAddress.postalCode',
          label: 'Индекс'
        },
        initialValue: ''
      },
      region: {
        component: markRaw(AppSelect),
        props: {
          name: 'passportData.registrationAddress.region',
          label: 'Область',
          placeholder: 'Выберите область',
          options: [
            'Брестская область',
            'Витебская область',
            'Гомельская область',
            'Гродненская область',
            'Минская область',
            'Могилевская область'
          ]
        },
        initialValue: ''
      },
      settlementType: {
        component: markRaw(AppSelect),
        props: {
          name: 'passportData.registrationAddress.settlementType',
          label: 'Тип населенного пункта',
          placeholder: 'Выберите тип населенного пункта',
          options: ['Город', 'Поселок городского типа', 'Сельский населенный пункт']
        },
        initialValue: ''
      },
      settlement: {
        component: markRaw(AppSelect),
        props: {
          name: 'passportData.registrationAddress.settlement',
          label: 'Населенный пункт',
          placeholder: 'Выберите населенный пункт',
          options: [
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
          ],
          filter: true
        },
        initialValue: ''
      },
      streetType: {
        component: markRaw(AppSelect),
        props: {
          name: 'passportData.registrationAddress.streetType',
          label: 'Тип улицы',
          placeholder: 'Выберите тип улицы',
          options: [
            'Центральная улица',
            'Жилые улицы',
            'Промышленные улицы',
            'Торговые улицы',
            'Туристические улицы'
          ]
        },
        initialValue: ''
      },
      street: {
        component: markRaw(AppSelect),
        props: {
          name: 'passportData.registrationAddress.street',
          label: 'Улица',
          placeholder: 'Выберите улицу',
          options: ['Центральная', 'Молодежная', 'Садовая', 'Лесная', 'Полевая'],
          filter: true,
          disabled: isDisabledRegistrationAddressStreetSelect
        },
        initialValue: ''
      },
      noStreet: {
        component: markRaw(AppCheckbox),
        props: {
          name: 'passportData.registrationAddress.noStreet',
          label: 'В адресе отсутствует название улицы',
          checkedValue: true
        },
        handlers: {
          change: () => {
            isDisabledRegistrationAddressStreetSelect.value =
              !isDisabledRegistrationAddressStreetSelect.value

            if (isDisabledRegistrationAddressStreetSelect.value) {
              setFieldValue(
                'order.registrationAddress.street',
                'В адресе отсутствует название улицы'
              )
            } else {
              setFieldValue('order.registrationAddress.street', '')
            }
          }
        },
        initialValue: false
      },
      house: {
        component: markRaw(AppInput),
        props: {
          inputWrapperClassName: 'form__block-control',
          name: 'passportData.registrationAddress.house',
          label: 'Дом',
          placeholder: '51В'
        },
        initialValue: ''
      },
      building: {
        component: markRaw(AppInput),
        props: {
          inputWrapperClassName: 'form__block-control',
          name: 'passportData.registrationAddress.building',
          label: 'Корпус / Строение',
          placeholder: '1'
        },
        initialValue: ''
      },
      typeRoom: {
        component: markRaw(AppSelect),
        props: {
          name: 'passportData.registrationAddress.typeRoom',
          label: 'Тип помещения',
          placeholder: 'Выберите тип помещения',
          options: ['Офис', 'Квартира']
        },
        initialValue: ''
      },
      room: {
        component: markRaw(AppInput),
        props: {
          name: 'passportData.registrationAddress.room',
          label: 'Помещение',
          placeholder: '196',
          disabled: isDisabledRegistrationAddressRoomSelect
        },
        initialValue: ''
      },
      noRoom: {
        component: markRaw(AppCheckbox),
        props: {
          name: 'passportData.registrationAddress.noRoom',
          label: 'Это единое строение, помещения нет',
          checkedValue: true
        },
        handlers: {
          change: () => {
            isDisabledRegistrationAddressRoomSelect.value =
              !isDisabledRegistrationAddressRoomSelect.value

            if (isDisabledRegistrationAddressRoomSelect.value) {
              setFieldValue('order.registrationAddress.room', 'Это единое строение, помещения нет')
            } else {
              setFieldValue('order.registrationAddress.room', '')
            }
          }
        },
        initialValue: false
      },
      addressCommentary: {
        component: markRaw(AppInput),
        props: {
          name: 'passportData.registrationAddress.addressCommentary',
          label: 'Комментарий по адресу',
          placeholder: '3 этаж, справа от входа',
          tag: 'textarea',
          rows: '5'
        },
        initialValue: ''
      }
    }
  },
  manager: {
    title: 'Ваш менеджер',
    component: markRaw(AppSelect),
    props: {
      name: 'passportData.manager',
      options: ['Да', 'Нет']
    },
    initialValue: ''
  },
  otherWishes: {
    title: 'Иные пожелания',
    component: markRaw(AppInput),
    props: {
      label: 'Комментарий',
      name: 'passportData.otherWishes',
      tag: 'textarea',
      rows: '5'
    },
    initialValue: ''
  },
  privacyPolicy: {
    component: markRaw(AppCheckbox),
    props: {
      label: 'Я ознакомился(-лась) с Политикой конфиденциальности',
      name: 'passportData.privacyPolicy',
      required: true,
      checkedValue: true
    },
    initialValue: true
  }
})

// validation schema
// todo: динамическая схема
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
      // false почему-то считается валидным, поэтому доп.проверка через oneOf
      privacyPolicy: boolean().required().oneOf([true], privacyPolicyMessages)
    })
  })
]

// computed
const currentSchema = computed(() => {
  return schemas[currentStep.value]
})

const isFirstStep = computed(() => {
  return currentStep.value === 0
})

const isLastStep = computed(() => {
  return currentStep.value === schemas.length - 1
})

const { handleSubmit, meta, setValues, setFieldValue, values, resetForm } = useForm({
  validationSchema: currentSchema
})

// watchers
// watch(
//   () => props.isSuccessfullSubmit,
//   () => resetForm()
// )

// handlers
const emitChangedText = () => {
  emit('change-text', texts.value[currentStep.value])
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
    if (values.passportData.registrationAddress.sameAsConnectionAddress) {
      // https://vee-validate.logaretm.com/v4/guide/composition-api/handling-forms/#form-values
      values.passportData.registrationAddress = {
        sameAsConnectionAddress: 'Совпадает с адресом подключения'
      }
    }

    values.passportData.privacyPolicy = undefined
    emit('get-result-data', values)

    return
  }

  currentStep.value += 1

  emitChangedText()
})

const isSpecialKey = (key, keys) => {
  if (keys.includes(key)) {
    return false
  }

  return true
}

// todo: лучше реализовать работу через localStorage
const onBeforeUnload = (event) => {
  event.preventDefault()
  event.returnValue = ''
}

// lifecycle hooks
onMounted(() => {
  window.addEventListener('beforeunload', onBeforeUnload)

  emitChangedText()
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

  .form__block {
    display: grid;
    gap: 20px;
  }

  .form__block--2 {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));

    > *:not(.form__block-control) {
      grid-column: span 2;

      @media (width <= 600px) {
        grid-column: unset;
      }
    }

    @media (width <= 600px) {
      grid-template-columns: 1fr;
    }
  }

  .form__block-title {
    font-size: 21px;
    line-height: 1.33;
    font-weight: 600;
  }

  .form__buttons {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 10px 20px;
    margin-top: 40px;

    @media (width <= 600px) {
      flex-direction: column;
      width: 100%;
      margin-top: 20px;

      > * {
        width: 100%;
      }
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
