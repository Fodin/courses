# Уровень 7: Middleware и Pipelines

## 🎯 Цель уровня

Научиться проектировать типобезопасные цепочки обработки (middleware pipelines), где каждое звено может трансформировать контекст, перехватывать ошибки и расширять функциональность — и всё это с полным контролем типов на этапе компиляции.

---

## Проблема: нетипизированные цепочки обработки

В большинстве фреймворков middleware — это функции с сигнатурой `(req, res, next)`, где типы теряются:

```typescript
// ❌ Типичный middleware — типы не контролируются
app.use((req, res, next) => {
  req.user = getUserFromToken(req.headers.authorization) // any
  next()
})

app.use((req, res, next) => {
  // req.user существует? Какой у него тип? Надежда на удачу
  if (req.user.role === 'admin') { // Может быть undefined!
    next()
  }
})
```

Проблемы:
- `req.user` добавляется динамически — TypeScript не знает об этом свойстве
- Порядок middleware критичен, но нигде не проверяется
- Пропуск middleware ломает зависимости без ошибок компиляции
- Перехватчики ошибок не типизированы

---

## Паттерн 1: Типобезопасная цепочка middleware

### Базовый тип middleware

```typescript
// ✅ Middleware с типизированным контекстом
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

### Использование

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
  const result = next() // Вызываем следующий middleware
  result.logs.push(`<- ${result.status}`)
  return result
}

const auth: Middleware<RequestContext> = (ctx, next) => {
  if (!ctx.headers['authorization']) {
    return { ...ctx, status: 401 } // Short-circuit: не вызываем next()
  }
  return next()
}
```

💡 **Ключевая идея**: middleware может вызвать `next()` для продолжения цепочки или вернуть результат напрямую для short-circuit.

---

## Паттерн 2: Аккумуляция контекста

Более мощный паттерн — каждый middleware **добавляет** свойства к контексту:

```typescript
// ✅ Middleware, расширяющий тип контекста
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
  // ✅ ctx.user доступен — TypeScript гарантирует
  permissions: ctx.user.role === 'admin' ? ['read', 'write', 'delete'] : ['read'],
})
```

### Типобезопасный pipe

```typescript
// Перегрузки для типобезопасной композиции
function pipe<A>(ctx: A): A
function pipe<A, B extends A>(ctx: A, m1: AccumulatingMiddleware<A, B>): B
function pipe<A, B extends A, C extends B>(
  ctx: A, m1: AccumulatingMiddleware<A, B>, m2: AccumulatingMiddleware<B, C>
): C
function pipe(ctx: unknown, ...mws: Array<(c: never) => unknown>): unknown {
  return mws.reduce((acc, mw) => mw(acc as never), ctx)
}

// ✅ Типы выводятся автоматически
const result = pipe(base, addUser, addPermissions)
// result: WithPermissions — все свойства доступны

// ❌ Ошибка компиляции — нарушен порядок
const wrong = pipe(base, addPermissions) // BaseCtx не содержит user!
```

📌 **Важно**: перегрузки `pipe` гарантируют, что middleware выполняются в правильном порядке — каждый следующий получает тип, возвращённый предыдущим.

---

## Паттерн 3: Интерсепторы (перехватчики)

Интерсепторы — это пары before/after хуков с типизированными фазами:

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
    // Before hooks: в прямом порядке
    let processed = req
    for (const i of interceptors) {
      if (i.before) processed = i.before(processed)
    }

    // Execute handler
    let response: TRes
    try {
      response = handler(processed)
    } catch (error) {
      // Error hooks: в обратном порядке
      for (let idx = interceptors.length - 1; idx >= 0; idx--) {
        if (interceptors[idx].onError) {
          return interceptors[idx].onError!(error as Error, processed)
        }
      }
      throw error
    }

    // After hooks: в обратном порядке
    let result = response
    for (let idx = interceptors.length - 1; idx >= 0; idx--) {
      if (interceptors[idx].after) result = interceptors[idx].after!(result)
    }
    return result
  }
}
```

### Порядок выполнения

```
Before:  interceptor1.before -> interceptor2.before -> interceptor3.before
Handler: handler(processedReq)
After:   interceptor3.after  -> interceptor2.after  -> interceptor1.after
Error:   interceptor3.onError -> interceptor2.onError -> interceptor1.onError
```

🔥 **Ключевой момент**: before-хуки выполняются в прямом порядке, after и error — в обратном. Это формирует «луковицу» (onion model), как в Koa или Axios interceptors.

---

## Паттерн 4: Плагинная архитектура

Плагины — это расширения с типизированными hook points:

```typescript
// ✅ Объявление всех возможных хуков
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

