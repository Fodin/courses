# Уровень 6: Сложные поля -- Controller, Radio, Select, Checkbox

## Введение

Не все поля формы можно зарегистрировать через `register`. Для сторонних UI-компонентов и кастомных
инпутов используется `Controller`. В этом уровне вы научитесь работать с Controller, radio-кнопками,
select и checkbox -- как одиночными, так и множественными.

---

## Controller

### Что такое Controller?

**Controller** -- это компонент React Hook Form для интеграции контролируемых компонентов с формой.

**Когда использовать Controller:**

- ✅ Сторонние UI-компоненты (Material-UI, Ant Design, Chakra UI)
- ✅ Кастомные компоненты инпутов
- ✅ Компоненты, которые не принимают `ref`

### Базовое использование

```tsx
import { Controller, useForm } from 'react-hook-form'
import Select from 'react-select'

function MyForm() {
  const { control } = useForm()

  return (
    <Controller
      name="category"
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Select
          {...field}
          options={[
            { value: 'electronics', label: 'Электроника' },
            { value: 'clothing', label: 'Одежда' },
          ]}
        />
      )}
    />
  )
}
```

### render vs children

```tsx
// Вариант 1: render prop
<Controller
  name="category"
  control={control}
  render={({ field, fieldState }) => (
    <Select {...field} />
  )}
/>

// Вариант 2: children (то же самое)
<Controller
  name="category"
  control={control}
>
  {({ field, fieldState }) => (
    <Select {...field} />
  )}
</Controller>
```

### Все параметры render

```tsx
<Controller
  name="category"
  control={control}
  render={({
    field, // { onChange, onBlur, value, name, ref }
    fieldState, // { invalid, isTouched, isDirty, error }
    formState, // { errors, isSubmitting, isValid }
  }) => <Select {...field} onChange={selected => field.onChange(selected?.value)} />}
/>
```

### Пример: кастомный TextField

```tsx
// Кастомный компонент
function TextField({ label, error, ...props }: any) {
  return (
    <div className="form-group">
      {label && <label>{label}</label>}
      <input style={{ borderColor: error ? '#dc3545' : '#ddd' }} {...props} />
      {error && <span className="error">{error}</span>}
    </div>
  )
}

// Использование с Controller
<Controller
  name="email"
  control={control}
  render={({ field, fieldState: { error } }) => (
    <TextField {...field} label="Email" error={error?.message} />
  )}
/>
```

---

## Radio кнопки

Radio-кнопки регистрируются через `register` с одинаковым именем и разными `value`:

```tsx
import { useForm } from 'react-hook-form'

function RadioForm() {
  const { register, handleSubmit } = useForm()

  const onSubmit = (data: any) => {
    console.log('Gender:', data.gender) // 'male' | 'female' | 'other'
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>
          <input type="radio" value="male" {...register('gender')} />
          Мужской
        </label>
        <label>
          <input type="radio" value="female" {...register('gender')} />
          Женский
        </label>
        <label>
          <input type="radio" value="other" {...register('gender')} />
          Другой
        </label>
      </div>
      <button type="submit">Отправить</button>
    </form>
  )
}
```

---

## Select (выпадающий список)

### Базовый select

```tsx
function SelectForm() {
  const { register, handleSubmit } = useForm()

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <select {...register('country')}>
        <option value="">Выберите страну</option>
        <option value="us">USA</option>
        <option value="ru">Россия</option>
        <option value="de">Germany</option>
      </select>
      <button type="submit">Отправить</button>
    </form>
  )
}
```

### Select с валидацией

```tsx
<select
  {...register('country', {
    required: 'Выберите страну',
  })}
>
  <option value="">Выберите страну</option>
  <option value="us">USA</option>
  <option value="ru">Россия</option>
</select>
{errors.country && <span className="error">{errors.country.message}</span>}
```

---

## Checkbox

### Одиночный checkbox (boolean)

```tsx
function SingleCheckbox() {
  const { register, handleSubmit } = useForm()

  const onSubmit = (data: any) => {
    console.log('Agree:', data.agree) // true | false
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>
        <input type="checkbox" {...register('agree')} />
        Я согласен с правилами
      </label>
      <button type="submit">Отправить</button>
    </form>
  )
}
```

