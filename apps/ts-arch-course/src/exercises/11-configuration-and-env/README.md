# 🔥 Уровень 11: Конфигурация и окружение

## 🎯 Зачем нужна типобезопасная конфигурация

Конфигурация приложения -- один из главных источников runtime-ошибок. Опечатка в имени переменной окружения, отсутствующий обязательный параметр, строка вместо числа -- всё это приводит к падениям в продакшене.

Без типобезопасной конфигурации:

```typescript
// ❌ Типичные проблемы
const port = process.env.PORT // string | undefined
const debug = process.env.DEBUG // "true" -- строка, не boolean!

// Забыли проверить:
const server = app.listen(port) // port может быть undefined
if (debug) { /* "false" — truthy! */ }

// Опечатка:
const dbUrl = process.env.DATABSE_URL // никто не заметит
```

TypeScript позволяет:
- Валидировать конфигурацию при старте приложения
- Автоматически преобразовывать типы (string -> number, string -> boolean)
- Гарантировать наличие обязательных полей
- Типизировать допустимые значения (enum-ограничения)

## 📌 Config Loader: загрузка с валидацией по схеме

### Определение схемы конфигурации

Первый шаг -- описать схему, определяющую структуру конфигурации:

```typescript
interface ConfigSchema {
  readonly [key: string]: {
    readonly type: 'string' | 'number' | 'boolean'
    readonly required?: boolean
    readonly default?: string | number | boolean
    readonly validate?: (value: unknown) => boolean
  }
}

const appConfig = {
  DATABASE_URL: { type: 'string', required: true },
  PORT: { type: 'number', default: 3000 },
  DEBUG: { type: 'boolean', default: false },
  MAX_CONNECTIONS: {
    type: 'number',
    default: 10,
    validate: (v) => typeof v === 'number' && v > 0 && v <= 100,
  },
} satisfies ConfigSchema
```

### Вывод типа из схемы

Ключевой паттерн -- `InferConfig<S>`, который автоматически выводит тип результата:

```typescript
type InferConfig<S extends ConfigSchema> = {
  readonly [K in keyof S]: S[K]['type'] extends 'string'
    ? string
    : S[K]['type'] extends 'number'
      ? number
      : S[K]['type'] extends 'boolean'
        ? boolean
        : never
}

// InferConfig<typeof appConfig> = {
//   DATABASE_URL: string
//   PORT: number
//   DEBUG: boolean
//   MAX_CONNECTIONS: number
// }
```

### Результат загрузки через Result type

Вместо бросания исключений используем Result type:

```typescript
type ConfigError = { field: string; message: string }

type ConfigResult<T> =
  | { ok: true; value: T }
  | { ok: false; errors: ConfigError[] }
```

Это позволяет собрать **все** ошибки конфигурации за один проход, а не падать на первой.

### Загрузчик с поддержкой окружений

```typescript
function createConfigLoader<S extends ConfigSchema>(schema: S) {
  return {
    load(
      env: Record<string, string | undefined>,
      overrides?: Partial<Record<keyof S, string | number | boolean>>
    ): ConfigResult<InferConfig<S>> {
      const errors: ConfigError[] = []
      const result: Record<string, unknown> = {}

      for (const [key, def] of Object.entries(schema)) {
        // Приоритет: overrides > env > default
        const rawValue = overrides?.[key] !== undefined
          ? String(overrides[key])
          : env[key]

        if (!rawValue) {
          if (def.default !== undefined) {
            result[key] = def.default
            continue
          }
          if (def.required) {
            errors.push({ field: key, message: `Required: "${key}"` })
            continue
          }
        }
        // Парсинг и валидация...
      }

      if (errors.length > 0) return { ok: false, errors }
      return { ok: true, value: result as InferConfig<S> }
    },

    merge(base: InferConfig<S>, override: Partial<InferConfig<S>>): InferConfig<S> {
      return { ...base, ...override } as InferConfig<S>
    },
  }
}
```

## 📌 Feature Flags: типобезопасные флаги

### Реестр флагов

