# Level 6: Complex Fields -- Controller, Radio, Select, Checkbox

## Introduction

Not all form fields can be registered via `register`. For third-party UI components and custom
inputs, `Controller` is used. In this level, you'll learn to work with Controller, radio buttons,
select, and checkboxes -- both single and multiple.

---

## Controller

### What is Controller?

**Controller** is a React Hook Form component for integrating controlled components with the form.

**When to use Controller:**

- ✅ Third-party UI components (Material-UI, Ant Design, Chakra UI)
- ✅ Custom input components
- ✅ Components that don't accept `ref`

### Basic Usage

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
            { value: 'electronics', label: 'Electronics' },
            { value: 'clothing', label: 'Clothing' },
          ]}
        />
      )}
    />
  )
}
```

### render vs children

```tsx
// Option 1: render prop
<Controller
  name="category"
  control={control}
  render={({ field, fieldState }) => (
    <Select {...field} />
  )}
/>

// Option 2: children (same thing)
<Controller
  name="category"
  control={control}
>
  {({ field, fieldState }) => (
    <Select {...field} />
  )}
</Controller>
```

### All render Parameters

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

### Example: Custom TextField

```tsx
function TextField({ label, error, ...props }: any) {
  return (
    <div className="form-group">
      {label && <label>{label}</label>}
      <input style={{ borderColor: error ? '#dc3545' : '#ddd' }} {...props} />
      {error && <span className="error">{error}</span>}
    </div>
  )
}

<Controller
  name="email"
  control={control}
  render={({ field, fieldState: { error } }) => (
    <TextField {...field} label="Email" error={error?.message} />
  )}
/>
```

---

## Radio Buttons

Radio buttons are registered via `register` with the same name and different `value` attributes:

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
          Male
        </label>
        <label>
          <input type="radio" value="female" {...register('gender')} />
          Female
        </label>
        <label>
          <input type="radio" value="other" {...register('gender')} />
          Other
        </label>
      </div>
      <button type="submit">Submit</button>
    </form>
  )
}
```

---

## Select (Dropdown)

### Basic Select

```tsx
function SelectForm() {
  const { register, handleSubmit } = useForm()

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <select {...register('country')}>
        <option value="">Select a country</option>
        <option value="us">USA</option>
        <option value="ru">Russia</option>
        <option value="de">Germany</option>
      </select>
      <button type="submit">Submit</button>
    </form>
  )
}
```

### Select with Validation

```tsx
<select
  {...register('country', {
    required: 'Select a country',
  })}
>
  <option value="">Select a country</option>
  <option value="us">USA</option>
  <option value="ru">Russia</option>
</select>
{errors.country && <span className="error">{errors.country.message}</span>}
```

---

## Checkbox

### Single Checkbox (boolean)

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
        I agree to the terms
      </label>
      <button type="submit">Submit</button>
    </form>
  )
}
```

### Multiple Selection (array)

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
      </div>
      <button type="submit">Submit</button>
    </form>
  )
}
```

### With Validation (minimum one selected)

```tsx
const schema = z.object({
  skills: z.array(z.string()).min(1, 'Select at least one skill'),
})
```

---

## Common Beginner Mistakes

### ❌ Mistake 1: Controller Without control

```tsx
// ❌ Wrong -- control not passed
<Controller
  name="category"
  render={({ field }) => <Select {...field} />}
/>

// ✅ Correct -- pass control
const { control } = useForm()
<Controller
  name="category"
  control={control}
  render={({ field }) => <Select {...field} />}
/>
```

**Why this is a mistake:** `Controller` requires `control` to connect with React Hook Form.

---

### ❌ Mistake 2: Controller for Native Checkbox

```tsx
// ❌ Redundant -- Controller for a regular HTML checkbox
<Controller
  name="agree"
  control={control}
  render={({ field }) => (
    <input type="checkbox" checked={field.value} onChange={field.onChange}/>
  )}
/>

// ✅ Correct -- register works with native checkbox
<input type="checkbox" {...register('agree')} />
```

**Why this is a mistake:** `register` automatically handles native checkboxes (sets `checked`,
returns `boolean`). `Controller` is only needed for third-party UI components.

---

### ❌ Mistake 3: Not Transforming Value in Controller

```tsx
// ❌ Wrong -- entire object passed
<Controller
  name="category"
  control={control}
  render={({ field }) => (
    <Select
      {...field}
      options={[{ value: 'el', label: 'Electronics' }]}
    />
  )}
/>

// ✅ Correct -- transform the value
<Controller
  name="category"
  control={control}
  render={({ field }) => (
    <Select
      {...field}
      onChange={(selected) => field.onChange(selected?.value)}
      options={[{ value: 'el', label: 'Electronics' }]}
    />
  )}
/>
```

**Why this is a mistake:** Third-party components (e.g., react-select) often return an object
`{ value, label }`, not a simple value. You need to explicitly extract the `value`.

---

### ❌ Mistake 4: Radio Without value

```tsx
// ❌ Wrong -- no value
<input type="radio" {...register('gender')} />

// ✅ Correct -- with value
<input type="radio" value="male" {...register('gender')} />
<input type="radio" value="female" {...register('gender')} />
```

**Why this is a mistake:** Radio buttons require `value` to determine the selected value. Without
`value`, RHF can't distinguish one option from another.

---

## Additional Resources

- [Controller Documentation](https://react-hook-form.com/docs/useform/controller)
- [register Documentation](https://react-hook-form.com/docs/useform/register)
