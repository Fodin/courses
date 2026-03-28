# Уровень 7: Файлы и даты

## Введение

Загрузка файлов и работа с датами -- частые задачи в веб-формах, которые требуют особого подхода.
В этом уровне вы научитесь интегрировать file upload и date-поля с React Hook Form, а также
валидировать их с помощью Zod.

---

## File Upload

### Базовая загрузка файла

```tsx
function FileUpload() {
  const { register, handleSubmit } = useForm()

  const onSubmit = (data: any) => {
    const file = data.avatar[0]
    console.log('File:', file)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input type="file" accept="image/*" {...register('avatar')} />
      <button type="submit">Загрузить</button>
    </form>
  )
}
```

📌 **Важно:** `register` для `type="file"` возвращает `FileList`, а не один файл. Для получения
первого файла используйте `data.avatar[0]`.

---

## Валидация файлов

### Размер и тип файла

```tsx
const schema = z.object({
  avatar: z
    .instanceof(FileList)
    .refine(files => files.length > 0, 'Выберите файл')
    .refine(files => files[0]?.size < 2_000_000, 'Максимум 2MB')
    .refine(
      files => ['image/jpeg', 'image/png', 'image/gif'].includes(files[0]?.type),
      'Только JPG, PNG, GIF'
    ),
})
```

### Множественная загрузка

```tsx
const schema = z.object({
  documents: z
    .instanceof(FileList)
    .refine(files => files.length > 0, 'Выберите хотя бы один файл')
    .refine(files => files.length <= 5, 'Максимум 5 файлов')
    .refine(
      files => Array.from(files).every(file => file.size < 5_000_000),
      'Каждый файл должен быть меньше 5MB'
    ),
})
```

---

## Превью изображений

```tsx
import { useState } from 'react'
import { useForm } from 'react-hook-form'

function FileUploadWithPreview() {
  const { register, handleSubmit } = useForm()
  const [preview, setPreview] = useState<string | null>(null)

  // Сохраняем оригинальный onChange от register
  const avatarRegister = register('avatar')

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        type="file"
        accept="image/*"
        {...avatarRegister}
        onChange={e => {
          avatarRegister.onChange(e) // Сначала передаём событие в RHF
          const file = e.target.files?.[0]
          if (file) {
            const url = URL.createObjectURL(file)
            setPreview(url)
          }
        }}
      />

      {preview && (
        <img
          src={preview}
          alt="Preview"
          style={{ maxWidth: '200px', marginTop: '1rem' }}
        />
      )}

      <button type="submit">Загрузить</button>
    </form>
  )
}
```

> 💡 **Совет:** Не забывайте вызывать `URL.revokeObjectURL()` при размонтировании компонента или
> смене файла, чтобы избежать утечек памяти.

### Очистка URL при размонтировании

```tsx
import { useState, useEffect } from 'react'

function FileUploadClean() {
  const { register, watch } = useForm()
  const [preview, setPreview] = useState<string | null>(null)
  const avatarFile = watch('avatar')

  useEffect(() => {
    if (avatarFile?.[0]) {
      const url = URL.createObjectURL(avatarFile[0])
      setPreview(url)
      return () => URL.revokeObjectURL(url) // Cleanup
    }
  }, [avatarFile])

  return (
    <div>
      <input type="file" accept="image/*" {...register('avatar')} />
      {preview && <img src={preview} alt="Preview" style={{ maxWidth: '200px' }} />}
    </div>
  )
}
```

---

## Date и DateTime поля

### Date input

```tsx
function DateForm() {
  const { register, handleSubmit } = useForm()

  const onSubmit = (data: any) => {
    console.log('Birth date:', data.birthDate) // '1990-01-01'
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>Дата рождения</label>
      <input type="date" {...register('birthDate')} />
      <button type="submit">Отправить</button>
    </form>
  )
}
```

### DateTime-local

```tsx
function DateTimeForm() {
  const { register, handleSubmit } = useForm()

  const onSubmit = (data: any) => {
    console.log('Appointment:', data.appointment) // '2024-01-15T10:00'
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>Запись на встречу</label>
      <input type="datetime-local" {...register('appointment')} />
      <button type="submit">Записаться</button>
    </form>
  )
}
```

---