Feature Flags -- механизм включения/отключения функциональности без деплоя. Типобезопасный реестр гарантирует, что:
- Каждый флаг имеет описание и значение по умолчанию
- Тип значения флага фиксирован (boolean, number, string)
- Обращение к несуществующему флагу -- ошибка компиляции

```typescript
interface FlagDefinition<T extends string | number | boolean = boolean> {
  readonly description: string
  readonly defaultValue: T
  readonly type: T extends string ? 'string'
    : T extends number ? 'number'
    : 'boolean'
}

type FlagRegistry = Record<string, FlagDefinition<string | number | boolean>>

const featureRegistry = {
  DARK_MODE: {
    description: 'Enable dark mode UI',
    defaultValue: false,
    type: 'boolean',
  },
  MAX_UPLOAD_SIZE: {
    description: 'Maximum upload size in MB',
    defaultValue: 10,
    type: 'number',
  },
  API_VERSION: {
    description: 'API version string',
    defaultValue: 'v1',
    type: 'string',
  },
} satisfies FlagRegistry
```

### Вывод типов значений

```typescript
type FlagValues<R extends FlagRegistry> = {
  readonly [K in keyof R]: R[K] extends FlagDefinition<infer T> ? T : never
}

// FlagValues<typeof featureRegistry> = {
//   DARK_MODE: boolean
//   MAX_UPLOAD_SIZE: number
//   API_VERSION: string
// }
```

### Сервис Feature Flags

```typescript
interface FeatureFlagService<R extends FlagRegistry> {
  isEnabled(flag: keyof R): boolean
  getValue<K extends keyof R>(flag: K): FlagValues<R>[K]
  getAll(): FlagValues<R>
  override<K extends keyof R>(flag: K, value: FlagValues<R>[K]): void
  reset(flag: keyof R): void
  resetAll(): void
}
```

Обратите внимание: `getValue` возвращает конкретный тип для каждого флага. Если `flag` -- `'MAX_UPLOAD_SIZE'`, результат будет `number`, а не `string | number | boolean`.

## 📌 Environment Types: типизация переменных окружения

### Декларативная спецификация

Вместо ручного парсинга каждой переменной создаём декларативную спецификацию:

```typescript
type EnvVarDef<T = string> = {
  readonly key: string
  readonly transform?: (raw: string) => T
  readonly fallback?: T
  readonly required?: boolean
}

function envString(key: string, opts?: { fallback?: string; required?: boolean }): EnvVarDef<string> {
  return { key, fallback: opts?.fallback, required: opts?.required }
}

function envNumber(key: string, opts?: { fallback?: number; required?: boolean }): EnvVarDef<number> {
  return {
    key,
    transform: (raw) => {
      const num = Number(raw)
      if (Number.isNaN(num)) throw new Error(`"${key}" is not a valid number`)
      return num
    },
    fallback: opts?.fallback,
    required: opts?.required,
  }
}

function envBoolean(key: string, opts?: { fallback?: boolean }): EnvVarDef<boolean> {
  return {
    key,
    transform: (raw) => {
      if (raw === 'true' || raw === '1') return true
      if (raw === 'false' || raw === '0') return false
      throw new Error(`"${key}" must be "true"/"false"`)
    },
    fallback: opts?.fallback,
  }
}
```

### Enum-ограничения

Для переменных с ограниченным набором допустимых значений:

```typescript
function envEnum<T extends string>(
  key: string,
  allowed: readonly T[],
  opts?: { fallback?: T }
): EnvVarDef<T> {
  return {
    key,
    transform: (raw) => {
      if (!allowed.includes(raw as T)) {
        throw new Error(`"${key}" must be one of [${allowed.join(', ')}]`)
      }
      return raw as T
    },
    fallback: opts?.fallback,
  }
}

// Использование:
const nodeEnv = envEnum('NODE_ENV', ['development', 'staging', 'production'] as const, {
  fallback: 'development',
})
// Тип: EnvVarDef<'development' | 'staging' | 'production'>
```

### Вывод типа всего окружения

