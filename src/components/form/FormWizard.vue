<template>
  <form class="grid" novalidate @submit="onSubmit" @reset="handleReset">
    <FormNav
      :current-step="state.currentStep"
      :meta="meta"
      @change-step="onClickNavButton($event)"
    />

    <div class="laptop:max-w-[400px]">
      <FormStep :step-number="0" :current-step="state.currentStep">
        <FormContacts :data="fieldset.personalData" />
      </FormStep>

      <FormStep :step-number="1" :current-step="state.currentStep">
        <FormTariffPlan :data="fieldset.tariffPlan" />

        <FormAddServices :data="fieldset.addServices" />

        <UICollapse :header="fieldset.connectionAddress.title">
          <FormConnectionAddress :data="fieldset.connectionAddress" />
        </UICollapse>
      </FormStep>

      <FormStep :step-number="2" :current-step="state.currentStep">
        <FormPassport
          :data="fieldset.passportData"
          :is-resident-belarus="state.isResidentBelarus"
        />

        <UICollapse
          v-show="state.isTemporaryRegistration === undefined || state.isTemporaryRegistration"
          :header="fieldset.registrationAddress.title"
        >
          <FormRegistration
            :data="fieldset.registrationAddress"
            :is-same-as-connection-address="state.isSameAsConnectionAddress"
          />
        </UICollapse>

        <FormManager :data="fieldset.manager" />

        <FormOtherWishes :data="fieldset.otherWishes" />

        <component
          :is="fieldset.privacyPolicy.component"
          v-bind="fieldset.privacyPolicy.props"
          v-model="fieldset.privacyPolicy.initialValue"
        />
      </FormStep>
    </div>

    <FormButtons
      :meta="meta"
      :is-first-step="isFirstStep"
      :is-last-step="isLastStep"
      @go-back="onClickPreviousButton"
    />
  </form>
</template>

<script setup>
import '@/utils/locale.js'
import { computed, markRaw, ref, onMounted, watch, provide, reactive } from 'vue'
import { useForm } from 'vee-validate'
import { string, object, date, boolean, ref as yup_ref } from 'yup'
import UIInput from '@/components/UI/UIInput.vue'
import FormStep from '@/components/form/FormStep.vue'
import FormNav from '@/components/form/FormNav.vue'
import FormContacts from '@/components/form/FormContacts.vue'
import FormTariffPlan from '@/components/form/FormTariffPlan.vue'
import FormAddServices from '@/components/form/FormAddServices.vue'
import FormConnectionAddress from '@/components/form/FormConnectionAddress.vue'
import FormPassport from '@/components/form/FormPassport.vue'
import FormOtherWishes from '@/components/form/FormOtherWishes.vue'
import FormManager from '@/components/form/FormManager.vue'
import FormRegistration from '@/components/form/FormRegistration.vue'
import FormButtons from '@/components/form/FormButtons.vue'
import UISelect from '@/components/UI/UISelect.vue'
import UICheckbox from '@/components/UI/UICheckbox.vue'
import UIRadioButton from '@/components/UI/UIRadioButton.vue'
import UICollapse from '@/components/UI/UICollapse.vue'
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
  privacyPolicyMessages,
  keyInLocalStorage
} from '@/utils/constants.js'
import scrollUp from '@/utils/scrollUp'
import { getItemInLocalStorage, setItemInLocalStorage } from '@/utils/localStorage'

const emit = defineEmits(['change-text', 'summary-data'])

const props = defineProps({
  responseData: {
    type: Object
  }
})

const defaultState = {
  currentStep: 0,
  isDisabledConnectionAddressStreetSelect: false,
  isDisabledConnectionAddressRoomSelect: false,
  isResidentBelarus: undefined,
  isTemporaryRegistration: undefined,
  isDisabledRegistrationAddressStreetSelect: false,
  isDisabledRegistrationAddressRoomSelect: false,
  isSameAsConnectionAddress: undefined
}
const state = reactive({
  ...defaultState
})

