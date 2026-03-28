# Level 4: Advanced Zod

## Introduction

After learning basic Zod types, it's time to move on to advanced features. In this level, you'll
learn to create custom validation, work with conditional fields, and transform data directly in
schemas.

---

## Custom Validation with `refine`

### Single refine

`refine` lets you add an arbitrary check that can't be expressed with built-in methods:

```tsx
const schema = z
  .object({
    password: z.string(),
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
```

### Multiple refine

```tsx
const schema = z
  .object({
    currentPassword: z.string(),
    newPassword: z.string(),
  })
  .refine(data => data.newPassword !== data.currentPassword, {
    message: 'New password must be different',
    path: ['newPassword'],
  })
  .refine(data => data.newPassword.length >= 8, {
    message: 'Minimum 8 characters',
    path: ['newPassword'],
  })
```

### Async refine

```tsx
const schema = z
  .object({
    username: z.string(),
  })
  .refine(
    async data => {
      const response = await fetch(`/api/check-username?username=${data.username}`)
      const { available } = await response.json()
      return available
    },
    {
      message: 'Username is taken',
      path: ['username'],
    }
  )
```

---

## Advanced Validation with `superRefine`

`superRefine` is a more powerful alternative to `refine`. It allows adding **multiple errors** in a
single pass and gives full control via the `ctx` object:

```tsx
const schema = z
  .object({
    password: z.string(),
    confirm: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.password.length < 8) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Minimum 8 characters',
        path: ['password'],
      })
    }

    if (!/[A-Z]/.test(data.password)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Must have at least one uppercase letter',
        path: ['password'],
      })
    }

    if (data.password !== data.confirm) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Passwords do not match',
        path: ['confirm'],
      })
    }
  })
```

### When is `superRefine` better than `refine`?

| `refine`                              | `superRefine`                          |
| ------------------------------------- | -------------------------------------- |
| One check -- one error                | Multiple errors in a single call       |
| Returns `boolean`                     | Calls `ctx.addIssue()` for each error  |
| Convenient for simple checks          | Convenient for complex branching logic |
| Chain `.refine().refine()` -- slower  | One `.superRefine()` -- faster         |

### Example: checking uniqueness of multiple fields

```tsx
const schema = z
  .object({
    email: z.string().email(),
    username: z.string().min(3),
  })
  .superRefine(async (data, ctx) => {
    const [emailTaken, usernameTaken] = await Promise.all([
      checkEmail(data.email),
      checkUsername(data.username),
    ])

    if (emailTaken) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Email is already taken',
        path: ['email'],
      })
    }

    if (usernameTaken) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Username is already taken',
        path: ['username'],
      })
    }
  })
```

---

## `discriminatedUnion` -- Conditional Fields

`discriminatedUnion` is perfect for forms where the set of fields depends on a selected value
(discriminator). Zod automatically determines which branch of the schema to use:

```tsx
const contactSchema = z.discriminatedUnion('contactMethod', [
  z.object({
    contactMethod: z.literal('email'),
    email: z.string().email('Invalid email'),
  }),
  z.object({
    contactMethod: z.literal('phone'),
    phone: z.string().min(10, 'Minimum 10 digits'),
  }),
  z.object({
    contactMethod: z.literal('telegram'),
    telegramUsername: z.string().min(1, 'Required'),
  }),
])

type ContactForm = z.infer<typeof contactSchema>
```

### Usage with React Hook Form

```tsx
function ContactForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  })

  const method = watch('contactMethod')

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <select {...register('contactMethod')}>
        <option value="email">Email</option>
        <option value="phone">Phone</option>
        <option value="telegram">Telegram</option>
      </select>

      {method === 'email' && <input {...register('email')} placeholder="Email" />}
      {method === 'phone' && <input {...register('phone')} placeholder="Phone" />}
      {method === 'telegram' && <input {...register('telegramUsername')} placeholder="@username" />}

      <button type="submit">Submit</button>
    </form>
  )
}
```

### Why `discriminatedUnion` over `union`?

- `discriminatedUnion` is **faster** -- Zod knows which branch to check immediately
- `union` tries all variants and collects errors from each -- slower with less clear error messages
- `discriminatedUnion` requires the discriminator to be `z.literal()` -- explicit and predictable

---

## `transform` and `pipe` -- Data Transformation

### `transform` -- Transformation After Validation

```tsx
const schema = z.object({
  name: z
    .string()
    .min(1, 'Required')
    .transform(val => val.trim()),

  age: z.string().transform(val => Number(val)),

  email: z
    .string()
    .email('Invalid email')
    .transform(val => val.toLowerCase().trim()),
})

type FormInput = z.input<typeof schema> // type BEFORE transform
type FormOutput = z.output<typeof schema> // type AFTER transform (= z.infer)
```

