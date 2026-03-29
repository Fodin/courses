# 🔥 Level 4: Validation and Serialization

## 🎯 Why Validate Incoming Data

Validation is the first line of defense. Without it, any client data reaches business logic and database.

## 🔥 Zod -- TypeScript-first Validation

```typescript
const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  role: z.enum(['user', 'admin']).default('user'),
})
type Input = z.infer<typeof schema>  // Automatic type inference!
```

### Validation Middleware
```typescript
function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse({ body: req.body, params: req.params })
    if (!result.success) return res.status(422).json({ error: result.error })
    next()
  }
}
```

## 🔥 Joi -- Mature Validation

Rich conditional validation with `when/alternatives`, custom messages.

## 🔥 Response DTOs

DTO (Data Transfer Object) transforms database objects to API response format, preventing data leaks.

```typescript
// DB returns: { id, name, email, password_hash, stripe_id }
// DTO returns: { id, name, email }
```

## ⚠️ Common Beginner Mistakes

- Client-only validation (server validation is mandatory)
- Sending database objects directly (use DTOs)
- Status 400 for everything (use 422 for validation errors)
- Not validating params and query

## 💡 Best Practices

1. Validate body, params, and query
2. Use Zod for TypeScript projects
3. Separate create/update schemas
4. Use DTOs for each endpoint