const fieldset = ref({
  personalData: {
    title: 'Ваши контакты',
    fields: {
      surname: {
        component: markRaw(UIInput),
        props: {
          name: 'personalData.contacts.surname',
          label: 'Фамилия',
          required: true
        },
        initialValue: ''
      },
      name: {
        component: markRaw(UIInput),
        props: {
          name: 'personalData.contacts.name',
          label: 'Имя',
          required: true
        },
        initialValue: ''
      },
      patronymic: {
        component: markRaw(UIInput),
        props: {
          name: 'personalData.contacts.patronymic',
          label: 'Отчество',
          required: true
        },
        initialValue: ''
      },
      phone: {
        component: markRaw(UIInput),
        props: {
          name: 'personalData.contacts.phone',
          label: 'Номер телефона',
          placeholder: '+375',
          mask: '+375 (##) ###-##-##',
          type: 'text',
          required: true
        },
        initialValue: ''
      },
      email: {
        component: markRaw(UIInput),
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
    component: markRaw(UISelect),
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
        component: markRaw(UICheckbox),
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
        component: markRaw(UICheckbox),
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
        component: markRaw(UIInput),
        props: {
          name: 'order.connectionAddress.postalCode',
          label: 'Индекс'
        },
        initialValue: ''
      },
      region: {
        component: markRaw(UISelect),
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
        component: markRaw(UISelect),
        props: {
          name: 'order.connectionAddress.settlementType',
          label: 'Тип населенного пункта',
          placeholder: 'Выберите тип населенного пункта',
          options: ['Город', 'Поселок городского типа', 'Сельский населенный пункт']
        },
        initialValue: ''
      },
      settlement: {
        component: markRaw(UISelect),
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
        component: markRaw(UISelect),
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
        component: markRaw(UISelect),
        props: {
          name: 'order.connectionAddress.street',
          label: 'Улица',
          placeholder: 'Выберите улицу',
          options: ['Центральная', 'Молодежная', 'Садовая', 'Лесная', 'Полевая'],
          filter: true,
          disabled: computed(() => state.isDisabledConnectionAddressStreetSelect)
        },
        initialValue: ''
      },
      noStreet: {
        component: markRaw(UICheckbox),
        props: {
          name: 'order.connectionAddress.noStreet',
          label: 'В адресе отсутствует название улицы',
          checkedValue: true
        },
        handlers: {
          change: () => {
            state.isDisabledConnectionAddressStreetSelect =
              !state.isDisabledConnectionAddressStreetSelect

            if (state.isDisabledConnectionAddressStreetSelect) {
              setFieldValue('order.connectionAddress.street', 'В адресе отсутствует название улицы')
            } else {
              setFieldValue('order.connectionAddress.street', '')
            }

            setItemInLocalStorage(keyInLocalStorage, {
              ...getItemInLocalStorage(keyInLocalStorage),
              isDisabledConnectionAddressStreetSelect: state.isDisabledConnectionAddressStreetSelect
            })
          }
        },
        initialValue: false
      },
      house: {
        component: markRaw(UIInput),
        props: {
          inputWrapperClassName: 'form-block__control',
          name: 'order.connectionAddress.house',
          label: 'Дом',
          placeholder: '51В'
        },
        initialValue: ''
      },
      building: {
        component: markRaw(UIInput),
        props: {
          inputWrapperClassName: 'form-block__control',
          name: 'order.connectionAddress.building',
          label: 'Корпус / Строение',
          placeholder: '1'
        },
        initialValue: ''
      },
      typeRoom: {
        component: markRaw(UISelect),
        props: {
          name: 'order.connectionAddress.typeRoom',
          label: 'Тип помещения',
          placeholder: 'Выберите тип помещения',
          options: ['Офис', 'Квартира']
        },
        initialValue: ''
      },
      room: {
        component: markRaw(UIInput),
        props: {
          name: 'order.connectionAddress.room',
          label: 'Помещение',
          placeholder: '196',
          disabled: computed(() => state.isDisabledConnectionAddressRoomSelect)
        },
        initialValue: ''
      },
      noRoom: {
        component: markRaw(UICheckbox),
        props: {
          name: 'order.connectionAddress.noRoom',
          label: 'Это единое строение, помещения нет',
          checkedValue: true
        },
        handlers: {
          change: () => {
            state.isDisabledConnectionAddressRoomSelect =
              !state.isDisabledConnectionAddressRoomSelect

            if (state.isDisabledConnectionAddressRoomSelect) {
              setFieldValue('order.connectionAddress.room', 'Это единое строение, помещения нет')
            } else {
              setFieldValue('order.connectionAddress.room', '')
            }

            setItemInLocalStorage(keyInLocalStorage, {
              ...getItemInLocalStorage(keyInLocalStorage),
              isDisabledConnectionAddressRoomSelect: state.isDisabledConnectionAddressRoomSelect
            })
          }
        },
        initialValue: false
      },
      addressCommentary: {
        component: markRaw(UIInput),
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
            component: markRaw(UIRadioButton),
            props: {
              name: 'passportData.passportData.resident',
              label: 'Да',
              checkedValue: 'Да'
            },
            handlers: {
              change: () => {
                state.isResidentBelarus = true

                setValues({
                  passportData: {
                    passportData: {
                      citizenship: '',
                      temporaryRegistration: ''
                    }
                  }
                })

                setItemInLocalStorage(keyInLocalStorage, {
                  ...getItemInLocalStorage(keyInLocalStorage),
                  isResidentBelarus: state.isResidentBelarus
                })
              }
            }
          },
          no: {
            component: markRaw(UIRadioButton),
            props: {
              name: 'passportData.passportData.resident',
              label: 'Нет',
              checkedValue: 'Нет'
            },
            handlers: {
              change: () => {
                state.isResidentBelarus = false

                setItemInLocalStorage(keyInLocalStorage, {
                  ...getItemInLocalStorage(keyInLocalStorage),
                  isResidentBelarus: state.isResidentBelarus
                })
              }
            }
          }
        },
        initialValue: ''
      },
      citizenship: {
        component: markRaw(UIInput),
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
            component: markRaw(UIRadioButton),
            props: {
              name: 'passportData.passportData.temporaryRegistration',
              label: 'Да',
              checkedValue: 'Да'
            },
            handlers: {
              change: () => {
                state.isTemporaryRegistration = true

                setItemInLocalStorage(keyInLocalStorage, {
                  ...getItemInLocalStorage(keyInLocalStorage),
                  isTemporaryRegistration: state.isTemporaryRegistration
                })
              }
            }
          },
          no: {
            component: markRaw(UIRadioButton),
            props: {
              name: 'passportData.passportData.temporaryRegistration',
              label: 'Нет',
              checkedValue: 'Нет'
            },
            handlers: {
              change: () => {
                state.isTemporaryRegistration = false
                state.isSameAsConnectionAddress = false

                setValues({
                  passportData: {
                    registrationAddress: undefined
                  }
                })

                setItemInLocalStorage(keyInLocalStorage, {
                  ...getItemInLocalStorage(keyInLocalStorage),
                  isTemporaryRegistration: state.isTemporaryRegistration,
                  isSameAsConnectionAddress: state.isSameAsConnectionAddress
                })
              }
            }
          }
        },
        initialValue: ''
      },
      documentType: {
        component: markRaw(UISelect),
        props: {
          name: 'passportData.passportData.documentType',
          label: 'Вид документа',
          placeholder: 'Выберите вид документа',
          options: ['Паспорт', 'Удостоверение']
        },
        initialValue: ''
      },
      series: {
        component: markRaw(UIInput),
        props: {
          name: 'passportData.passportData.series',
          label: 'Серия',
          placeholder: 'MP'
        },
        initialValue: ''
      },
      number: {
        component: markRaw(UIInput),
        props: {
          name: 'passportData.passportData.number',
          label: 'Номер паспорта',
          placeholder: '2024468'
        },
        initialValue: ''
      },
      dateOfIssue: {
        component: markRaw(UIInput),
        props: {
          name: 'passportData.passportData.dateOfIssue',
          label: 'Дата выдачи паспорта',
          type: 'date'
        }
        // initialValue: ''
      },
      dateOfExpiry: {
        component: markRaw(UIInput),
        props: {
          name: 'passportData.passportData.dateOfExpiry',
          label: 'Срок действия паспорта',
          type: 'date'
        }
        // initialValue: ''
      },
      identificationNumber: {
        component: markRaw(UIInput),
        props: {
          name: 'passportData.passportData.identificationNumber',
          label: 'Идентификационный номер'
        },
        initialValue: ''
      },
      passportIssuedBy: {
        component: markRaw(UIInput),
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
        component: markRaw(UICheckbox),
        props: {
          name: 'passportData.registrationAddress.sameAsConnectionAddress',
          label: 'Совпадает с адресом подключения',
          checkedValue: true
        },
        handlers: {
          change: () => {
            state.isSameAsConnectionAddress = !state.isSameAsConnectionAddress

            setItemInLocalStorage(keyInLocalStorage, {
              ...getItemInLocalStorage(keyInLocalStorage),
              isSameAsConnectionAddress: state.isSameAsConnectionAddress
            })
          }
        },
        initialValue: false
      },
      postalCode: {
        component: markRaw(UIInput),
        props: {
          name: 'passportData.registrationAddress.postalCode',
          label: 'Индекс'
        },
        initialValue: ''
      },
      region: {
        component: markRaw(UISelect),
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
        component: markRaw(UISelect),
        props: {
          name: 'passportData.registrationAddress.settlementType',
          label: 'Тип населенного пункта',
          placeholder: 'Выберите тип населенного пункта',
          options: ['Город', 'Поселок городского типа', 'Сельский населенный пункт']
        },
        initialValue: ''
      },
      settlement: {
        component: markRaw(UISelect),
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
        component: markRaw(UISelect),
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
        component: markRaw(UISelect),
        props: {
          name: 'passportData.registrationAddress.street',
          label: 'Улица',
          placeholder: 'Выберите улицу',
          options: ['Центральная', 'Молодежная', 'Садовая', 'Лесная', 'Полевая'],
          filter: true,
          disabled: computed(() => state.isDisabledRegistrationAddressStreetSelect)
        },
        initialValue: ''
      },
      noStreet: {
        component: markRaw(UICheckbox),
        props: {
          name: 'passportData.registrationAddress.noStreet',
          label: 'В адресе отсутствует название улицы',
          checkedValue: true
        },
        handlers: {
          change: () => {
            state.isDisabledRegistrationAddressStreetSelect =
              !state.isDisabledRegistrationAddressStreetSelect

            if (state.isDisabledRegistrationAddressStreetSelect) {
              setFieldValue(
                'passportData.registrationAddress.street',
                'В адресе отсутствует название улицы'
              )
            } else {
              setFieldValue('passportData.registrationAddress.street', '')
            }

            setItemInLocalStorage(keyInLocalStorage, {
              ...getItemInLocalStorage(keyInLocalStorage),
              isDisabledRegistrationAddressStreetSelect:
                state.isDisabledRegistrationAddressStreetSelect
            })
          }
        },
        initialValue: false
      },
      house: {
        component: markRaw(UIInput),
        props: {
          inputWrapperClassName: 'form-block__control',
          name: 'passportData.registrationAddress.house',
          label: 'Дом',
          placeholder: '51В'
        },
        initialValue: ''
      },
      building: {
        component: markRaw(UIInput),
        props: {
          inputWrapperClassName: 'form-block__control',
          name: 'passportData.registrationAddress.building',
          label: 'Корпус / Строение',
          placeholder: '1'
        },
        initialValue: ''
      },
      typeRoom: {
        component: markRaw(UISelect),
        props: {
          name: 'passportData.registrationAddress.typeRoom',
          label: 'Тип помещения',
          placeholder: 'Выберите тип помещения',
          options: ['Офис', 'Квартира']
        },
        initialValue: ''
      },
      room: {
        component: markRaw(UIInput),
        props: {
          name: 'passportData.registrationAddress.room',
          label: 'Помещение',
          placeholder: '196',
          disabled: computed(() => state.isDisabledRegistrationAddressRoomSelect)
        },
        initialValue: ''
      },
      noRoom: {
        component: markRaw(UICheckbox),
        props: {
          name: 'passportData.registrationAddress.noRoom',
          label: 'Это единое строение, помещения нет',
          checkedValue: true
        },
        handlers: {
          change: () => {
            state.isDisabledRegistrationAddressRoomSelect =
              !state.isDisabledRegistrationAddressRoomSelect

            if (state.isDisabledRegistrationAddressRoomSelect) {
              setFieldValue(
                'passportData.registrationAddress.room',
                'Это единое строение, помещения нет'
              )
            } else {
              setFieldValue('passportData.registrationAddress.room', '')
            }

            setItemInLocalStorage(keyInLocalStorage, {
              ...getItemInLocalStorage(keyInLocalStorage),
              isDisabledRegistrationAddressRoomSelect: state.isDisabledRegistrationAddressRoomSelect
            })
          }
        },
        initialValue: false
      },
      addressCommentary: {
        component: markRaw(UIInput),
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
    component: markRaw(UISelect),
    props: {
      name: 'passportData.manager',
      options: ['Да', 'Нет']
    },
    initialValue: ''
  },
  otherWishes: {
    title: 'Иные пожелания',
    component: markRaw(UIInput),
    props: {
      label: 'Комментарий',
      name: 'passportData.otherWishes',
      tag: 'textarea',
      rows: '5'
    },
    initialValue: ''
  },
  privacyPolicy: {
    component: markRaw(UICheckbox),
    props: {
      label: 'Я ознакомился(-лась) с Политикой конфиденциальности',
      name: 'passportData.privacyPolicy',
      required: true,
      checkedValue: true
    },
    initialValue: true
  }
})

