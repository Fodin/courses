# Уровень 8: Сериализация и схемы

## 🎯 Цель уровня

Научиться проектировать типобезопасные системы сериализации: выводить TypeScript-типы из runtime-определений схем, создавать двунаправленные кодеки и строить миграционные пайплайны для версионированных данных.

---

## Проблема: разрыв между типами и рантаймом

TypeScript типы существуют только на этапе компиляции. При работе с данными из внешних источников (API, база данных, файлы) типы «стираются», и мы остаёмся без защиты:

```typescript
// ❌ Тип объявлен, но рантайм-проверки нет
interface User {
  id: number
  name: string
  email: string
}

const data = JSON.parse(rawJson) as User // Опасный cast!
// Если rawJson содержит { id: "not-a-number" }, ошибка обнаружится позже
```

Нужен механизм, который:
1. Описывает структуру данных один раз
2. Автоматически выводит TypeScript-тип
3. Валидирует данные в рантайме

---

## Паттерн 1: Вывод типов из схемы (Schema Inference)

Идея: определяем схему как обычный объект, а TypeScript **выводит** из неё тип.

### Определение полей схемы

```typescript
type SchemaType = 'string' | 'number' | 'boolean'

interface SchemaField<T extends SchemaType> {
  type: T
  required?: boolean
}

function field<T extends SchemaType>(type: T, required = true): SchemaField<T> {
  return { type, required }
}
```

### Вывод типа из схемы

```typescript
// ✅ Условный тип, маппящий string-литерал в TypeScript-тип
type InferFieldType<T extends SchemaField<SchemaType>> =
  T extends SchemaField<'string'> ? string :
  T extends SchemaField<'number'> ? number :
  T extends SchemaField<'boolean'> ? boolean :
  never

// ✅ Рекурсивный маппинг всей схемы
type InferSchema<T extends ObjectSchema> = {
  [K in keyof T]: T[K] extends SchemaField<SchemaType>
    ? T[K]['required'] extends false
      ? InferFieldType<T[K]> | undefined
      : InferFieldType<T[K]>
    : T[K] extends ObjectSchema
      ? InferSchema<T[K]>
      : never
}
```

### Использование

```typescript
const userSchema = createSchema({
  id: field('number'),
  name: field('string'),
  isActive: field('boolean'),
  nickname: field('string', false), // optional
})

// TypeScript автоматически выводит:
// { id: number; name: string; isActive: boolean; nickname: string | undefined }

const parsed = userSchema.parse(unknownData)
if (parsed) {
  parsed.id      // number ✅
  parsed.name    // string ✅
  parsed.unknown // Error! ✅
}
```

💡 **Ключевая идея**: тип определяется один раз (в схеме) и используется как для рантайм-валидации, так и для compile-time проверки. Это принцип «single source of truth» для типов.

---

## Паттерн 2: Кодеки (Codec)

Кодек — это пара функций encode/decode с типизированными входами и выходами:

```typescript
interface Codec<TDecoded, TEncoded> {
  encode: (value: TDecoded) => TEncoded
  decode: (value: TEncoded) => TDecoded
  pipe<TFinal>(other: Codec<TEncoded, TFinal>): Codec<TDecoded, TFinal>
}
```

### Базовые кодеки

```typescript
const dateCodec = createCodec<Date, string>(
  (date) => date.toISOString(),
  (str) => new Date(str)
)

const base64Codec = createCodec<string, string>(
  (str) => btoa(str),
  (encoded) => atob(encoded)
)

const jsonCodec = createCodec<Record<string, unknown>, string>(
  (obj) => JSON.stringify(obj),
  (str) => JSON.parse(str)
)
```

### Композиция через pipe

```typescript
// ✅ Compose: object -> JSON string -> Base64 string
const compressedJson = jsonCodec.pipe(base64Codec)
// Codec<Record<string, unknown>, string>

const encoded = compressedJson.encode({ name: 'Alice' })
// "eyJuYW1lIjoiQWxpY2UifQ=="

const decoded = compressedJson.decode(encoded)
// { name: 'Alice' }
```

🔥 **Ключевой момент**: `pipe` работает только когда выходной тип первого кодека совпадает с входным типом второго. Это проверяется на этапе компиляции:

```typescript
// ❌ Ошибка: jsonCodec выводит string, numberCodec ожидает number
jsonCodec.pipe(numberCodec) // Type error!
```

---

## Паттерн 3: Типобезопасные миграции данных

