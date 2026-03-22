# Уровень 3: Actions — формы в React 19

## Введение

React 19 кардинально меняет подход к работе с формами. Вместо ручного управления состоянием через `useState` + `onSubmit`, теперь можно использовать **Actions** — функции, которые передаются напрямую в `<form action={fn}>`. Это упрощает код, улучшает UX и поддерживает прогрессивное улучшение.

---

## 1. Концепция Actions

### Что такое Action?

Action — это асинхронная функция, которая обрабатывает данные формы. В React 19 элемент `<form>` принимает проп `action`, в который можно передать такую функцию:

```tsx
async function handleSubmit(formData: FormData) {
  const name = formData.get('name') as string
  await saveToServer({ name })
}

function MyForm() {
  return (
    <form action={handleSubmit}>
      <input name="name" type="text" />
      <button type="submit">Отправить</button>
    </form>
  )
}
```

### Преимущества перед классическим подходом

| React 18 (классический)               | React 19 (Actions)                    |
| -------------------------------------- | ------------------------------------- |
| `onSubmit` + `e.preventDefault()`      | `action={fn}` — нет preventDefault    |
| Ручной `useState` для loading          | `isPending` из `useActionState`       |
| `e.target.elements` или ref для данных | `FormData` приходит автоматически     |
| Не работает без JS                     | Прогрессивное улучшение из коробки    |

---

## 2. `<form action={fn}>` — передача функции

### Синтаксис

```tsx
<form action={asyncFunction}>
```

Функция получает `FormData` как аргумент:

```tsx
async function myAction(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const result = await loginUser(email, password)
  // обработка результата...
}
```

### Важные особенности

- Форма автоматически сбрасывается после успешного выполнения action
- `FormData` содержит все поля с атрибутом `name`
- Можно использовать `formData.getAll('field')` для множественного выбора
- Не нужен `e.preventDefault()` — React делает это автоматически

---

## 3. `useActionState` — управление состоянием формы

### API

```tsx
import { useActionState } from 'react'

const [state, formAction, isPending] = useActionState(actionFn, initialState)
```

- **`state`** — текущее состояние (результат последнего вызова action)
- **`formAction`** — функция для передачи в `<form action={...}>`
- **`isPending`** — `true`, пока action выполняется

### Action-функция

```tsx
async function submitAction(
  previousState: FormState,
  formData: FormData
): Promise<FormState> {
  const name = formData.get('name') as string

  if (!name) {
    return { error: 'Имя обязательно', success: false }
  }

  await saveToServer({ name })
  return { error: null, success: true }
}
```

### Полный пример

```tsx
interface FormState {
  error: string | null
  success: boolean
}

const initialState: FormState = { error: null, success: false }

async function registerAction(prev: FormState, formData: FormData): Promise<FormState> {
  const email = formData.get('email') as string

  if (!email.includes('@')) {
    return { error: 'Некорректный email', success: false }
  }

  await fetch('/api/register', {
    method: 'POST',
    body: formData,
  })

  return { error: null, success: true }
}

function RegisterForm() {
  const [state, formAction, isPending] = useActionState(registerAction, initialState)

  return (
    <form action={formAction}>
      <input name="email" type="email" required />
      <button disabled={isPending}>
        {isPending ? 'Регистрация...' : 'Зарегистрироваться'}
      </button>
      {state.error && <p className="error">{state.error}</p>}
      {state.success && <p className="success">Успешно!</p>}
    </form>
  )
}
```

> **Важно:** `useActionState` заменяет `useFormState` из `react-dom` (canary). В стабильном React 19 используйте именно `useActionState` из `react`.

---

## 4. `useFormStatus` — статус формы в дочерних компонентах

### API

```tsx
import { useFormStatus } from 'react-dom'

const { pending, data, method, action } = useFormStatus()
```

- **`pending`** — `true`, пока форма отправляется
- **`data`** — `FormData` отправляемой формы (или `null`)
- **`method`** — HTTP-метод (`'get'` или `'post'`)
- **`action`** — ссылка на функцию action

### Ограничение

`useFormStatus` **должен** вызываться внутри компонента, который является дочерним элементом `<form>`:

```tsx
// Правильно — отдельный компонент внутри form
function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Отправка...' : 'Отправить'}
    </button>
  )
}

function MyForm() {
  return (
    <form action={myAction}>
      <input name="email" />
      <SubmitButton />   {/* SubmitButton — дочерний элемент form */}
    </form>
  )
}
```

```tsx
// Неправильно — вызов в том же компоненте, где form
function MyForm() {
  const { pending } = useFormStatus() // Не сработает!
  return <form action={myAction}>...</form>
}
```

---

## 5. Прогрессивное улучшение

React 19 Actions спроектированы для прогрессивного улучшения — формы работают даже без JavaScript:

```tsx
function ContactForm() {
  const [state, formAction] = useActionState(submitContact, initialState)

  return (
    <form action={formAction} method="post">
      <input type="hidden" name="source" value="contact-page" />
      <input name="name" type="text" required autoComplete="name" />
      <input name="email" type="email" required autoComplete="email" />
      <textarea name="message" required />
      <button type="submit">Отправить</button>
    </form>
  )
}
```

### Ключевые принципы

1. Используйте нативные элементы форм с атрибутом `name`
2. Добавляйте `hidden` inputs для дополнительных данных
3. Указывайте `method="post"` для совместимости
4. Используйте `autoComplete` для улучшения UX
5. Валидация через нативные атрибуты (`required`, `type="email"`, `min`, `max`)

---

## Резюме

| Инструмент       | Назначение                              |
| ---------------- | --------------------------------------- |
| `form action`    | Передача async-функции в форму          |
| `useActionState` | Состояние формы + isPending + валидация |
| `useFormStatus`  | Статус отправки в дочерних компонентах  |
| Progressive enh. | Работа формы без JavaScript             |
