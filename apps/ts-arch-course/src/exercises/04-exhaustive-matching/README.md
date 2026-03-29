# 🔥 Уровень 4: Исчерпывающее сопоставление (Exhaustive Matching)

## 🎯 Зачем нужно исчерпывающее сопоставление

В реальных приложениях мы постоянно работаем с вариантами: статусы заказов, типы уведомлений, HTTP-методы, состояния загрузки данных. Каждый раз, когда появляется новый вариант, нужно гарантировать, что **все** места в коде, обрабатывающие эти варианты, обновлены.

Без исчерпывающего сопоставления добавление нового варианта -- это мина замедленного действия. Код компилируется, тесты проходят, а в продакшене внезапно `undefined` вместо результата.

```typescript
type Status = 'active' | 'inactive' | 'suspended'

// ❌ Через полгода добавили 'pending', а switch не обновили
function getLabel(status: Status): string {
  switch (status) {
    case 'active': return 'Активен'
    case 'inactive': return 'Неактивен'
    // suspended и pending не обработаны — тихая ошибка
  }
  return 'Неизвестно' // default скрывает проблему
}
```

TypeScript предоставляет мощные инструменты, чтобы **компилятор** ловил такие ошибки за нас.

## 📌 Never-проверка: основа исчерпывающего сопоставления

Тип `never` в TypeScript означает "этого не может быть". Если значение дошло до точки, где его тип сужен до `never`, значит что-то пошло не так -- мы не обработали все варианты.

```typescript
function assertNever(value: never): never {
  throw new Error(`Unexpected value: ${JSON.stringify(value)}`)
}

type Status = 'active' | 'inactive' | 'suspended'

function getLabel(status: Status): string {
  switch (status) {
    case 'active': return 'Активен'
    case 'inactive': return 'Неактивен'
    case 'suspended': return 'Заблокирован'
    default: return assertNever(status) // ✅ компилятор проверит
  }
}
```

Если добавить `'pending'` в тип `Status`, TypeScript сразу покажет ошибку:

```
Argument of type 'string' is not assignable to parameter of type 'never'.
```

### Как это работает внутри

TypeScript использует **control flow analysis** (анализ потока управления). В каждом `case` он **сужает** тип переменной, вычитая обработанные варианты:

```typescript
function explain(status: Status) {
  // status: 'active' | 'inactive' | 'suspended'

  if (status === 'active') {
    // status: 'active'
    return
  }
  // status: 'inactive' | 'suspended'

  if (status === 'inactive') {
    // status: 'inactive'
    return
  }
  // status: 'suspended'

  if (status === 'suspended') {
    // status: 'suspended'
    return
  }
  // status: never ← все варианты обработаны
}
```

## 🔥 Match Expression: функциональная альтернатива switch

`switch` работает, но у него есть проблемы: забытый `break`, отступы, невозможность использовать как выражение. Match-функция решает все эти проблемы:

```typescript
type MatchHandlers<T extends string, R> = {
  [K in T]: (value: K) => R
}

function match<T extends string>(value: T) {
  return {
    with<R>(handlers: MatchHandlers<T, R>): R {
      const handler = handlers[value]
      return handler(value)
    },
  }
}
```

### Использование

```typescript
type Theme = 'light' | 'dark' | 'system'

// ✅ Выражение, а не инструкция — можно использовать в const
const backgroundColor = match(theme).with({
  light: () => '#ffffff',
  dark: () => '#1a1a1a',
  system: () => window.matchMedia('(prefers-color-scheme: dark)').matches
    ? '#1a1a1a'
    : '#ffffff',
})
```

### Почему это работает

Mapped type `{ [K in T]: ... }` гарантирует, что объект `handlers` содержит ключ для **каждого** варианта `T`. Если `T = 'a' | 'b' | 'c'`, то handlers обязан иметь все три ключа.

```typescript
// ❌ Ошибка компиляции: Property 'system' is missing
const bg = match(theme).with({
  light: () => '#ffffff',
  dark: () => '#1a1a1a',
  // system пропущен!
})
```

## 📌 Tagged Unions и паттерн-матчинг