const useSchema = (state) => {
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
          dateOfExpiry: date().min(yup_ref('dateOfIssue'), endDateMessages)
        }),
        registrationAddress: addressSchema,
        privacyPolicy: boolean().required().oneOf([true], privacyPolicyMessages)
      })
    })
  ]

  const currentSchema = computed(() => {
    return schemas[state.currentStep]
  })

  return {
    schemas,
    currentSchema
  }
}
const { schemas, currentSchema } = useSchema(state)

const useStep = (state, schemas) => {
  const isFirstStep = computed(() => {
    return state.currentStep === 0
  })

  const isLastStep = computed(() => {
    return state.currentStep === schemas.length - 1
  })

  return {
    isFirstStep,
    isLastStep
  }
}
const { isFirstStep, isLastStep } = useStep(state, schemas)

const { handleSubmit, meta, setValues, setFieldValue, values, handleReset } = useForm({
  validationSchema: currentSchema
})

const texts = [
  '<p><b>Не уверены, какой тариф лучше выбрать?</b></p><p>Обратитесь за консультацией в контакт-центр по телефону <b>174</b>.</p>',
  'В этом разделе вам нужно выбрать желаемый тариф и указать адрес подключения.',
  '<p>Введите, пожалуйста, паспортные данные и адрес регистрации.</p><p>Корректное и подробное заполнение поможет ускорить процесс подключения и устранить возможные ошибки.</p>'
]
const changeText = () => {
  emit('change-text', texts[state.currentStep])
}

