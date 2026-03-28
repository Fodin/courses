# Level 3: Zod Basics

## Introduction

Schema validation is a declarative way to describe validation rules for the entire form in one
place. Instead of scattering rules across individual fields via `register`, you describe the data
structure once -- and get validation, types, and autocomplete.

**Why schemas are better than built-in validation?**

| Built-in Validation            | Schema Validation           |
| ------------------------------ | --------------------------- |
| Rules scattered across fields  | All rules in one place      |
| Complex cross-field validation | Easy cross-field validation |
| Less type safety               | Full type safety            |
| Hard to reuse                  | Easy to reuse               |

---

## What is Zod?

**Zod** is a TypeScript-first schema validation library with zero dependencies. Zod allows you to
describe a data structure and automatically infer a TypeScript type from it.

**Installation:**

```bash
npm install zod @hookform/resolvers
```

### Basic Example

```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

// 1. Create a schema
const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Minimum 8 characters'),
})

// 2. Infer type from schema
type FormData = z.infer<typeof schema>

// 3. Use with useForm
const { register, handleSubmit } = useForm<FormData>({
  resolver: zodResolver(schema),
})
```

---

## Basic Zod Types

### Strings

```tsx
const schema = z.object({
  // Required string
  name: z.string(),

  // Email
  email: z.string().email('Invalid email'),

  // URL
  website: z.string().url('Invalid URL'),

  // UUID
  id: z.string().uuid('Invalid UUID'),

  // With length
  username: z.string().min(3).max(20),

  // With pattern
  phone: z.string().regex(/^\+7\d{10}$/, 'Invalid format'),

  // Optional
  bio: z.string().optional(),

  // With default value
  role: z.string().default('user'),
})
```

### Numbers

```tsx
const schema = z.object({
  // Required number
  age: z.number(),

  // With range
  rating: z.number().min(1).max(10),

  // Positive
  price: z.number().positive('Price must be positive'),

  // Negative
  balance: z.number().negative(),

  // Integer
  count: z.number().int('Must be an integer'),

  // Optional
  discount: z.number().optional(),
})
```

### Booleans

```tsx
const schema = z.object({
  agree: z.boolean().refine(v => v === true, 'Consent required'),
  newsletter: z.boolean().optional(),
})
```

### Enum

```tsx
const schema = z.object({
  // Zod enum
  role: z.enum(['admin', 'user', 'guest']),

  // TypeScript enum
  status: z.nativeEnum(Status),
})
```

---

## Object Schemas

### z.object -- Nested Objects

```tsx
const schema = z.object({
  // Nested object
  address: z.object({
    city: z.string(),
    street: z.string(),
    zip: z.string().regex(/^\d{5}$/, 'Invalid zip code'),
  }),

  // Optional object
  company: z
    .object({
      name: z.string(),
      position: z.string(),
    })
    .optional(),
})
```

### z.infer -- Type Inference from Schema

```tsx
const schema = z.object({
  email: z.string().email(),
  age: z.number().min(18),
})

// Type is inferred automatically:
// { email: string; age: number }
type FormData = z.infer<typeof schema>
```

### Arrays

```tsx
const schema = z.object({
  // Array of strings
  tags: z.array(z.string()),

  // With minimum length
  skills: z.array(z.string()).min(1, 'Select at least one skill'),

  // Array of objects
  contacts: z.array(
    z.object({
      type: z.string(),
      value: z.string(),
    })
  ),
})
```

---

## Integration with React Hook Form

To connect Zod with React Hook Form, use `zodResolver` from the `@hookform/resolvers` package.

### Complete Example

```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Minimum 8 characters'),
})

type FormData = z.infer<typeof schema>

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onChange',
  })

  const onSubmit = (data: FormData) => {
    console.log('Submitted:', data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Email</label>
        <input type="email" {...register('email')} />
        {errors.email && <span className="error">{errors.email.message}</span>}
      </div>

      <div>
        <label>Password</label>
        <input type="password" {...register('password')} />
        {errors.password && <span className="error">{errors.password.message}</span>}
      </div>

      <button type="submit" disabled={!isValid}>
        Log In
      </button>
    </form>
  )
}
```