Для более сложных типов данных используются **tagged unions** (размеченные объединения) -- типы с общим полем-дискриминатором:

```typescript
type Shape =
  | { kind: 'circle'; radius: number }
  | { kind: 'rectangle'; width: number; height: number }
  | { kind: 'triangle'; base: number; height: number }
```

### Match для tagged unions

```typescript
function matchTagged<T extends { kind: string }>(value: T) {
  return {
    with<R>(
      handlers: { [K in T['kind']]: (val: Extract<T, { kind: K }>) => R }
    ): R {
      const handler = (handlers as Record<string, (val: T) => R>)[value.kind]
      return handler(value)
    },
  }
}
```

Ключевая магия здесь -- `Extract<T, { kind: K }>`. Это утилитарный тип, который извлекает из union `T` только тот вариант, где `kind === K`. Это даёт доступ к специфичным полям каждого варианта:

```typescript
const area = matchTagged(shape).with({
  circle: (s) => Math.PI * s.radius ** 2,    // s: { kind: 'circle'; radius: number }
  rectangle: (s) => s.width * s.height,       // s: { kind: 'rectangle'; ... }
  triangle: (s) => 0.5 * s.base * s.height,   // s: { kind: 'triangle'; ... }
})
```

## 🔥 Variant Types: конструкторы для tagged unions

Создавать tagged union вручную каждый раз утомительно. Паттерн **Variant** предоставляет типобезопасные конструкторы:

```typescript
type Variant<Tag extends string, Data = undefined> = Data extends undefined
  ? { readonly _tag: Tag }
  : { readonly _tag: Tag; readonly data: Data }

// Конструктор-функция
function variant<Tag extends string>(tag: Tag): Variant<Tag>
function variant<Tag extends string, Data>(tag: Tag, data: Data): Variant<Tag, Data>
function variant(tag: string, data?: unknown) {
  return data === undefined ? { _tag: tag } : { _tag: tag, data }
}
```

### Практический пример: RemoteData

```typescript
type RemoteData<E, A> =
  | Variant<'NotAsked'>
  | Variant<'Loading'>
  | Variant<'Failure', E>
  | Variant<'Success', A>

// Конструкторы
const NotAsked = (): RemoteData<never, never> => variant('NotAsked')
const Loading = (): RemoteData<never, never> => variant('Loading')
const Failure = <E,>(error: E): RemoteData<E, never> => variant('Failure', error)
const Success = <A,>(value: A): RemoteData<never, A> => variant('Success', value)

// Использование
const state: RemoteData<Error, User[]> = Loading()
// Позже:
const loaded: RemoteData<Error, User[]> = Success([{ name: 'Alice' }])
```

## 📌 Pattern Extraction: извлечение данных из паттернов

Часто нужно не просто сопоставить, но и **извлечь** данные из конкретного варианта. Для этого нужна комбинация type guard + extraction:

```typescript
type PatternMatcher<T extends { _tag: string }> = {
  // Извлечь данные конкретного варианта или null
  extract<Tag extends T['_tag']>(tag: Tag, value: T): ExtractData<T, Tag> | null

  // Type guard: сузить тип
  is<Tag extends T['_tag']>(tag: Tag, value: T): value is Extract<T, { _tag: Tag }>

  // Применить функцию к данным, если тег совпал
  map<Tag extends T['_tag'], R>(
    tag: Tag, value: T, fn: (data: ExtractData<T, Tag>) => R
  ): R | null

  // Исчерпывающая обработка всех вариантов
  fold<R>(
    value: T,
    handlers: { [K in T['_tag']]: (data: ExtractData<T, K>) => R }
  ): R
}
```

### Вспомогательные типы

```typescript
type ExtractTag<T extends { _tag: string }, Tag extends T['_tag']> =
  Extract<T, { _tag: Tag }>

type ExtractData<T extends { _tag: string }, Tag extends T['_tag']> =
  ExtractTag<T, Tag> extends { data: infer D } ? D : undefined
```

### Использование