const updateDataInLocalStorage = () => {
  setItemInLocalStorage(keyInLocalStorage, {
    ...getItemInLocalStorage(keyInLocalStorage),
    data: values
  })
}
const updateAllDataInLocalStorage = () => {
  setItemInLocalStorage(keyInLocalStorage, {
    data: values,
    ...state
  })
}
provide('updateDataInLocalStorage', updateDataInLocalStorage)

const onClickNavButton = (value) => {
  if (!meta.value.valid) return

  state.currentStep = value

  changeText()
  updateAllDataInLocalStorage()
}
const onClickPreviousButton = () => {
  state.currentStep -= 1

  changeText()
  scrollUp()
  updateAllDataInLocalStorage()
}

const onSuccessSubmit = (values) => {
  scrollUp()

  if (isLastStep.value) {
    if (values.passportData?.registrationAddress?.sameAsConnectionAddress) {
      values.passportData.registrationAddress = {
        sameAsConnectionAddress: 'Совпадает с адресом подключения'
      }
    }

    values.passportData.privacyPolicy = undefined

    emit('summary-data', values)

    setItemInLocalStorage(keyInLocalStorage, {
      ...getItemInLocalStorage(keyInLocalStorage),
      summaryData: values
    })
  } else {
    state.currentStep += 1

    changeText()
    updateAllDataInLocalStorage()
  }
}
const onSubmit = handleSubmit(onSuccessSubmit)

watch(
  () => props.responseData,
  () => {
    Object.assign(state, defaultState)
    handleReset()
    updateAllDataInLocalStorage()
  }
)

const init = () => {
  const data = getItemInLocalStorage(keyInLocalStorage)

  if (!data) {
    updateAllDataInLocalStorage()
  } else {
    for (const key in data) {
      if (key in state) {
        state[key] = data[key]
      }
    }

    setValues(data.data, false)
  }

  if (data?.summaryData) {
    emit('summary-data', data.summaryData)
  }

  changeText()
}
onMounted(init)
</script>
