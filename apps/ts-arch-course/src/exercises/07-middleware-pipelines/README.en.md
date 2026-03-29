# Level 7: Middleware and Pipelines

## 🎯 Level Goal

Learn to design type-safe processing chains (middleware pipelines) where each link can transform context, intercept errors, and extend functionality — all with full type control at compile time.

---

## The Problem: Untyped Processing Chains

In most frameworks, middleware are functions with a `(req, res, next)` signature where types are lost:

```typescript
// ❌ Typical middleware — no type control
app.use((req, res, next) => {
  req.user = getUserFromToken(req.headers.authorization) // any
  next()
})

app.use((req, res, next) => {
  // Does req.user exist? What's its type? Hope for the best
  if (req.user.role === 'admin') { // Might be undefined!
    next()
  }
})
```

Problems:
- `req.user` is added dynamically — TypeScript doesn't know about this property
- Middleware order is critical but never checked
- Skipping a middleware breaks dependencies without compile errors
- Error interceptors are untyped

---

## Pattern 1: Type-Safe Middleware Chain

### Base Middleware Type

```typescript
// ✅ Middleware with typed context
type Middleware<TContext> = (
  ctx: TContext,
  next: () => TContext
) => TContext

function createChain<TContext>(
  initial: TContext,
  ...middlewares: Middleware<TContext>[]
): TContext {
  function execute(index: number, ctx: TContext): TContext {
    if (index >= middlewares.length) return ctx
    return middlewares[index](ctx, () => execute(index + 1, ctx))
  }
  return execute(0, initial)
}
```

### Usage

```typescript
interface RequestContext {
  path: string
  method: string
  headers: Record<string, string>
  status: number
  logs: string[]
}

const logging: Middleware<RequestContext> = (ctx, next) => {
  ctx.logs.push(`-> ${ctx.method} ${ctx.path}`)
  const result = next() // Call the next middleware
  result.logs.push(`<- ${result.status}`)
  return result
}

const auth: Middleware<RequestContext> = (ctx, next) => {
  if (!ctx.headers['authorization']) {
    return { ...ctx, status: 401 } // Short-circuit: don't call next()
  }
  return next()
}
```

💡 **Key idea**: middleware can call `next()` to continue the chain or return a result directly for short-circuit.

---

## Pattern 2: Context Accumulation

A more powerful pattern — each middleware **adds** properties to the context:

```typescript
// ✅ Middleware that extends context type
type AccumulatingMiddleware<TIn, TOut extends TIn> = (ctx: TIn) => TOut

interface BaseCtx {
  requestId: string
}

interface WithUser extends BaseCtx {
  user: { id: number; name: string; role: string }
}

interface WithPermissions extends WithUser {
  permissions: string[]
}

const addUser: AccumulatingMiddleware<BaseCtx, WithUser> = (ctx) => ({
  ...ctx,
  user: { id: 1, name: 'Alice', role: 'admin' },
})

const addPermissions: AccumulatingMiddleware<WithUser, WithPermissions> = (ctx) => ({
  ...ctx,
  // ✅ ctx.user is available — TypeScript guarantees it
  permissions: ctx.user.role === 'admin' ? ['read', 'write', 'delete'] : ['read'],
})
```

### Type-Safe Pipe

```typescript
// Overloads for type-safe composition
function pipe<A>(ctx: A): A
function pipe<A, B extends A>(ctx: A, m1: AccumulatingMiddleware<A, B>): B
function pipe<A, B extends A, C extends B>(
  ctx: A, m1: AccumulatingMiddleware<A, B>, m2: AccumulatingMiddleware<B, C>
): C
function pipe(ctx: unknown, ...mws: Array<(c: never) => unknown>): unknown {
  return mws.reduce((acc, mw) => mw(acc as never), ctx)
}

// ✅ Types are inferred automatically
const result = pipe(base, addUser, addPermissions)
// result: WithPermissions — all properties accessible

// ❌ Compile error — wrong order
const wrong = pipe(base, addPermissions) // BaseCtx lacks "user"!
```

📌 **Important**: `pipe` overloads guarantee that middleware execute in the correct order — each subsequent one receives the type returned by the previous one.

---

## Pattern 3: Interceptors

Interceptors are before/after hook pairs with typed phases:

```typescript
interface Interceptor<TReq, TRes> {
  name: string
  before?: (req: TReq) => TReq
  after?: (res: TRes) => TRes
  onError?: (error: Error, req: TReq) => TRes | never
}

function createPipeline<TReq, TRes>(
  interceptors: Interceptor<TReq, TRes>[],
  handler: (req: TReq) => TRes
) {
  return (req: TReq): TRes => {
    // Before hooks: forward order
    let processed = req
    for (const i of interceptors) {
      if (i.before) processed = i.before(processed)
    }

    // Execute handler
    let response: TRes
    try {
      response = handler(processed)
    } catch (error) {
      // Error hooks: reverse order
      for (let idx = interceptors.length - 1; idx >= 0; idx--) {
        if (interceptors[idx].onError) {
          return interceptors[idx].onError!(error as Error, processed)
        }
      }
      throw error
    }

    // After hooks: reverse order
    let result = response
    for (let idx = interceptors.length - 1; idx >= 0; idx--) {
      if (interceptors[idx].after) result = interceptors[idx].after!(result)
    }
    return result
  }
}
```