### Система плагинов

```typescript
class PluginSystem {
  private handlers = new Map<string, HookHandler<never>[]>()

  register(plugin: Plugin): void {
    for (const [hook, handler] of Object.entries(plugin.hooks)) {
      if (!this.handlers.has(hook)) this.handlers.set(hook, [])
      this.handlers.get(hook)!.push(handler as HookHandler<never>)
    }
  }

  // ✅ Типобезопасный emit — payload проверяется по имени хука
  emit<K extends keyof PluginHooks>(hook: K, payload: PluginHooks[K]): void {
    const handlers = this.handlers.get(hook) ?? []
    handlers.forEach((h) => h(payload as never))
  }
}
```

### Создание плагинов

```typescript
const analyticsPlugin: Plugin = {
  name: 'analytics',
  version: '1.0.0',
  hooks: {
    // ✅ TypeScript проверяет типы payload для каждого хука
    'request:after': ({ url, status, duration }) => {
      trackMetric('request', { url, status, latency: duration })
    },
    'error': ({ error, context }) => {
      reportError(error, context)
    },
  },
}

// ✅ Использование
system.emit('request:after', { url: '/api', status: 200, duration: 42 })

// ❌ Ошибка компиляции
system.emit('request:after', { url: '/api' }) // Нет status и duration
system.emit('unknown:hook', {})                // Неизвестный хук
```

---

## ⚠️ Частые ошибки новичков

### Ошибка 1: Нетипизированные расширения контекста

```typescript
// ❌ Динамическое добавление свойств без расширения типа
function addUser(ctx: BaseContext) {
  (ctx as any).user = getUser() // Тип потерян!
  return ctx // Всё ещё BaseContext, без user
}

// ✅ Возвращаем расширенный тип
function addUser(ctx: BaseContext): BaseContext & { user: User } {
  return { ...ctx, user: getUser() }
}
```

### Ошибка 2: Потеря типов при передаче middleware в массив

```typescript
// ❌ Массив теряет конкретные типы
const middlewares = [addUser, addPermissions] // (BaseCtx => WithUser | WithUser => WithPermissions)[]
// TypeScript не может вывести порядок выполнения

// ✅ Используйте pipe с перегрузками или tuple types
const result = pipe(ctx, addUser, addPermissions) // Типы сохранены
```

### Ошибка 3: Забытый вызов next()

```typescript
// ❌ Middleware «съедает» цепочку
const broken: Middleware<Context> = (ctx, _next) => {
  ctx.logs.push('processing...')
  return ctx // next() не вызван — остальные middleware не выполнятся
}

// ✅ Не забывайте вызывать next() если нужно продолжить цепочку
const correct: Middleware<Context> = (ctx, next) => {
  ctx.logs.push('processing...')
  return next() // Передаём управление дальше
}
```

### Ошибка 4: Неверный порядок интерсепторов

```typescript
// ❌ Auth интерсептор после handler — бесполезен
const pipeline = createPipeline(
  [timingInterceptor, errorInterceptor], // auth забыт!
  handler
)

// ✅ Auth должен быть в before-фазе, перед handler
const pipeline = createPipeline(
  [authInterceptor, timingInterceptor, errorInterceptor],
  handler
)
```

---

## 💡 Best Practices

1. **Используйте аккумуляцию контекста** вместо мутации — каждый middleware возвращает расширенный тип
2. **Типизируйте hook-точки** в плагинной системе — это даёт автодополнение и проверку payload
3. **Разделяйте before/after** в интерсепторах — before обрабатывает запрос, after — ответ
4. **Документируйте порядок** middleware — порядок критичен, но не всегда очевиден
5. **Short-circuit** middleware должен быть явным — не вызвал `next()` = остановил цепочку
6. **Используйте перегрузки pipe** для типобезопасной композиции с фиксированным порядком

---

## 📌 Итоги

| Паттерн | Когда использовать | Особенности |
|---------|-------------------|-------------|
| Middleware Chain | Обработка запросов с общим контекстом | next() для продолжения, short-circuit для остановки |
| Context Accumulation | Постепенное обогащение данных | Каждый шаг расширяет тип, pipe проверяет порядок |
| Interceptors | Before/after обработка | Onion model, типизированные фазы |
| Plugin System | Расширяемые приложения | Типизированные хуки, декларативные плагины |