```typescript
type EnvSpec = Record<string, EnvVarDef<unknown>>

type InferEnv<S extends EnvSpec> = {
  readonly [K in keyof S]: S[K] extends EnvVarDef<infer T> ? T : never
}

const appEnvSpec = {
  nodeEnv: envEnum('NODE_ENV', ['development', 'staging', 'production'] as const),
  port: envNumber('PORT', { fallback: 3000 }),
  dbUrl: envString('DATABASE_URL', { required: true }),
  debug: envBoolean('DEBUG', { fallback: false }),
}

// InferEnv<typeof appEnvSpec> = {
//   nodeEnv: 'development' | 'staging' | 'production'
//   port: number
//   dbUrl: string
//   debug: boolean
// }
```

## ⚠️ Частые ошибки новичков

### Ошибка 1: Прямое использование process.env

```typescript
// ❌ Плохо: нет валидации, нет преобразования типов
function connectDB() {
  const url = process.env.DATABASE_URL! // может быть undefined
  const pool = process.env.MAX_POOL      // строка, не число
  return createPool(url, { max: Number(pool) }) // NaN если не задано
}

// ✅ Хорошо: валидация при старте
const config = loadConfig(appConfigSchema, process.env)
if (!config.ok) {
  console.error('Invalid config:', config.errors)
  process.exit(1)
}
// config.value.maxPool уже number, config.value.dbUrl гарантированно string
```

### Ошибка 2: "true" !== true

```typescript
// ❌ Плохо: строковые значения из .env
const debug = process.env.DEBUG // "false"
if (debug) { // true! Строка "false" — truthy
  enableDebugMode()
}

// ✅ Хорошо: явное преобразование через схему
const config = loadEnv(spec, process.env)
if (config.ok && config.value.debug) {
  enableDebugMode() // debug: boolean, не string
}
```

### Ошибка 3: Отсутствие валидации при старте

```typescript
// ❌ Плохо: ошибка обнаруживается при первом запросе
app.get('/users', async (req, res) => {
  const db = connect(process.env.DB_URL!) // падает через 5 минут после старта
})

// ✅ Хорошо: fail fast при старте
const config = loadEnv(appEnvSpec, process.env)
if (!config.ok) {
  for (const err of config.errors) {
    console.error(`Config error: ${err}`)
  }
  process.exit(1)
}
```

### Ошибка 4: Feature flags без значений по умолчанию

```typescript
// ❌ Плохо: flag может быть undefined
function getUploadLimit(): number {
  return featureFlags.get('MAX_UPLOAD') ?? 10 // magic number
}

// ✅ Хорошо: default определён в реестре
const flags = createFeatureFlags({
  MAX_UPLOAD: { defaultValue: 10, type: 'number', description: '...' },
})
flags.getValue('MAX_UPLOAD') // всегда number, default в реестре
```

## 💡 Best Practices

### 1. Fail Fast: валидируйте при старте

Вся конфигурация должна быть провалидирована **до** того, как приложение начнёт принимать запросы. Это позволяет обнаружить проблемы мгновенно, а не через часы работы.

### 2. Собирайте все ошибки

Возвращайте список **всех** ошибок конфигурации, а не бросайте исключение на первой. Это экономит время при настройке нового окружения.

### 3. Используйте satisfies для схем

`satisfies ConfigSchema` проверяет структуру, но сохраняет литеральные типы. Это критично для вывода точных типов через `InferConfig`.

### 4. Разделяйте конфигурацию по модулям

```typescript
const dbConfig = { ... } satisfies ConfigSchema
const cacheConfig = { ... } satisfies ConfigSchema
const authConfig = { ... } satisfies ConfigSchema

// Каждый модуль загружает только свою конфигурацию
const db = createConfigLoader(dbConfig).load(env)
const cache = createConfigLoader(cacheConfig).load(env)
```

### 5. Feature flags: документируйте в реестре

Каждый флаг должен иметь `description`. Реестр флагов -- это документация, доступная всей команде.

### 6. Используйте const assertions для enum

```typescript
// ❌ Массив теряет литеральные типы
const envs = ['dev', 'staging', 'prod']  // string[]

// ✅ as const сохраняет литеральные типы
const envs = ['dev', 'staging', 'prod'] as const  // readonly ['dev', 'staging', 'prod']
```
