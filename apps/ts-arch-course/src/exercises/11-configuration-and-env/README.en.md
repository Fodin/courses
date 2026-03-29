# 🔥 Level 11: Configuration and Environment

## 🎯 Why Type-Safe Configuration Matters

Application configuration is one of the main sources of runtime errors. A typo in an environment variable name, a missing required parameter, a string instead of a number -- all of this leads to production crashes.

Without type-safe configuration:

```typescript
// ❌ Typical problems
const port = process.env.PORT // string | undefined
const debug = process.env.DEBUG // "true" — a string, not boolean!

// Forgot to check:
const server = app.listen(port) // port might be undefined
if (debug) { /* "false" is truthy! */ }

// Typo:
const dbUrl = process.env.DATABSE_URL // nobody will notice
```

TypeScript enables:
- Validating configuration at application startup
- Automatic type conversion (string -> number, string -> boolean)
- Guaranteeing presence of required fields
- Typing allowed values (enum constraints)

## 📌 Config Loader: Loading with Schema Validation

### Defining a Configuration Schema

The first step is to describe a schema that defines the configuration structure:

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

### Inferring Types from Schema

The key pattern is `InferConfig<S>`, which automatically infers the result type:

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

### Loading Result via Result Type

Instead of throwing exceptions, we use a Result type:

```typescript
type ConfigError = { field: string; message: string }

type ConfigResult<T> =
  | { ok: true; value: T }
  | { ok: false; errors: ConfigError[] }
```

This allows collecting **all** configuration errors in a single pass rather than failing on the first one.

### Loader with Environment Support

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
        // Priority: overrides > env > default
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
        // Parsing and validation...
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

## 📌 Feature Flags: Type-Safe Flags

### Flag Registry

Feature Flags are a mechanism for toggling functionality without deployment. A type-safe registry guarantees that:
- Each flag has a description and default value
- The value type is fixed (boolean, number, string)
- Accessing a non-existent flag is a compile error

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

### Inferring Value Types

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

### Feature Flag Service

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

Note that `getValue` returns a specific type for each flag. If `flag` is `'MAX_UPLOAD_SIZE'`, the result will be `number`, not `string | number | boolean`.

## 📌 Environment Types: Typed Environment Variables

### Declarative Specification

Instead of manually parsing each variable, we create a declarative specification:

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

### Enum Constraints

For variables with a limited set of allowed values:

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

// Usage:
const nodeEnv = envEnum('NODE_ENV', ['development', 'staging', 'production'] as const, {
  fallback: 'development',
})
// Type: EnvVarDef<'development' | 'staging' | 'production'>
```

### Inferring the Full Environment Type

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

## ⚠️ Common Beginner Mistakes

### Mistake 1: Using process.env Directly

```typescript
// ❌ Bad: no validation, no type conversion
function connectDB() {
  const url = process.env.DATABASE_URL! // might be undefined
  const pool = process.env.MAX_POOL      // string, not number
  return createPool(url, { max: Number(pool) }) // NaN if not set
}

// ✅ Good: validation at startup
const config = loadConfig(appConfigSchema, process.env)
if (!config.ok) {
  console.error('Invalid config:', config.errors)
  process.exit(1)
}
// config.value.maxPool is already number, config.value.dbUrl is guaranteed string
```

### Mistake 2: "true" !== true

```typescript
// ❌ Bad: string values from .env
const debug = process.env.DEBUG // "false"
if (debug) { // true! String "false" is truthy
  enableDebugMode()
}

// ✅ Good: explicit conversion via schema
const config = loadEnv(spec, process.env)
if (config.ok && config.value.debug) {
  enableDebugMode() // debug: boolean, not string
}
```

### Mistake 3: No Validation at Startup

```typescript
// ❌ Bad: error discovered on first request
app.get('/users', async (req, res) => {
  const db = connect(process.env.DB_URL!) // fails 5 minutes after start
})

// ✅ Good: fail fast at startup
const config = loadEnv(appEnvSpec, process.env)
if (!config.ok) {
  for (const err of config.errors) {
    console.error(`Config error: ${err}`)
  }
  process.exit(1)
}
```

### Mistake 4: Feature Flags Without Default Values

```typescript
// ❌ Bad: flag might be undefined
function getUploadLimit(): number {
  return featureFlags.get('MAX_UPLOAD') ?? 10 // magic number
}

// ✅ Good: default defined in registry
const flags = createFeatureFlags({
  MAX_UPLOAD: { defaultValue: 10, type: 'number', description: '...' },
})
flags.getValue('MAX_UPLOAD') // always number, default is in registry
```

## 💡 Best Practices

### 1. Fail Fast: Validate at Startup

All configuration should be validated **before** the application starts accepting requests. This catches problems instantly rather than hours into operation.

### 2. Collect All Errors

Return a list of **all** configuration errors rather than throwing an exception on the first one. This saves time when setting up a new environment.

### 3. Use satisfies for Schemas

`satisfies ConfigSchema` checks structure but preserves literal types. This is critical for inferring precise types via `InferConfig`.

### 4. Separate Configuration by Module

```typescript
const dbConfig = { ... } satisfies ConfigSchema
const cacheConfig = { ... } satisfies ConfigSchema
const authConfig = { ... } satisfies ConfigSchema

// Each module loads only its own configuration
const db = createConfigLoader(dbConfig).load(env)
const cache = createConfigLoader(cacheConfig).load(env)
```

### 5. Feature Flags: Document in the Registry

Every flag should have a `description`. The flag registry serves as documentation accessible to the entire team.

### 6. Use Const Assertions for Enums

```typescript
// ❌ Array loses literal types
const envs = ['dev', 'staging', 'prod']  // string[]

// ✅ as const preserves literal types
const envs = ['dev', 'staging', 'prod'] as const  // readonly ['dev', 'staging', 'prod']
```