Когда схема данных эволюционирует, нужен механизм миграции:

```typescript
interface Migration<TFrom, TTo> {
  fromVersion: number
  toVersion: number
  migrate: (data: TFrom) => TTo
}

interface VersionedData<T> {
  version: number
  data: T
}
```

### Цепочка миграций

```typescript
// V1 -> V2: разделение name на firstName/lastName
const v1toV2 = createMigration<UserV1, UserV2>(1, 2, (data) => {
  const [first, ...rest] = data.name.split(' ')
  return {
    firstName: first,
    lastName: rest.join(' '),
    email: data.email,
    createdAt: new Date().toISOString(),
  }
})

// V2 -> V3: email -> emails (массив)
const v2toV3 = createMigration<UserV2, UserV3>(2, 3, (data) => ({
  ...data,
  emails: { primary: data.email },
  role: 'user',
}))
```

### Pipeline миграций

```typescript
class MigrationPipeline {
  private migrations: Migration<unknown, unknown>[] = []

  register<TFrom, TTo>(migration: Migration<TFrom, TTo>): this {
    this.migrations.push(migration as Migration<unknown, unknown>)
    return this
  }

  migrate<T>(versioned: VersionedData<unknown>, target: number): VersionedData<T> {
    let current = versioned
    for (const m of this.migrations) {
      if (current.version === m.fromVersion && m.toVersion <= target) {
        current = { version: m.toVersion, data: m.migrate(current.data) }
      }
    }
    return current as VersionedData<T>
  }
}

// ✅ Данные из V1 автоматически проходят через все промежуточные миграции
const result = pipeline.migrate<UserV4>(v1Data, 4)
// V1 -> V2 -> V3 -> V4 — все трансформации применены
```

📌 **Важно**: каждая миграция типизирована (вход V1, выход V2), что гарантирует корректность трансформаций на этапе определения. Pipeline применяет миграции последовательно по номерам версий.

---

## ⚠️ Частые ошибки новичков

### Ошибка 1: as вместо валидации

```typescript
// ❌ Type assertion — не даёт рантайм-защиты
const user = data as User

// ✅ Валидация через схему
const user = userSchema.parse(data)
if (user) {
  // Здесь user точно соответствует типу
}
```

### Ошибка 2: Потеря связи encode/decode

```typescript
// ❌ encode и decode не согласованы
const broken = createCodec<Date, string>(
  (d) => d.toISOString(),
  (s) => new Date(s + 'INVALID') // Roundtrip сломан!
)

// ✅ Всегда проверяйте roundtrip: decode(encode(x)) === x
const correct = createCodec<Date, string>(
  (d) => d.toISOString(),
  (s) => new Date(s)
)
```

### Ошибка 3: Пропуск версий в миграциях

```typescript
// ❌ Есть V1->V2 и V3->V4, но нет V2->V3 — данные застрянут на V2
pipeline.register(v1toV2)
pipeline.register(v3toV4) // V2->V3 отсутствует!

// ✅ Все промежуточные версии должны быть покрыты
pipeline.register(v1toV2)
pipeline.register(v2toV3)
pipeline.register(v3toV4)
```

### Ошибка 4: Мутация данных в миграциях

```typescript
// ❌ Мутация исходных данных
const migration = createMigration<V1, V2>(1, 2, (data) => {
  (data as any).newField = 'value' // Мутирует оригинал!
  return data as unknown as V2
})

// ✅ Создание нового объекта
const migration = createMigration<V1, V2>(1, 2, (data) => ({
  ...data,
  newField: 'value',
}))
```

---

## 💡 Best Practices

1. **Schema as single source of truth** — определяйте структуру один раз, выводите типы и валидацию из неё
2. **Roundtrip-тест для кодеков** — `decode(encode(x))` должен возвращать эквивалент `x`
3. **Версионируйте данные** — каждая запись содержит номер версии для правильной миграции
4. **Иммутабельные миграции** — создавайте новый объект, не мутируйте старый
5. **Линейная цепочка миграций** — каждая версия имеет ровно одну миграцию к следующей
6. **Композиция кодеков** через `pipe` — вместо монолитного encode/decode

---

## 📌 Итоги

| Паттерн | Когда использовать | Особенности |
|---------|-------------------|-------------|
| Schema Inference | Валидация внешних данных | Один источник правды для типов и рантайма |
| Codec | Преобразование данных между форматами | Двунаправленный, композируемый |
| Data Migrations | Эволюция схем данных | Версионированный, последовательный |