### Множественный выбор (массив)

```tsx
function MultiCheckbox() {
  const { register, watch, setValue, handleSubmit } = useForm()

  const skills = watch('skills') || []

  const handleSkillChange = (skill: string, checked: boolean) => {
    if (checked) {
      setValue('skills', [...skills, skill])
    } else {
      setValue(
        'skills',
        skills.filter(s => s !== skill)
      )
    }
  }

  const onSubmit = (data: any) => {
    console.log('Skills:', data.skills) // ['react', 'typescript']
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>
          <input
            type="checkbox"
            value="react"
            checked={skills.includes('react')}
            onChange={e => handleSkillChange('react', e.target.checked)}
          />
          React
        </label>
        <label>
          <input
            type="checkbox"
            value="vue"
            checked={skills.includes('vue')}
            onChange={e => handleSkillChange('vue', e.target.checked)}
          />
          Vue
        </label>
        <label>
          <input
            type="checkbox"
            value="angular"
            checked={skills.includes('angular')}
            onChange={e => handleSkillChange('angular', e.target.checked)}
          />
          Angular
        </label>
      </div>
      <button type="submit">Отправить</button>
    </form>
  )
}
```

### С валидацией (минимум один выбран)

```tsx
const schema = z.object({
  skills: z.array(z.string()).min(1, 'Выберите хотя бы один навык'),
})
```

---

## ⚠️ Частые ошибки новичков

### ❌ Ошибка 1: Controller без control

```tsx
// ❌ Неправильно -- control не передан
<Controller
  name="category"
  render={({ field }) => <Select {...field} />}
/>

// ✅ Правильно -- передаём control
const { control } = useForm()
<Controller
  name="category"
  control={control}
  render={({ field }) => <Select {...field} />}
/>
```

**Почему это ошибка:** `Controller` требует `control` для связи с формой React Hook Form.

---

### ❌ Ошибка 2: Controller для нативного checkbox

```tsx
// ❌ Избыточно -- Controller для обычного HTML checkbox
<Controller
  name="agree"
  control={control}
  render={({ field }) => (
    <input type="checkbox" checked={field.value} onChange={field.onChange}/>
  )}
/>

// ✅ Правильно -- register работает с нативным checkbox
<input type="checkbox" {...register('agree')} />
```

**Почему это ошибка:** `register` автоматически обрабатывает нативные чекбоксы (устанавливает
`checked`, возвращает `boolean`). `Controller` нужен только для сторонних UI-компонентов.

---

### ❌ Ошибка 3: Не преобразуют значение в Controller

```tsx
// ❌ Неправильно -- передаётся весь объект
<Controller
  name="category"
  control={control}
  render={({ field }) => (
    <Select
      {...field}
      options={[{ value: 'el', label: 'Электроника' }]}
    />
  )}
/>

// ✅ Правильно -- преобразуем значение
<Controller
  name="category"
  control={control}
  render={({ field }) => (
    <Select
      {...field}
      onChange={(selected) => field.onChange(selected?.value)}
      options={[{ value: 'el', label: 'Электроника' }]}
    />
  )}
/>
```

**Почему это ошибка:** Сторонние компоненты (например, react-select) часто возвращают объект
`{ value, label }`, а не простое значение. Нужно явно извлечь `value`.

---

### ❌ Ошибка 4: Radio без value

```tsx
// ❌ Неправильно -- нет value
<input type="radio" {...register('gender')} />

// ✅ Правильно -- с value
<input type="radio" value="male" {...register('gender')} />
<input type="radio" value="female" {...register('gender')} />
```

**Почему это ошибка:** Radio-кнопки требуют `value` для определения выбранного значения. Без `value`
RHF не сможет отличить один вариант от другого.

---

## 📚 Дополнительные ресурсы

- [Controller документация](https://react-hook-form.com/docs/useform/controller)
- [register документация](https://react-hook-form.com/docs/useform/register)