### Execution Order

```
Before:  interceptor1.before -> interceptor2.before -> interceptor3.before
Handler: handler(processedReq)
After:   interceptor3.after  -> interceptor2.after  -> interceptor1.after
Error:   interceptor3.onError -> interceptor2.onError -> interceptor1.onError
```

🔥 **Key point**: before hooks execute in forward order, after and error hooks in reverse. This forms an "onion model", similar to Koa or Axios interceptors.

---

## Pattern 4: Plugin Architecture

Plugins are extensions with typed hook points:

```typescript
// ✅ Declare all possible hooks
interface PluginHooks {
  'app:init': { config: Record<string, unknown> }
  'app:ready': { startTime: number }
  'request:before': { url: string; method: string }
  'request:after': { url: string; status: number; duration: number }
  'error': { error: Error; context: string }
}

type HookHandler<T> = (payload: T) => void

interface Plugin {
  name: string
  version: string
  hooks: Partial<{
    [K in keyof PluginHooks]: HookHandler<PluginHooks[K]>
  }>
}
```

### Plugin System

```typescript
class PluginSystem {
  private handlers = new Map<string, HookHandler<never>[]>()

  register(plugin: Plugin): void {
    for (const [hook, handler] of Object.entries(plugin.hooks)) {
      if (!this.handlers.has(hook)) this.handlers.set(hook, [])
      this.handlers.get(hook)!.push(handler as HookHandler<never>)
    }
  }

  // ✅ Type-safe emit — payload is checked by hook name
  emit<K extends keyof PluginHooks>(hook: K, payload: PluginHooks[K]): void {
    const handlers = this.handlers.get(hook) ?? []
    handlers.forEach((h) => h(payload as never))
  }
}
```

### Creating Plugins

```typescript
const analyticsPlugin: Plugin = {
  name: 'analytics',
  version: '1.0.0',
  hooks: {
    // ✅ TypeScript checks payload types for each hook
    'request:after': ({ url, status, duration }) => {
      trackMetric('request', { url, status, latency: duration })
    },
    'error': ({ error, context }) => {
      reportError(error, context)
    },
  },
}

// ✅ Usage
system.emit('request:after', { url: '/api', status: 200, duration: 42 })

// ❌ Compile error
system.emit('request:after', { url: '/api' }) // Missing status and duration
system.emit('unknown:hook', {})                // Unknown hook
```

---

## ⚠️ Common Beginner Mistakes

### Mistake 1: Untyped Context Extensions

```typescript
// ❌ Dynamically adding properties without extending the type
function addUser(ctx: BaseContext) {
  (ctx as any).user = getUser() // Type lost!
  return ctx // Still BaseContext, without user
}

// ✅ Return an extended type
function addUser(ctx: BaseContext): BaseContext & { user: User } {
  return { ...ctx, user: getUser() }
}
```

### Mistake 2: Losing Types When Passing Middleware to Arrays

```typescript
// ❌ Array loses specific types
const middlewares = [addUser, addPermissions] // union type array
// TypeScript can't infer execution order

// ✅ Use pipe with overloads or tuple types
const result = pipe(ctx, addUser, addPermissions) // Types preserved
```

### Mistake 3: Forgetting to Call next()

```typescript
// ❌ Middleware "swallows" the chain
const broken: Middleware<Context> = (ctx, _next) => {
  ctx.logs.push('processing...')
  return ctx // next() not called — remaining middleware won't execute
}

// ✅ Don't forget to call next() if you need to continue the chain
const correct: Middleware<Context> = (ctx, next) => {
  ctx.logs.push('processing...')
  return next() // Pass control forward
}
```

### Mistake 4: Wrong Interceptor Order

```typescript
// ❌ Auth interceptor after handler — useless
const pipeline = createPipeline(
  [timingInterceptor, errorInterceptor], // auth forgotten!
  handler
)

// ✅ Auth should be in the before phase, before handler
const pipeline = createPipeline(
  [authInterceptor, timingInterceptor, errorInterceptor],
  handler
)
```

---

## 💡 Best Practices

1. **Use context accumulation** instead of mutation — each middleware returns an extended type
2. **Type your hook points** in plugin systems — this enables autocomplete and payload checking
3. **Separate before/after** in interceptors — before processes the request, after processes the response
4. **Document middleware order** — order is critical but not always obvious
5. **Short-circuit** middleware should be explicit — not calling `next()` = stopping the chain
6. **Use pipe overloads** for type-safe composition with fixed ordering

---

## 📌 Summary

| Pattern | When to Use | Key Features |
|---------|------------|--------------|
| Middleware Chain | Request processing with shared context | next() to continue, short-circuit to stop |
| Context Accumulation | Gradual data enrichment | Each step extends the type, pipe checks order |
| Interceptors | Before/after processing | Onion model, typed phases |
| Plugin System | Extensible applications | Typed hooks, declarative plugins |
