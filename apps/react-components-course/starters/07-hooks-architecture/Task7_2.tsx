import { useLanguage } from 'src/hooks'

// ============================================
// Task 7.2: useForm — form as state
// Задание 7.2: useForm — форма как состояние
// ============================================
//
// Implement the useForm<T> hook for form state management.
// The RegistrationForm component should be a pure rendering layer:
// all validation and update logic — in the hook.
//
// Реализуйте хук useForm<T> для управления состоянием формы.
// Компонент RegistrationForm должен быть чистым слоем рендеринга:
// вся логика валидации и обновления — в хуке.
//
// Form state includes:
//   values   — current field values
//   errors   — validation errors (only for touched fields)
//   touched  — fields the user has interacted with (onBlur)
//   isSubmitting — submission in progress
//
// Состояние формы включает:
//   values   — текущие значения полей
//   errors   — ошибки валидации (только для touched полей)
//   touched  — поля, которых касался пользователь (onBlur)
//   isSubmitting — идёт ли отправка

// TODO: Define form state type
// TODO: Определите тип состояния формы
// interface FormState<T> {
//   values: T
//   errors: Partial<Record<keyof T, string>>
//   touched: Partial<Record<keyof T, boolean>>
//   isSubmitting: boolean
// }

// TODO: Define validator function type
// TODO: Определите тип функции-валидатора
// type Validator<T> = (values: T) => Partial<Record<keyof T, string>>

// TODO: Implement useForm<T>(initialValues, validate?)
// TODO: Реализуйте useForm<T>(initialValues, validate?)
// Returns:
// Возвращает:
//   values, errors, touched, isSubmitting
//   handleChange(field, value) — updates value, validates if field is touched
//   handleChange(field, value) — обновляет значение, валидирует если поле touched
//   handleBlur(field)         — marks as touched, validates the field
//   handleBlur(field)         — помечает как touched, валидирует поле
//   handleSubmit(onSubmit)    — returns form event handler
//   handleSubmit(onSubmit)    — возвращает обработчик события формы
//     → calls e.preventDefault()
//     → вызывает e.preventDefault()
//     → marks ALL fields as touched
//     → помечает ВСЕ поля как touched
//     → runs full validation
//     → запускает полную валидацию
//     → if no errors — calls onSubmit(values), manages isSubmitting
//     → если ошибок нет — вызывает onSubmit(values), управляет isSubmitting
//   reset() — returns form to initial state
//   reset() — возвращает форму в исходное состояние
// function useForm<T extends Record<string, unknown>>(
//   initialValues: T,
//   validate?: Validator<T>
// ) { ... }

// TODO: Define registration form data type
// TODO: Определите тип данных формы регистрации
// interface RegistrationValues {
//   name: string
//   email: string
//   password: string
// }

// TODO: Implement validation function
// TODO: Реализуйте функцию валидации
// Rules: name — required, minimum 2 characters
// Правила: имя — обязательно, минимум 2 символа
//          email — required, must contain '@'
//          email — обязателен, должен содержать '@'
//          password — required, minimum 6 characters
//          пароль — обязателен, минимум 6 символов

// TODO: Implement RegistrationForm component using useForm
// TODO: Реализуйте компонент RegistrationForm используя useForm
// - Three fields: name, email, password
// - Три поля: name, email, password
// - Errors shown only if touched[field] === true
// - Ошибки показываются только если touched[field] === true
// - Submit button: disabled during isSubmitting
// - Кнопка отправки: disabled во время isSubmitting
// - On success: show message and reset form
// - При успешной отправке: показать сообщение и сбросить форму

export function Task7_2() {
  const { t } = useLanguage()

  // TODO: Initialize useForm with initialValues and validate
  // TODO: Инициализируйте useForm с initialValues и validate
  // const form = useForm<RegistrationValues>(initialValues, validateRegistration)

  return (
    <div className="exercise-container">
      <h2>{t('task.title')} 7.2</h2>

      {/* TODO: Show success message after submission */}
      {/* TODO: Покажите сообщение об успехе после отправки */}

      {/* TODO: Implement the form */}
      {/* TODO: Реализуйте форму */}
      {/* <form onSubmit={form.handleSubmit(async (values) => { ... })}> */}

        {/* TODO: "Name" field */}
        {/* TODO: Поле "Имя" */}
        {/* <input value={form.values.name} onChange={...} onBlur={...} /> */}
        {/* {form.touched.name && form.errors.name && <div>{form.errors.name}</div>} */}

        {/* TODO: "Email" field */}
        {/* TODO: Поле "Email" */}

        {/* TODO: "Password" field */}
        {/* TODO: Поле "Пароль" */}

        {/* TODO: "Register" button (disabled when isSubmitting) and "Reset" */}
        {/* TODO: Кнопки "Зарегистрироваться" (disabled при isSubmitting) и "Сброс" */}
      {/* </form> */}
    </div>
  )
}