## Валидация дат

### Базовая валидация

```tsx
const schema = z.object({
  birthDate: z.string().min(1, 'Выберите дату'),
  appointment: z
    .string()
    .min(1, 'Выберите время')
    .refine(date => new Date(date) > new Date(), 'Время должно быть в будущем'),
})
```

### Диапазон дат

```tsx
const schema = z
  .object({
    startDate: z.string().min(1, 'Выберите дату начала'),
    endDate: z.string().min(1, 'Выберите дату окончания'),
  })
  .refine(data => new Date(data.endDate) > new Date(data.startDate), {
    message: 'Дата окончания должна быть позже даты начала',
    path: ['endDate'],
  })
```

### Ограничение по возрасту

```tsx
const schema = z.object({
  birthDate: z
    .string()
    .min(1, 'Выберите дату')
    .refine(
      date => {
        const age = Math.floor(
          (Date.now() - new Date(date).getTime()) / (365.25 * 24 * 60 * 60 * 1000)
        )
        return age >= 18
      },
      'Вам должно быть не менее 18 лет'
    ),
})
```

---

## ⚠️ Частые ошибки новичков

### ❌ Ошибка 1: Перезапись onChange от register

```tsx
// ❌ Неправильно -- свой onChange перезаписывает обработчик register
<input
  type="file"
  {...register('avatar')}
  onChange={(e) => {
    const file = e.target.files?.[0]
    // register.onChange не вызовется -- RHF не получит значение
  }}
/>

// ✅ Правильно -- вызываем onChange от register, добавляя свою логику
const avatarRegister = register('avatar')
<input
  type="file"
  {...avatarRegister}
  onChange={(e) => {
    avatarRegister.onChange(e)  // Сначала передаём событие в RHF
    const file = e.target.files?.[0]
    if (file) setPreview(URL.createObjectURL(file))
  }}
/>
```

**Почему это ошибка:** Если поставить `onChange` после `{...register()}`, он перезапишет обработчик
RHF. Нужно вызвать `register.onChange` явно.

---

### ❌ Ошибка 2: Утечка памяти при превью

```tsx
// ❌ Неправильно -- URL не освобождается
const url = URL.createObjectURL(file)
setPreview(url)

// ✅ Правильно -- cleanup через useEffect
useEffect(() => {
  if (avatarFile?.[0]) {
    const url = URL.createObjectURL(avatarFile[0])
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }
}, [avatarFile])
```

**Почему это ошибка:** `URL.createObjectURL` создаёт blob URL, который занимает память, пока не
будет освобождён через `revokeObjectURL`.

---

### ❌ Ошибка 3: Дата как строка без преобразования

```tsx
// ❌ Неправильно -- дата остаётся строкой
birthDate: z.string().min(1, 'Обязательно')
// При отправке: { birthDate: "1990-01-15" } -- строка, не Date

// ✅ Правильно -- преобразуем в Date при необходимости
birthDate: z
  .string()
  .min(1, 'Обязательно')
  .transform(val => new Date(val))
```

**Почему это ошибка:** HTML date input всегда возвращает строку формата `YYYY-MM-DD`. Если бэкенд
ожидает объект `Date`, нужно явное преобразование через `transform`.

---

### ❌ Ошибка 4: Валидация файла без проверки наличия

```tsx
// ❌ Неправильно -- может быть undefined при первом рендере
avatar: z
  .instanceof(FileList)
  .refine(files => files[0].size < 2_000_000, 'Максимум 2MB')

// ✅ Правильно -- проверяем наличие файла сначала
avatar: z
  .instanceof(FileList)
  .refine(files => files.length > 0, 'Выберите файл')
  .refine(files => files[0]?.size < 2_000_000, 'Максимум 2MB')
```

**Почему это ошибка:** Без проверки `.length > 0` обращение к `files[0].size` вызовет ошибку, если
файл не выбран. Используйте optional chaining (`?.`) для безопасного доступа.

---

## 📚 Дополнительные ресурсы

- [MDN: File API](https://developer.mozilla.org/en-US/docs/Web/API/File_API)
- [MDN: URL.createObjectURL](https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL_static)
- [MDN: input type="date"](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/date)
- [register документация](https://react-hook-form.com/docs/useform/register)
