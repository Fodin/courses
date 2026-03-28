# Уровень 9: Состояние формы

## Введение

React Hook Form предоставляет богатый набор состояний формы через `formState`. Понимание dirty,
touched, reset и связанных методов позволяет создавать формы, которые адекватно реагируют на действия
пользователя -- показывают изменения, сбрасываются при необходимости и отслеживают успешность
отправки.

---

## Dirty и Touched состояния

### Что такое Dirty и Touched?

| Состояние | Описание            | Когда меняется            |
| --------- | ------------------- | ------------------------- |
| `dirty`   | Поле было изменено  | При изменении значения    |
| `touched` | Поле было затронуто | При потере фокуса (blur)  |
| `isDirty` | Форма была изменена | При изменении любого поля |

### Получение состояния

```tsx
function MyForm() {
  const {
    register,
    formState: {
      dirtyFields, // Какие поля изменены
      touchedFields, // Какие поля затронуты
      isDirty, // Форма изменена
      isSubmitted, // Форма отправлена
    },
  } = useForm()

  return (
    <form>
      <input {...register('name')} />

      <div>Dirty: {dirtyFields.name ? '✅' : '❌'}</div>
      <div>Touched: {touchedFields.name ? '✅' : '❌'}</div>
      <div>Форма изменена: {isDirty ? 'Да' : 'Нет'}</div>
    </form>
  )
}
```

### Практическое применение

```tsx
// Показывать ошибку только после того, как поле затронуто
<input {...register('email', { required: 'Обязательно' })} />
{touchedFields.email && errors.email && (
  <span className="error">{errors.email.message}</span>
)}

// Или показывать только если поле изменено и невалидно
{dirtyFields.email && errors.email && (
  <span className="error">{errors.email.message}</span>
)}
```

---

## getFieldState()

Метод `getFieldState` позволяет получить состояние отдельного поля: `isDirty`, `isTouched` и
`error`. Это удобно, когда нужно проверить состояние поля императивно (например, в обработчике
событий).

```tsx
const { getFieldState, formState } = useForm({
  defaultValues: { email: '', name: '' },
})

// Получить состояние поля
const { isDirty, isTouched, invalid, error } = getFieldState('email', formState)

console.log(isDirty) // true, если поле было изменено
console.log(isTouched) // true, если поле потеряло фокус
console.log(invalid) // true, если поле невалидно
console.log(error) // объект ошибки или undefined
```

> ⚠️ **Важно:** Второй аргумент `formState` обязателен. Без него RHF не сможет отследить подписку
> на состояние, и компонент не будет ререндериться при изменениях.

```tsx
// ❌ Неправильно -- без formState компонент не обновится
const { isDirty } = getFieldState('email')

// ✅ Правильно -- передаём formState
const { isDirty } = getFieldState('email', formState)
```

---

## Визуальные индикаторы изменений

```tsx
<input
  {...register('name')}
  style={{
    borderColor: dirtyFields.name
      ? (errors.name ? '#dc3545' : '#28a745')
      : '#ddd',
  }}
/>
```

Пример с кнопкой сброса отдельного поля:

```tsx
<div style={{ display: 'flex', gap: '0.5rem' }}>
  <input {...register('email')} />
  {getFieldState('email', formState).isDirty && (
    <button type="button" onClick={() => resetField('email')}>
      Сбросить
    </button>
  )}
</div>
```

---

## Reset и defaultValues

### Установка default values

```tsx
// При инициализации
const { register } = useForm({
  defaultValues: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
  },
})
```

### Метод reset()

```tsx
const { reset } = useForm()

// Сброс к default values
reset()

// Сброс с новыми значениями
reset({
  firstName: 'Jane',
  lastName: 'Smith',
})

// С опциями
reset(values, {
  keepErrors: false, // Сохранить ошибки
  keepDirty: false, // Сохранить dirty состояние
  keepValues: false, // Сохранить значения
  keepDefaultValues: false,
  keepIsSubmitted: false,
  keepTouched: false,
  keepIsValid: false,
  keepSubmitCount: false,
})
```

### resetField() -- сброс конкретного поля

`resetField` позволяет сбросить одно конкретное поле, не затрагивая остальную форму:

```tsx
const { resetField } = useForm({
  defaultValues: { email: 'user@example.com', name: 'John' },
})

// Сброс к defaultValue
resetField('email') // email вернётся к 'user@example.com'

// Сброс к новому значению
resetField('email', { defaultValue: 'new@example.com' })

// С опциями -- сохранить dirty/touched/error состояние
resetField('email', {
  keepDirty: true,
  keepTouched: true,
  keepError: true,
  defaultValue: '',
})
```

> 📌 **Разница между `reset` и `resetField`:** `reset` сбрасывает всю форму и все её состояния.
> `resetField` работает точечно -- сбрасывает только указанное поле.

---

## isSubmitSuccessful

`isSubmitSuccessful` -- свойство `formState`, которое становится `true` после того, как `onSubmit`
выполнился без ошибок. Удобный способ показать success-сообщение или сбросить форму:

```tsx
const {
  handleSubmit,
  reset,
  formState: { isSubmitSuccessful },
} = useForm()

// Показать сообщение об успехе
{isSubmitSuccessful && (
  <div role="status">Форма успешно отправлена!</div>
)}

// Сброс формы после успешной отправки
useEffect(() => {
  if (isSubmitSuccessful) {
    reset()
  }
}, [isSubmitSuccessful, reset])
```

> ⚠️ **Подводный камень:** Если `onSubmit` выбросит исключение, `isSubmitSuccessful` останется
> `false`. Если вы делаете API-запросы в `onSubmit`, убедитесь что ошибки обрабатываются корректно.

### Отслеживание изменений

```tsx
const { watch, reset, formState: { isDirty } } = useForm()

// Кнопка сброса активна только если форма изменена
<button type="button" onClick={() => reset()} disabled={!isDirty}>
  Сбросить
</button>
```

---

## ⚠️ Частые ошибки новичков

### ❌ Ошибка 1: Деструктуризация не из formState

```tsx
// ❌ Неправильно -- деструктуризация напрямую из useForm
const { errors, isDirty, isValid } = useForm()

// ✅ Правильно -- из formState
const {
  formState: { errors, isDirty, isValid },
} = useForm()
```

**Почему это ошибка:** `formState` -- это Proxy-объект, который отслеживает подписки. Прямая
деструктуризация ломает эту систему -- компонент не будет ререндериться при изменении состояния.

---

### ❌ Ошибка 2: reset без defaultValues

```tsx
// ❌ Неправильно -- reset без начальных значений
const { reset } = useForm()
reset()

// ✅ Правильно -- с defaultValues
const { reset } = useForm({
  defaultValues: { name: '', email: '' },
})
reset()
```

**Почему это ошибка:** Без `defaultValues` форма не знает, к каким значениям сбрасывать. Кроме того,
`isDirty` не будет корректно работать без базовых значений для сравнения.

---

### ❌ Ошибка 3: Игнорирование touchedFields

```tsx
// ❌ Неправильно -- показывать ошибку сразу
{errors.email && <span className="error">{errors.email.message}</span>}

// ✅ Правильно -- после касания
{touchedFields.email && errors.email && (
  <span className="error">{errors.email.message}</span>
)}
```

**Почему это ошибка:** Пользователь видит ошибку до того, как закончил ввод, что ухудшает UX.
Особенно заметно при `mode: 'onChange'`.

---

### ❌ Ошибка 4: getFieldState без formState

```tsx
// ❌ Неправильно -- без formState компонент не обновится
const { isDirty } = getFieldState('email')

// ✅ Правильно -- передаём formState
const { isDirty } = getFieldState('email', formState)
```

**Почему это ошибка:** Без второго аргумента RHF не может создать подписку на изменения, и
`isDirty`/`isTouched` всегда будут иметь начальные значения.

---

## 📚 Дополнительные ресурсы

- [formState документация](https://react-hook-form.com/docs/useform/formstate)
- [reset документация](https://react-hook-form.com/docs/useform/reset)
- [resetField документация](https://react-hook-form.com/docs/useform/resetfield)
- [getFieldState документация](https://react-hook-form.com/docs/useform/getfieldstate)
