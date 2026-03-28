# Level 5: Yup and Library Comparison

## Introduction

Zod is not the only schema validation library. **Yup** is a time-tested alternative with a chainable
API, widely used in the React ecosystem. In this level, you'll learn Yup and how to choose between
Zod and Yup for your projects.

---

## Yup Basics

### What is Yup?

**Yup** is a schema validation library with a chainable API, inspired by the Joi library for
Node.js.

**Installation:**

```bash
npm install yup @hookform/resolvers
```

### Basic Example

```tsx
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

const schema = yup.object({
  email: yup.string().email('Invalid email').required('Required'),
  password: yup.string().min(8, 'Minimum 8 characters').required('Required'),
})

type FormData = yup.InferType<typeof schema>

const { register, handleSubmit } = useForm<FormData>({
  resolver: yupResolver(schema),
})
```

---

## Yup Types and Validation Methods

### Strings

```tsx
const schema = yup.object({
  name: yup.string().required('Required'),
  email: yup.string().email('Invalid email').required('Required'),
  website: yup.string().url('Invalid URL'),
  username: yup.string().min(3).max(20),
  phone: yup.string().matches(/^\+7\d{10}$/, 'Invalid format'),
  bio: yup.string(),
  role: yup.string().default('user'),
  status: yup.string().oneOf(['active', 'inactive']),
})
```

### Numbers

```tsx
const schema = yup.object({
  age: yup.number().required('Required'),
  rating: yup.number().min(1).max(10),
  price: yup.number().positive('Price must be positive'),
  count: yup.number().integer('Must be an integer'),
})
```

### Booleans

```tsx
const schema = yup.object({
  agree: yup.boolean().oneOf([true], 'Consent required'),
  newsletter: yup.boolean(),
})
```

### Arrays and Objects

```tsx
const schema = yup.object({
  tags: yup.array().of(yup.string()),
  skills: yup.array().of(yup.string()).min(1, 'Select at least one'),
  address: yup.object({
    city: yup.string().required('Required'),
    street: yup.string().required('Required'),
  }),
})
```

---

## Custom Validation with `.test()`

The `.test()` method in Yup is the equivalent of `.refine()` in Zod:

```tsx
const schema = yup.object({
  // Cross-field validation via ref
  password: yup.string().required(),
  confirmPassword: yup.string().oneOf([yup.ref('password')], 'Passwords must match'),

  // Custom sync test
  username: yup
    .string()
    .test('no-spaces', 'Must not contain spaces', value => !value?.includes(' ')),

  // Async test
  email: yup.string().test('is-available', 'Email is taken', async value => {
    if (!value) return true
    const response = await fetch(`/api/check-email?email=${value}`)
    const { available } = await response.json()
    return available
  }),
})
```

### Custom test with context

```tsx
const schema = yup.object({
  startDate: yup.string().required(),
  endDate: yup
    .string()
    .required()
    .test('after-start', 'End date must be after start', function (value) {
      const { startDate } = this.parent
      return new Date(value) > new Date(startDate)
    }),
})
```

> **Important:** To access `this.parent`, use a regular function (`function`), not an arrow function
> (`=>`). Arrow functions don't have their own `this`.

---

## Zod vs Yup Comparison

### Summary Table

| Criterion            | Zod                                   | Yup                                      |
| -------------------- | ------------------------------------- | ---------------------------------------- |
| **Size**             | ~12 KB                                | ~14 KB                                   |
| **TypeScript**       | First-class, excellent type inference | Good, but sometimes requires annotations |
| **API**              | Functional, composable                | Chainable, expressive                    |
| **Performance**      | Faster                                | Slower                                   |
| **Async Validation** | Via `refine`                          | Via `test`                               |
| **Community**        | Large, growing                        | Very large, mature                       |
| **Required Fields**  | Required by default                   | Optional by default                      |
| **Cross-field refs** | `refine` at object level              | `yup.ref()` within field                 |

### When to Choose Zod?