```typescript
type ApiResponse =
  | Variant<'Ok', { items: string[]; total: number }>
  | Variant<'NotFound'>
  | Variant<'Unauthorized', { reason: string }>

const matcher = createMatcher<ApiResponse>()

// extract — получить данные или null
const data = matcher.extract('Ok', response)
if (data !== null) {
  console.log(data.items) // string[] — типобезопасно
}

// is — type guard
if (matcher.is('Unauthorized', response)) {
  console.log(response.data.reason) // TypeScript знает тип
}

// fold — исчерпывающая обработка
const message = matcher.fold(response, {
  Ok: (data) => `Loaded ${data.items.length} items`,
  NotFound: () => 'Not found',
  Unauthorized: (data) => `Auth error: ${data.reason}`,
})
```

## 💡 Продвинутые паттерны

### Match с default-обработчиком

Иногда нужно обработать несколько конкретных вариантов и иметь catch-all для остальных:

```typescript
function matchWithDefault<T extends string>(value: T) {
  return {
    with<R>(handlers: Partial<Record<T, (value: T) => R>> & { _default: (value: T) => R }): R {
      const handler = handlers[value] ?? handlers._default
      return handler(value)
    },
  }
}

// Обрабатываем только конкретные случаи
const priority = matchWithDefault(status).with({
  critical: () => 1,
  high: () => 2,
  _default: () => 99,
})
```

### Composable matchers

```typescript
function pipe<T extends { _tag: string }, R>(
  value: T,
  ...matchers: Array<(v: T) => R | null>
): R | null {
  for (const matcher of matchers) {
    const result = matcher(value)
    if (result !== null) return result
  }
  return null
}
```

## ⚠️ Частые ошибки начинающих

### Ошибка 1: Default ветка, скрывающая проблему

```typescript
// ❌ default скрывает необработанные варианты
function handle(status: Status): string {
  switch (status) {
    case 'active': return 'Active'
    default: return 'Unknown' // Если добавят новый статус — тишина
  }
}

// ✅ assertNever гарантирует обработку всех вариантов
function handle(status: Status): string {
  switch (status) {
    case 'active': return 'Active'
    case 'inactive': return 'Inactive'
    case 'suspended': return 'Suspended'
    default: return assertNever(status)
  }
}
```

### Ошибка 2: Строковые проверки вместо дискриминатора

```typescript
// ❌ TypeScript не может сузить тип по произвольному условию
function process(item: Shape) {
  if ('radius' in item) {
    // item всё ещё Shape, не { kind: 'circle'; radius: number }
  }
}

// ✅ Проверка по дискриминатору работает с control flow
function process(item: Shape) {
  if (item.kind === 'circle') {
    // item: { kind: 'circle'; radius: number } — сужение работает
    console.log(item.radius)
  }
}
```

### Ошибка 3: Забытый return в switch

```typescript
// ❌ Без return — fall-through
function label(s: Status) {
  switch (s) {
    case 'active':
      console.log('Active') // fall-through к следующему case!
    case 'inactive':
      return 'Not active'
  }
}

// ✅ Match expression не имеет этой проблемы
const label = match(s).with({
  active: () => 'Active',
  inactive: () => 'Not active',
  suspended: () => 'Suspended',
})
```

### Ошибка 4: Мутабельный дискриминатор

```typescript
// ❌ Если _tag мутабелен, паттерн-матчинг ненадёжен
const item = { _tag: 'Ok', data: 42 }
item._tag = 'Error' // Тип не изменился, но данные не соответствуют

// ✅ readonly дискриминатор
type Variant<Tag extends string, Data = undefined> = Data extends undefined
  ? { readonly _tag: Tag }
  : { readonly _tag: Tag; readonly data: Data }
```

## 💡 Best Practices

1. **Всегда используйте `assertNever`** в default-ветке switch, если обрабатываете все варианты union type
2. **Предпочитайте match-выражения** switch-конструкциям -- они возвращают значение и не имеют fall-through
3. **Используйте `readonly` для тегов** -- мутабельный дискриминатор разрушает типобезопасность
4. **Выносите конструкторы вариантов** в отдельные функции -- это упрощает создание и обеспечивает типобезопасность
5. **Используйте `Extract` для сужения union типов** -- это ключ к типобезопасному паттерн-матчингу
6. **Группируйте связанные варианты** в один union type, а не в отдельные типы
