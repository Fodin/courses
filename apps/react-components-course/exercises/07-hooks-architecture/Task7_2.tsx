import { useLanguage } from 'src/hooks'

// ============================================
// Задание 7.2: useForm — форма как состояние
// ============================================
//
// Реализуйте хук useForm<T> для управления состоянием формы.
// Компонент RegistrationForm должен быть чистым слоем рендеринга:
// вся логика валидации и обновления — в хуке.
//
// Состояние формы включает:
//   values   — текущие значения полей
//   errors   — ошибки валидации (только для touched полей)
//   touched  — поля, которых касался пользователь (onBlur)
//   isSubmitting — идёт ли отправка

// TODO: Определите тип состояния формы
// interface FormState<T> {
//   values: T
//   errors: Partial<Record<keyof T, string>>
//   touched: Partial<Record<keyof T, boolean>>
//   isSubmitting: boolean
// }

// TODO: Определите тип функции-валидатора
// type Validator<T> = (values: T) => Partial<Record<keyof T, string>>

// TODO: Реализуйте useForm<T>(initialValues, validate?)
// Возвращает:
//   values, errors, touched, isSubmitting
//   handleChange(field, value) — обновляет значение, валидирует если поле touched
//   handleBlur(field)         — помечает как touched, валидирует поле
//   handleSubmit(onSubmit)    — возвращает обработчик события формы
//     → вызывает e.preventDefault()
//     → помечает ВСЕ поля как touched
//     → запускает полную валидацию
//     → если ошибок нет — вызывает onSubmit(values), управляет isSubmitting
//   reset() — возвращает форму в исходное состояние
// function useForm<T extends Record<string, unknown>>(
//   initialValues: T,
//   validate?: Validator<T>
// ) { ... }

// TODO: Определите тип данных формы регистрации
// interface RegistrationValues {
//   name: string
//   email: string
//   password: string
// }

// TODO: Реализуйте функцию валидации
// Правила: имя — обязательно, минимум 2 символа
//          email — обязателен, должен содержать '@'
//          пароль — обязателен, минимум 6 символов

// TODO: Реализуйте компонент RegistrationForm используя useForm
// - Три поля: name, email, password
// - Ошибки показываются только если touched[field] === true
// - Кнопка отправки: disabled во время isSubmitting
// - При успешной отправке: показать сообщение и сбросить форму

export function Task7_2() {
  const { t } = useLanguage()

  // TODO: Инициализируйте useForm с initialValues и validate
  // const form = useForm<RegistrationValues>(initialValues, validateRegistration)

  return (
    <div className="exercise-container">
      <h2>{t('task.title')} 7.2</h2>

      {/* TODO: Покажите сообщение об успехе после отправки */}

      {/* TODO: Реализуйте форму */}
      {/* <form onSubmit={form.handleSubmit(async (values) => { ... })}> */}

        {/* TODO: Поле "Имя" */}
        {/* <input value={form.values.name} onChange={...} onBlur={...} /> */}
        {/* {form.touched.name && form.errors.name && <div>{form.errors.name}</div>} */}

        {/* TODO: Поле "Email" */}

        {/* TODO: Поле "Пароль" */}

        {/* TODO: Кнопки "Зарегистрироваться" (disabled при isSubmitting) и "Сброс" */}
      {/* </form> */}
    </div>
  )
}
