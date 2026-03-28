# Уровень 11: Производительность

## Введение

React Hook Form изначально спроектирован для высокой производительности благодаря uncontrolled
подходу. Однако неправильное использование `watch`, отсутствие мемоизации и неверная конфигурация
могут привести к лишним ререндерам. В этом уровне вы научитесь оптимизировать формы для максимальной
производительности.

---

## Проблемы watch()

`watch()` без аргументов подписывается на **все** изменения формы и вызывает ререндер всего
компонента при каждом нажатии клавиши:

```tsx
// ❌ Плохо: ререндер при ЛЮБОМ изменении ЛЮБОГО поля
function SlowForm() {
  const { register, watch } = useForm()
  const values = watch() // Подписка на все поля
  console.log('Render!', values)

  return (
    <form>
      <input {...register('name')} />
      <input {...register('email')} />
      <input {...register('bio')} />
      {/* Каждый символ в любом поле = ререндер всей формы */}
    </form>
  )
}
```

---

## useWatch для отдельных полей

`useWatch` -- это хук, который подписывается только на указанные поля. Это позволяет изолировать
ререндеры:

```tsx
import { useWatch } from 'react-hook-form'

function OptimizedForm() {
  const { control, register } = useForm()

  // Подписка только на одно поле
  const name = useWatch({
    control,
    name: 'name',
    defaultValue: '',
  })

  return (
    <div>
      <input {...register('name')} />
      <input {...register('email')} /> {/* Не вызывает ререндер */}
      <div>Вы ввели: {name}</div>
    </div>
  )
}
```

### watch vs useWatch

| `watch()`                        | `useWatch()`                       |
| -------------------------------- | ---------------------------------- |
| Подписка на все поля             | Подписка на конкретные поля        |
| Ререндер всей формы             | Ререндер только подписанных частей |
| Можно указать имя, но в хуке    | Изолированные подписки             |
| Удобно для быстрого прототипа   | Лучше для продакшена               |

---

## Мемоизация компонентов

Вынесите части формы в отдельные компоненты с `memo` и `useWatch`, чтобы изолировать ререндеры:

```tsx
import { memo } from 'react'
import { useWatch } from 'react-hook-form'

const PriceDisplay = memo(({ control }: { control: any }) => {
  const price = useWatch({ control, name: 'price' })
  console.log('PriceDisplay render') // Только при изменении price
  return <div>Цена: {price}</div>
})

const NameDisplay = memo(({ control }: { control: any }) => {
  const name = useWatch({ control, name: 'name' })
  console.log('NameDisplay render') // Только при изменении name
  return <div>Имя: {name}</div>
})

function MyForm() {
  const { control, register } = useForm()

  return (
    <form>
      <input {...register('name')} />
      <input {...register('price', { valueAsNumber: true })} />
      <input {...register('description')} /> {/* Не влияет на display-компоненты */}

      <NameDisplay control={control} />
      <PriceDisplay control={control} />
    </form>
  )
}
```

---

## shouldUnregister

По умолчанию `shouldUnregister: false` -- поля остаются зарегистрированными даже после
размонтирования компонента. Это значит, что их значения сохраняются в форме:

```tsx
// По умолчанию false -- поля регистрируются навсегда
const { register } = useForm({ shouldUnregister: false })

// true -- поля unregister при размонтировании
const { register } = useForm({ shouldUnregister: true })

// Для conditional полей shouldUnregister: true часто лучше
{showEmail && <input {...register('email')} />}
// При shouldUnregister: true -- email удаляется из данных при скрытии
// При shouldUnregister: false -- email остаётся в данных
```

### Когда использовать shouldUnregister: true?

- ✅ Условные поля, которые не нужны в итоговых данных
- ✅ Wizard-формы, где шаги могут убираться
- ✅ Уменьшение размера отправляемых данных

### Когда оставить false (по умолчанию)?

- ✅ Данные нужно сохранять между скрытием/показом поля
- ✅ Tab-формы, где пользователь переключается между вкладками

---

## delayError