### `pipe` -- Chained Validation and Transformation

```tsx
const schema = z.object({
  age: z
    .string()
    .transform(val => Number(val))
    .pipe(z.number().min(18, 'Minimum 18 years').max(120, 'Maximum 120 years')),

  price: z
    .string()
    .transform(val => parseFloat(val))
    .pipe(z.number().positive('Price must be positive')),
})
```

### `transform` vs `pipe`

| `transform`                       | `pipe`                                               |
| --------------------------------- | ---------------------------------------------------- |
| Transforms the value              | Passes result to another schema                      |
| No validation after transform     | Validates the transformed value                      |
| `.transform(v => Number(v))`      | `.transform(v => Number(v)).pipe(z.number().min(1))` |

### Practical Example: Product Form

```tsx
const productSchema = z.object({
  title: z
    .string()
    .min(1, 'Required')
    .transform(val => val.trim()),

  price: z
    .string()
    .transform(val => parseFloat(val.replace(',', '.')))
    .pipe(z.number({ message: 'Must be a number' }).positive('Price must be positive')),

  quantity: z
    .string()
    .transform(val => parseInt(val, 10))
    .pipe(
      z
        .number({ message: 'Must be a number' })
        .int('Must be a whole number')
        .min(1, 'Minimum 1')
    ),
})
```

---

## Cross-Field Validation

Cross-field validation checks that depend on multiple field values simultaneously. In Zod, use
`refine` and `superRefine` at the object level:

```tsx
const schema = z
  .object({
    startDate: z.string().min(1, 'Required'),
    endDate: z.string().min(1, 'Required'),
    minAge: z.number().min(0),
    maxAge: z.number().min(0),
  })
  .refine(data => new Date(data.endDate) > new Date(data.startDate), {
    message: 'End date must be after start date',
    path: ['endDate'],
  })
  .refine(data => data.maxAge > data.minAge, {
    message: 'Maximum age must be greater than minimum',
    path: ['maxAge'],
  })
```

---

## Common Beginner Mistakes

### ❌ Mistake 1: .refine() Without path

```tsx
// ❌ Wrong -- error not bound to a field
.refine((data) => data.password === data.confirm, {
  message: 'Passwords do not match'
})

// ✅ Correct -- specify path
.refine((data) => data.password === data.confirm, {
  message: 'Passwords do not match',
  path: ['confirm']
})
```

**Why this is a mistake:** Without `path`, the error goes to `errors.root` instead of
`errors.confirm`. The field won't be highlighted.

---

### ❌ Mistake 2: Chaining refine Instead of superRefine

```tsx
// ❌ Suboptimal -- three separate passes
schema
  .refine(data => data.password.length >= 8, { ... })
  .refine(data => /[A-Z]/.test(data.password), { ... })
  .refine(data => data.password !== data.username, { ... })

// ✅ Better -- single pass with superRefine
schema.superRefine((data, ctx) => {
  if (data.password.length < 8) ctx.addIssue({ ... })
  if (!/[A-Z]/.test(data.password)) ctx.addIssue({ ... })
  if (data.password === data.username) ctx.addIssue({ ... })
})
```

**Why this is a mistake:** Chained `refine` runs each check in a separate pass, and if the first
fails, the rest won't execute. `superRefine` checks everything in one pass.

---

### ❌ Mistake 3: transform Without pipe for Result Validation

```tsx
// ❌ Wrong -- NaN will pass validation
age: z.string().transform(val => Number(val))

// ✅ Correct -- validate the transformed value
age: z.string()
  .transform(val => Number(val))
  .pipe(z.number().min(18).max(120))
```

**Why this is a mistake:** `transform` doesn't validate the result. If the user enters "abc",
`Number("abc")` returns `NaN`, which will be accepted without error.

---

### ❌ Mistake 4: z.infer Instead of z.input with transform

```tsx
const schema = z.object({
  age: z.string().transform(val => Number(val)),
})

// ❌ Wrong -- z.infer gives type AFTER transform: { age: number }
const { register } = useForm<z.infer<typeof schema>>()

// ✅ Correct -- z.input gives type BEFORE transform: { age: string }
const { register } = useForm<z.input<typeof schema>>({
  resolver: zodResolver(schema),
})
```

**Why this is a mistake:** When using `transform`, input and output types differ. The form works
with input data, so `useForm` needs `z.input`.

---

## Additional Resources

- [Zod: refine](https://zod.dev/?id=refine)
- [Zod: superRefine](https://zod.dev/?id=superrefine)
- [Zod: discriminatedUnion](https://zod.dev/?id=discriminated-unions)
- [Zod: transform](https://zod.dev/?id=transform)
- [Zod: pipe](https://zod.dev/?id=pipe)
