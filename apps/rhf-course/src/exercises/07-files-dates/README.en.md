# Level 7: Files and Dates

## Introduction

File uploads and date handling are common tasks in web forms that require a special approach. In
this level, you'll learn to integrate file upload and date fields with React Hook Form, and validate
them with Zod.

---

## File Upload

### Basic File Upload

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
      <button type="submit">Upload</button>
    </form>
  )
}
```

> **Important:** `register` for `type="file"` returns a `FileList`, not a single file. To get the
> first file, use `data.avatar[0]`.

---

## File Validation

### File Size and Type

```tsx
const schema = z.object({
  avatar: z
    .instanceof(FileList)
    .refine(files => files.length > 0, 'Select a file')
    .refine(files => files[0]?.size < 2_000_000, 'Maximum 2MB')
    .refine(
      files => ['image/jpeg', 'image/png', 'image/gif'].includes(files[0]?.type),
      'Only JPG, PNG, GIF'
    ),
})
```

### Multiple File Upload

```tsx
const schema = z.object({
  documents: z
    .instanceof(FileList)
    .refine(files => files.length > 0, 'Select at least one file')
    .refine(files => files.length <= 5, 'Maximum 5 files')
    .refine(
      files => Array.from(files).every(file => file.size < 5_000_000),
      'Each file must be under 5MB'
    ),
})
```

---

## Image Preview

```tsx
import { useState } from 'react'
import { useForm } from 'react-hook-form'

function FileUploadWithPreview() {
  const { register, handleSubmit } = useForm()
  const [preview, setPreview] = useState<string | null>(null)

  const avatarRegister = register('avatar')

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        type="file"
        accept="image/*"
        {...avatarRegister}
        onChange={e => {
          avatarRegister.onChange(e) // Pass event to RHF first
          const file = e.target.files?.[0]
          if (file) {
            setPreview(URL.createObjectURL(file))
          }
        }}
      />

      {preview && (
        <img src={preview} alt="Preview" style={{ maxWidth: '200px', marginTop: '1rem' }} />
      )}

      <button type="submit">Upload</button>
    </form>
  )
}
```

### Cleanup URL on Unmount

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

## Date and DateTime Fields

### Date Input

```tsx
function DateForm() {
  const { register, handleSubmit } = useForm()

  const onSubmit = (data: any) => {
    console.log('Birth date:', data.birthDate) // '1990-01-01'
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>Birth Date</label>
      <input type="date" {...register('birthDate')} />
      <button type="submit">Submit</button>
    </form>
  )
}
```

### DateTime-local

```tsx
function DateTimeForm() {
  const { register, handleSubmit } = useForm()

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>Appointment</label>
      <input type="datetime-local" {...register('appointment')} />
      <button type="submit">Schedule</button>
    </form>
  )
}
```

---

## Date Validation

### Basic Validation

```tsx
const schema = z.object({
  birthDate: z.string().min(1, 'Select a date'),
  appointment: z
    .string()
    .min(1, 'Select a time')
    .refine(date => new Date(date) > new Date(), 'Time must be in the future'),
})
```

### Date Range

```tsx
const schema = z
  .object({
    startDate: z.string().min(1, 'Select start date'),
    endDate: z.string().min(1, 'Select end date'),
  })
  .refine(data => new Date(data.endDate) > new Date(data.startDate), {
    message: 'End date must be after start date',
    path: ['endDate'],
  })
```

### Age Restriction

```tsx
const schema = z.object({
  birthDate: z
    .string()
    .min(1, 'Select a date')
    .refine(
      date => {
        const age = Math.floor(
          (Date.now() - new Date(date).getTime()) / (365.25 * 24 * 60 * 60 * 1000)
        )
        return age >= 18
      },
      'You must be at least 18 years old'
    ),
})
```

---

## Common Beginner Mistakes

### ❌ Mistake 1: Overwriting onChange from register

```tsx
// ❌ Wrong -- custom onChange overwrites register's handler
<input
  type="file"
  {...register('avatar')}
  onChange={(e) => {
    const file = e.target.files?.[0]
  }}
/>

// ✅ Correct -- call register's onChange, adding your own logic
const avatarRegister = register('avatar')
<input
  type="file"
  {...avatarRegister}
  onChange={(e) => {
    avatarRegister.onChange(e)
    const file = e.target.files?.[0]
    if (file) setPreview(URL.createObjectURL(file))
  }}
/>
```

**Why this is a mistake:** Placing `onChange` after `{...register()}` overwrites RHF's handler.

---

### ❌ Mistake 2: Memory Leak with Preview

```tsx
// ❌ Wrong -- URL not released
const url = URL.createObjectURL(file)
setPreview(url)

// ✅ Correct -- cleanup via useEffect
useEffect(() => {
  if (avatarFile?.[0]) {
    const url = URL.createObjectURL(avatarFile[0])
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }
}, [avatarFile])
```

**Why this is a mistake:** `URL.createObjectURL` creates a blob URL that occupies memory until
released via `revokeObjectURL`.

---

### ❌ Mistake 3: Date as String Without Transformation

```tsx
// ❌ Wrong -- date stays as string
birthDate: z.string().min(1, 'Required')

// ✅ Correct -- transform to Date when needed
birthDate: z.string().min(1, 'Required').transform(val => new Date(val))
```

**Why this is a mistake:** HTML date input always returns a string. If the backend expects a `Date`
object, you need explicit transformation.

---

### ❌ Mistake 4: File Validation Without Existence Check

```tsx
// ❌ Wrong -- may throw if no file selected
avatar: z.instanceof(FileList)
  .refine(files => files[0].size < 2_000_000, 'Maximum 2MB')

// ✅ Correct -- check existence first
avatar: z.instanceof(FileList)
  .refine(files => files.length > 0, 'Select a file')
  .refine(files => files[0]?.size < 2_000_000, 'Maximum 2MB')
```

**Why this is a mistake:** Without checking `.length > 0`, accessing `files[0].size` will throw if
no file is selected. Use optional chaining (`?.`) for safe access.

---

## Additional Resources

- [MDN: File API](https://developer.mozilla.org/en-US/docs/Web/API/File_API)
- [MDN: URL.createObjectURL](https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL_static)
- [MDN: input type="date"](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/date)
- [register Documentation](https://react-hook-form.com/docs/useform/register)