Опция `delayError` задерживает отображение ошибок на указанное количество миллисекунд. Это улучшает
UX при `mode: 'onChange'`, потому что пользователь не видит мелькающие ошибки во время набора:

```tsx
const {
  register,
  formState: { errors },
} = useForm({
  mode: 'onChange',
  delayError: 500, // Ошибка появится через 500ms после прекращения ввода
})
```

Без `delayError` при `mode: 'onChange'` пользователь увидит ошибку "Минимум 6 символов" уже после
первого введённого символа. С `delayError: 500` ошибка появится только если пользователь перестал
печатать на 500ms.

> 📌 **Когда использовать:** `delayError` полезен в сочетании с `mode: 'onChange'` или `mode: 'all'`.
> При `mode: 'onBlur'` или `mode: 'onSubmit'` в нём нет необходимости.

```tsx
// Типичная комбинация для лучшего UX
const { register } = useForm({
  mode: 'onChange',
  delayError: 300,
})
```

---

## Оптимизация ре-рендеров: итоговое сравнение

```tsx
// ❌ Медленно: watch всех полей
const allValues = watch()

// ✅ Быстро: useWatch для конкретных полей
const email = useWatch({ name: 'email', control })
const password = useWatch({ name: 'password', control })

// ✅ Очень быстро: memo + useWatch в отдельном компоненте
const MemoizedField = memo(({ control, name }) => {
  const value = useWatch({ control, name })
  return <div>{value}</div>
})
```

### Чеклист оптимизации

- [ ] Заменить `watch()` без аргументов на `useWatch` с конкретными полями
- [ ] Вынести зависимые от значений UI-элементы в отдельные `memo`-компоненты
- [ ] Использовать `shouldUnregister: true` для условных полей, если данные не нужны после скрытия
- [ ] Добавить `delayError` при `mode: 'onChange'` для предотвращения мерцания ошибок
- [ ] Не подписываться на `formState` свойства, которые не используются

---

## ⚠️ Частые ошибки новичков

### ❌ Ошибка 1: watch() вместо useWatch

```tsx
// ❌ Неправильно -- watch всех полей
const values = watch()
console.log('Render', values)

// ✅ Правильно -- useWatch для отдельных полей
const name = useWatch({ name: 'name', control })
```

**Почему это ошибка:** `watch()` подписывается на все изменения формы, вызывая ререндер всего
компонента при каждом нажатии клавиши в любом поле.

---

### ❌ Ошибка 2: useWatch без control

```tsx
// ❌ Может работать, но ненадёжно
const name = useWatch({ name: 'name' })

// ✅ Правильно -- передаём control
const { control } = useForm()
const name = useWatch({ name: 'name', control })
```

**Почему это ошибка:** Без `control` `useWatch` пытается использовать контекст `FormProvider`. Если
его нет, поведение может быть непредсказуемым.

---

### ❌ Ошибка 3: Тяжёлые вычисления в компоненте формы

```tsx
// ❌ Неправильно -- пересчёт при каждом ререндере
function Form() {
  const { register, watch } = useForm()
  const items = watch('items')
  const total = items?.reduce((sum, item) => sum + item.price * item.qty, 0) // На каждый ререндер!

  return <div>Total: {total}</div>
}

// ✅ Правильно -- вынести в memo-компонент
const TotalDisplay = memo(({ control }) => {
  const items = useWatch({ control, name: 'items' })
  const total = items?.reduce((sum, item) => sum + item.price * item.qty, 0)
  return <div>Total: {total}</div>
})
```

**Почему это ошибка:** Вычисления выполняются при каждом ререндере формы, даже если изменилось другое
поле. Вынос в `memo`-компонент с `useWatch` изолирует пересчёт.

---

## 📚 Дополнительные ресурсы

- [useWatch документация](https://react-hook-form.com/docs/usewatch)
- [shouldUnregister](https://react-hook-form.com/docs/useform#shouldUnregister)
- [delayError](https://react-hook-form.com/docs/useform#delayError)
- [Performance tips](https://react-hook-form.com/advanced-usage#FormProviderPerformance)