- ✅ New TypeScript project
- ✅ Type safety is important (better type inference)
- ✅ Need better performance
- ✅ Prefer functional API
- ✅ Need `discriminatedUnion`, `transform`, `pipe`

### When to Choose Yup?

- ✅ JavaScript project (no TypeScript)
- ✅ Already using Yup in the project
- ✅ Love chainable API
- ✅ Need many ready examples online
- ✅ Migrating from Formik (Yup is its default validator)
- ✅ Familiar `yup.ref()` for cross-field references

---

## Yup Integration with React Hook Form

### Complete Example

```tsx
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

const schema = yup.object({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  age: yup
    .number()
    .typeError('Must be a number')
    .min(18, 'Minimum 18 years')
    .max(120, 'Maximum 120 years')
    .required('Age is required'),
  password: yup
    .string()
    .min(8, 'Minimum 8 characters')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords do not match')
    .required('Confirm your password'),
})

type FormData = yup.InferType<typeof schema>

export function YupForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    mode: 'onChange',
  })

  const onSubmit = (data: FormData) => {
    console.log('Submitted:', data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('firstName')} placeholder="First name" />
      {errors.firstName && <span className="error">{errors.firstName.message}</span>}

      <input {...register('email')} placeholder="Email" />
      {errors.email && <span className="error">{errors.email.message}</span>}

      <input type="password" {...register('password')} placeholder="Password" />
      {errors.password && <span className="error">{errors.password.message}</span>}

      <input type="password" {...register('confirmPassword')} placeholder="Confirm password" />
      {errors.confirmPassword && <span className="error">{errors.confirmPassword.message}</span>}

      <button type="submit" disabled={!isValid}>Register</button>
    </form>
  )
}
```

---

## Common Beginner Mistakes

### ❌ Mistake 1: Forgot .required() in Yup

```tsx
// ❌ Wrong -- field is optional (default in Yup!)
email: yup.string().email('Invalid email')

// ✅ Correct -- add .required()
email: yup.string().email('Invalid email').required('Email is required')
```

**Why this is a mistake:** Unlike Zod where fields are required by default, in Yup fields are
**optional** by default. Without `.required()`, an empty string will pass validation.

---

### ❌ Mistake 2: Arrow Function in .test() with this

```tsx
// ❌ Wrong -- arrow function doesn't have this
endDate: yup.string().test('after-start', 'Too early', (value) => {
  const { startDate } = this.parent // ERROR: this === undefined
})

// ✅ Correct -- regular function for this access
endDate: yup.string().test('after-start', 'Too early', function(value) {
  const { startDate } = this.parent
  return new Date(value) > new Date(startDate)
})
```

**Why this is a mistake:** `this.parent` is only available in regular functions. Arrow functions
inherit `this` from the outer context where `parent` is not defined.

---

### ❌ Mistake 3: yupResolver vs zodResolver Mix-up

```tsx
// ❌ Wrong -- wrong resolver
import { zodResolver } from '@hookform/resolvers/zod'
const schema = yup.object({ ... })
useForm({ resolver: zodResolver(schema) }) // TypeError!

// ✅ Correct -- use yupResolver for Yup schemas
import { yupResolver } from '@hookform/resolvers/yup'
useForm({ resolver: yupResolver(schema) })
```

**Why this is a mistake:** Each validation library requires its own resolver.

---

### ❌ Mistake 4: Missing .typeError() for Number Fields

```tsx
// ❌ Wrong -- confusing error "NaN is not a number"
age: yup.number().min(18).required()

// ✅ Correct -- with clear message
age: yup.number().typeError('Must be a number').min(18).required()
```

**Why this is a mistake:** When an HTML input returns an empty string, Yup tries to coerce it to a
number and gets NaN. Without `.typeError()`, the error message will be technical and confusing.

---

## Additional Resources

- [Yup Documentation](https://github.com/jquense/yup)
- [@hookform/resolvers](https://react-hook-form.com/docs/useform/resolver)
- [Zod Documentation](https://zod.dev/)