### Nested Objects with RHF

For nested objects, use dot notation in `register`:

```tsx
const schema = z.object({
  name: z.string().min(1, 'Required'),
  address: z.object({
    city: z.string().min(1, 'Required'),
    zip: z.string().regex(/^\d{5}$/, 'Invalid zip code'),
  }),
})

type FormData = z.infer<typeof schema>

function AddressForm() {
  const { register, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  return (
    <form>
      <input {...register('name')} />
      <input {...register('address.city')} />
      <input {...register('address.zip')} />
      {errors.address?.city && <span>{errors.address.city.message}</span>}
    </form>
  )
}
```

---

## Complete Registration Schema

```tsx
import { z } from 'zod'

const registrationSchema = z
  .object({
    firstName: z.string().min(1, 'Required'),
    lastName: z.string().min(1, 'Required'),
    email: z.string().email('Invalid email'),
    age: z.number().min(18, 'Minimum 18 years').max(120, 'Maximum 120 years'),

    password: z
      .string()
      .min(8, 'Minimum 8 characters')
      .regex(/[A-Z]/, 'Must have uppercase letter')
      .regex(/\d/, 'Must have a digit'),

    confirmPassword: z.string(),

    address: z.object({
      country: z.string().min(1, 'Required'),
      city: z.string().min(1, 'Required'),
    }),

    skills: z.array(z.string()).min(1, 'Select at least one'),
    role: z.enum(['developer', 'designer', 'manager']),
    agree: z.boolean().refine(v => v === true, 'Consent required'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type RegistrationForm = z.infer<typeof registrationSchema>
```

---

## Common Beginner Mistakes

### ❌ Mistake 1: Forgot to Import Resolver

```tsx
// ❌ Wrong -- forgot import
import { z } from 'zod'

const { register } = useForm({ resolver: zodResolver(schema) }) // zodResolver is undefined!

// ✅ Correct -- import resolver
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const { register } = useForm({ resolver: zodResolver(schema) })
```

**Why this is a mistake:** Without importing `zodResolver` from `@hookform/resolvers/zod`, the
schema won't be connected to React Hook Form.

---

### ❌ Mistake 2: Manual Type Instead of z.infer

```tsx
// ❌ Wrong -- type not inferred from schema
type FormData = {
  email: string
  password: string
}
const schema = z.object({ email: z.string(), password: z.string() })

// ✅ Correct -- use z.infer
const schema = z.object({
  email: z.string(),
  password: z.string(),
})
type FormData = z.infer<typeof schema>
```

**Why this is a mistake:** Manual type description can get out of sync with the schema when changes
are made. `z.infer` guarantees accuracy.

---

### ❌ Mistake 3: .optional() Instead of .nullable()

```tsx
// ❌ Wrong -- undefined is not the same as null
bio: z.string().optional() // can be undefined

// ✅ Correct -- if API returns null
bio: z.string().nullable() // can be null
```

**Why this is a mistake:** `optional()` makes the field `string | undefined`, while `nullable()`
makes it `string | null`. Choose the one that matches your API.

---

### ❌ Mistake 4: Array min(1) Without Message

```tsx
// ❌ Wrong -- unclear default error
skills: z.array(z.string()).min(1)

// ✅ Correct -- with clear message
skills: z.array(z.string()).min(1, 'Select at least one skill')
```

**Why this is a mistake:** Users should understand what's wrong with the form. Always add messages
to validation rules.

---

## Additional Resources

- [Zod Documentation](https://zod.dev/)
- [@hookform/resolvers](https://react-hook-form.com/docs/useform/resolver)
- [Zod GitHub](https://github.com/colinhacks/zod)
