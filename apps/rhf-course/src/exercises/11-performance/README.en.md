# Level 11: Performance

## Introduction

React Hook Form is designed for high performance thanks to its uncontrolled approach. However,
improper use of `watch`, lack of memoization, and wrong configuration can lead to unnecessary
re-renders. In this level, you'll learn to optimize forms for maximum performance.

---

## Problems with watch()

`watch()` without arguments subscribes to **all** form changes and causes a re-render of the entire
component on every keystroke:

```tsx
// ❌ Bad: re-render on ANY change to ANY field
function SlowForm() {
  const { register, watch } = useForm()
  const values = watch() // Subscribes to all fields
  console.log('Render!', values)

  return (
    <form>
      <input {...register('name')} />
      <input {...register('email')} />
      <input {...register('bio')} />
      {/* Every character in any field = re-render of entire form */}
    </form>
  )
}
```

---

## useWatch for Individual Fields

`useWatch` is a hook that subscribes only to specified fields, isolating re-renders:

```tsx
import { useWatch } from 'react-hook-form'

function OptimizedForm() {
  const { control, register } = useForm()

  const name = useWatch({
    control,
    name: 'name',
    defaultValue: '',
  })

  return (
    <div>
      <input {...register('name')} />
      <input {...register('email')} /> {/* Doesn't cause re-render */}
      <div>You entered: {name}</div>
    </div>
  )
}
```

### watch vs useWatch

| `watch()`                       | `useWatch()`                     |
| ------------------------------- | -------------------------------- |
| Subscribes to all fields        | Subscribes to specific fields    |
| Re-renders entire form          | Re-renders only subscribed parts |
| Good for quick prototyping      | Better for production            |

---

## Component Memoization

Extract parts of the form into separate components with `memo` and `useWatch` to isolate
re-renders:

```tsx
import { memo } from 'react'
import { useWatch } from 'react-hook-form'

const PriceDisplay = memo(({ control }: { control: any }) => {
  const price = useWatch({ control, name: 'price' })
  console.log('PriceDisplay render') // Only when price changes
  return <div>Price: {price}</div>
})

const NameDisplay = memo(({ control }: { control: any }) => {
  const name = useWatch({ control, name: 'name' })
  console.log('NameDisplay render') // Only when name changes
  return <div>Name: {name}</div>
})

function MyForm() {
  const { control, register } = useForm()

  return (
    <form>
      <input {...register('name')} />
      <input {...register('price', { valueAsNumber: true })} />
      <input {...register('description')} /> {/* Doesn't affect display components */}

      <NameDisplay control={control} />
      <PriceDisplay control={control} />
    </form>
  )
}
```

---

## shouldUnregister

By default `shouldUnregister: false` -- fields remain registered even after unmounting. Their values
are preserved in the form data:

```tsx
// Default false -- fields registered forever
const { register } = useForm({ shouldUnregister: false })

// true -- fields unregister on unmount
const { register } = useForm({ shouldUnregister: true })

// For conditional fields, shouldUnregister: true is often better
{showEmail && <input {...register('email')} />}
// With shouldUnregister: true -- email is removed from data when hidden
// With shouldUnregister: false -- email stays in data
```

### When to use shouldUnregister: true?

- ✅ Conditional fields that shouldn't be in final data
- ✅ Wizard forms where steps may be removed
- ✅ Reducing submitted data size

### When to keep false (default)?

- ✅ Data needs to persist between hide/show cycles
- ✅ Tab forms where users switch between tabs

---

## delayError

The `delayError` option delays error display by the specified number of milliseconds. This improves
UX with `mode: 'onChange'` because users don't see flickering errors while typing:

```tsx
const {
  register,
  formState: { errors },
} = useForm({
  mode: 'onChange',
  delayError: 500, // Error appears 500ms after user stops typing
})
```

Without `delayError`, with `mode: 'onChange'`, the user sees "Minimum 6 characters" after the first
character. With `delayError: 500`, the error only appears if the user stops typing for 500ms.

> **When to use:** `delayError` is useful with `mode: 'onChange'` or `mode: 'all'`. With
> `mode: 'onBlur'` or `mode: 'onSubmit'`, it's unnecessary.

```tsx
// Typical combination for best UX
const { register } = useForm({
  mode: 'onChange',
  delayError: 300,
})
```

---

## Re-render Optimization: Summary

```tsx
// ❌ Slow: watch all fields
const allValues = watch()

// ✅ Fast: useWatch for specific fields
const email = useWatch({ name: 'email', control })
const password = useWatch({ name: 'password', control })

// ✅ Very fast: memo + useWatch in separate component
const MemoizedField = memo(({ control, name }) => {
  const value = useWatch({ control, name })
  return <div>{value}</div>
})
```

### Optimization Checklist

- [ ] Replace `watch()` without arguments with `useWatch` for specific fields
- [ ] Extract value-dependent UI elements into separate `memo` components
- [ ] Use `shouldUnregister: true` for conditional fields when data isn't needed after hiding
- [ ] Add `delayError` with `mode: 'onChange'` to prevent error flickering
- [ ] Don't subscribe to `formState` properties that aren't used

---

## Common Beginner Mistakes

### ❌ Mistake 1: watch() Instead of useWatch

```tsx
// ❌ Wrong -- watch all fields
const values = watch()
console.log('Render', values)

// ✅ Correct -- useWatch for individual fields
const name = useWatch({ name: 'name', control })
```

**Why this is a mistake:** `watch()` subscribes to all form changes, causing the entire component to
re-render on every keystroke in any field.

---

### ❌ Mistake 2: useWatch Without control

```tsx
// ❌ May work but unreliable
const name = useWatch({ name: 'name' })

// ✅ Correct -- pass control
const { control } = useForm()
const name = useWatch({ name: 'name', control })
```

**Why this is a mistake:** Without `control`, `useWatch` tries to use the `FormProvider` context. If
there is none, behavior may be unpredictable.

---

### ❌ Mistake 3: Heavy Computations in Form Component

```tsx
// ❌ Wrong -- recalculation on every re-render
function Form() {
  const { register, watch } = useForm()
  const items = watch('items')
  const total = items?.reduce((sum, item) => sum + item.price * item.qty, 0)

  return <div>Total: {total}</div>
}

// ✅ Correct -- extract to memo component
const TotalDisplay = memo(({ control }) => {
  const items = useWatch({ control, name: 'items' })
  const total = items?.reduce((sum, item) => sum + item.price * item.qty, 0)
  return <div>Total: {total}</div>
})
```

**Why this is a mistake:** Computations run on every form re-render, even when a different field
changed. Extracting to a `memo` component with `useWatch` isolates the recalculation.

---

## Additional Resources

- [useWatch Documentation](https://react-hook-form.com/docs/usewatch)
- [shouldUnregister](https://react-hook-form.com/docs/useform#shouldUnregister)
- [delayError](https://react-hook-form.com/docs/useform#delayError)
- [Performance Tips](https://react-hook-form.com/advanced-usage#FormProviderPerformance)
