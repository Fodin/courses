import { useState } from 'react'

// ============================================
// Задание 11.1: Config Loader — Решение
// ============================================

interface ConfigSchema {
  readonly [key: string]: {
    readonly type: 'string' | 'number' | 'boolean'
    readonly required?: boolean
    readonly default?: string | number | boolean
    readonly validate?: (value: unknown) => boolean
  }
}

type InferConfig<S extends ConfigSchema> = {
  readonly [K in keyof S]: S[K]['type'] extends 'string'
    ? string
    : S[K]['type'] extends 'number'
      ? number
      : S[K]['type'] extends 'boolean'
        ? boolean
        : never
}

type ConfigError = {
  readonly field: string
  readonly message: string
}

type ConfigResult<T> =
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly errors: ConfigError[] }

function createConfigLoader<S extends ConfigSchema>(schema: S) {
  return {
    load(
      env: Record<string, string | undefined>,
      overrides?: Partial<Record<keyof S, string | number | boolean>>
    ): ConfigResult<InferConfig<S>> {
      const errors: ConfigError[] = []
      const result: Record<string, unknown> = {}

      for (const [key, def] of Object.entries(schema)) {
        const rawValue = overrides?.[key] !== undefined
          ? String(overrides[key])
          : env[key]

        if (rawValue === undefined || rawValue === '') {
          if (def.default !== undefined) {
            result[key] = def.default
            continue
          }
          if (def.required) {
            errors.push({ field: key, message: `Required field "${key}" is missing` })
            continue
          }
          result[key] = undefined
          continue
        }

        let parsed: unknown
        switch (def.type) {
          case 'string':
            parsed = rawValue
            break
          case 'number': {
            const num = Number(rawValue)
            if (Number.isNaN(num)) {
              errors.push({ field: key, message: `"${key}" must be a number, got "${rawValue}"` })
              continue
            }
            parsed = num
            break
          }
          case 'boolean':
            if (rawValue !== 'true' && rawValue !== 'false') {
              errors.push({ field: key, message: `"${key}" must be "true" or "false", got "${rawValue}"` })
              continue
            }
            parsed = rawValue === 'true'
            break
        }

        if (def.validate && !def.validate(parsed)) {
          errors.push({ field: key, message: `"${key}" failed validation` })
          continue
        }

        result[key] = parsed
      }

      if (errors.length > 0) {
        return { ok: false, errors }
      }
      return { ok: true, value: result as InferConfig<S> }
    },

    merge(
      base: InferConfig<S>,
      override: Partial<InferConfig<S>>
    ): InferConfig<S> {
      return { ...base, ...override } as InferConfig<S>
    },
  }
}

const appConfigSchema = {
  DATABASE_URL: { type: 'string' as const, required: true },
  PORT: { type: 'number' as const, default: 3000 },
  DEBUG: { type: 'boolean' as const, default: false },
  API_KEY: { type: 'string' as const, required: true },
  MAX_CONNECTIONS: {
    type: 'number' as const,
    default: 10,
    validate: (v: unknown) => typeof v === 'number' && v > 0 && v <= 100,
  },
} satisfies ConfigSchema

export function Task11_1_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    const loader = createConfigLoader(appConfigSchema)

    log.push('=== Config Loader: successful load ===')
    const env1: Record<string, string> = {
      DATABASE_URL: 'postgres://localhost:5432/mydb',
      PORT: '8080',
      DEBUG: 'true',
      API_KEY: 'sk-test-123',
      MAX_CONNECTIONS: '25',
    }
    const result1 = loader.load(env1)
    if (result1.ok) {
      log.push(`  DATABASE_URL: ${result1.value.DATABASE_URL}`)
      log.push(`  PORT: ${result1.value.PORT} (type: ${typeof result1.value.PORT})`)
      log.push(`  DEBUG: ${result1.value.DEBUG} (type: ${typeof result1.value.DEBUG})`)
      log.push(`  API_KEY: ${result1.value.API_KEY}`)
      log.push(`  MAX_CONNECTIONS: ${result1.value.MAX_CONNECTIONS}`)
    }

    log.push('')
    log.push('=== Config Loader: defaults applied ===')
    const env2: Record<string, string> = {
      DATABASE_URL: 'postgres://localhost:5432/mydb',
      API_KEY: 'sk-test-456',
    }
    const result2 = loader.load(env2)
    if (result2.ok) {
      log.push(`  PORT: ${result2.value.PORT} (default)`)
      log.push(`  DEBUG: ${result2.value.DEBUG} (default)`)
      log.push(`  MAX_CONNECTIONS: ${result2.value.MAX_CONNECTIONS} (default)`)
    }

    log.push('')
    log.push('=== Config Loader: validation errors ===')
    const env3: Record<string, string> = {
      PORT: 'not-a-number',
      DEBUG: 'yes',
      MAX_CONNECTIONS: '200',
    }
    const result3 = loader.load(env3)
    if (!result3.ok) {
      for (const err of result3.errors) {
        log.push(`  [${err.field}]: ${err.message}`)
      }
    }

    log.push('')
    log.push('=== Config Loader: environment overrides ===')
    const baseEnv: Record<string, string> = {
      DATABASE_URL: 'postgres://localhost:5432/mydb',
      API_KEY: 'sk-prod-789',
    }
    const result4 = loader.load(baseEnv, { PORT: 9090, DEBUG: true })
    if (result4.ok) {
      log.push(`  PORT: ${result4.value.PORT} (override)`)
      log.push(`  DEBUG: ${result4.value.DEBUG} (override)`)
    }

    log.push('')
    log.push('=== Config merge ===')
    if (result2.ok && result4.ok) {
      const merged = loader.merge(result2.value, { PORT: 4000 })
      log.push(`  Merged PORT: ${merged.PORT}`)
      log.push(`  Merged DEBUG: ${merged.DEBUG}`)
    }

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 11.1: Config Loader</h2>
      <button onClick={runExample}>Запустить</button>
      {results.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Результаты:</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {results.map((r, i) => (
              <li key={i} style={{ padding: '0.25rem 0', fontFamily: 'monospace', whiteSpace: 'pre' }}>{r}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

// ============================================
// Задание 11.2: Feature Flags — Решение
// ============================================

interface FlagDefinition<T extends string | number | boolean = boolean> {
  readonly description: string
  readonly defaultValue: T
  readonly type: T extends string ? 'string' : T extends number ? 'number' : 'boolean'
}

type FlagRegistry = Record<string, FlagDefinition<string | number | boolean>>

type FlagValues<R extends FlagRegistry> = {
  readonly [K in keyof R]: R[K] extends FlagDefinition<infer T> ? T : never
}

interface FeatureFlagService<R extends FlagRegistry> {
  isEnabled(flag: keyof R): boolean
  getValue<K extends keyof R>(flag: K): FlagValues<R>[K]
  getAll(): FlagValues<R>
  override<K extends keyof R>(flag: K, value: FlagValues<R>[K]): void
  reset(flag: keyof R): void
  resetAll(): void
}

function createFeatureFlags<R extends FlagRegistry>(
  registry: R,
  overrides?: Partial<FlagValues<R>>
): FeatureFlagService<R> {
  const currentOverrides = new Map<keyof R, unknown>()

  if (overrides) {
    for (const [key, value] of Object.entries(overrides)) {
      currentOverrides.set(key, value)
    }
  }

  function getValue<K extends keyof R>(flag: K): FlagValues<R>[K] {
    if (currentOverrides.has(flag)) {
      return currentOverrides.get(flag) as FlagValues<R>[K]
    }
    return registry[flag].defaultValue as FlagValues<R>[K]
  }

  return {
    isEnabled(flag: keyof R): boolean {
      const val = getValue(flag)
      return Boolean(val)
    },

    getValue,

    getAll(): FlagValues<R> {
      const result: Record<string, unknown> = {}
      for (const key of Object.keys(registry)) {
        result[key] = getValue(key)
      }
      return result as FlagValues<R>
    },

    override<K extends keyof R>(flag: K, value: FlagValues<R>[K]): void {
      currentOverrides.set(flag, value)
    },

    reset(flag: keyof R): void {
      currentOverrides.delete(flag)
    },

    resetAll(): void {
      currentOverrides.clear()
    },
  }
}

const featureRegistry = {
  DARK_MODE: {
    description: 'Enable dark mode UI',
    defaultValue: false as boolean,
    type: 'boolean' as const,
  },
  MAX_UPLOAD_SIZE: {
    description: 'Maximum upload size in MB',
    defaultValue: 10 as number,
    type: 'number' as const,
  },
  API_VERSION: {
    description: 'API version string',
    defaultValue: 'v1' as string,
    type: 'string' as const,
  },
  NEW_DASHBOARD: {
    description: 'Enable new dashboard layout',
    defaultValue: false as boolean,
    type: 'boolean' as const,
  },
  CACHE_TTL: {
    description: 'Cache time-to-live in seconds',
    defaultValue: 300 as number,
    type: 'number' as const,
  },
} satisfies FlagRegistry

export function Task11_2_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Feature Flags: defaults ===')
    const flags = createFeatureFlags(featureRegistry)
    const all = flags.getAll()
    log.push(`  DARK_MODE: ${all.DARK_MODE} (${typeof all.DARK_MODE})`)
    log.push(`  MAX_UPLOAD_SIZE: ${all.MAX_UPLOAD_SIZE} (${typeof all.MAX_UPLOAD_SIZE})`)
    log.push(`  API_VERSION: ${all.API_VERSION} (${typeof all.API_VERSION})`)
    log.push(`  NEW_DASHBOARD: ${all.NEW_DASHBOARD}`)
    log.push(`  CACHE_TTL: ${all.CACHE_TTL}`)

    log.push('')
    log.push('=== Feature Flags: isEnabled ===')
    log.push(`  DARK_MODE enabled: ${flags.isEnabled('DARK_MODE')}`)
    log.push(`  MAX_UPLOAD_SIZE enabled: ${flags.isEnabled('MAX_UPLOAD_SIZE')}`)
    log.push(`  API_VERSION enabled: ${flags.isEnabled('API_VERSION')}`)

    log.push('')
    log.push('=== Feature Flags: typed getValue ===')
    const uploadSize = flags.getValue('MAX_UPLOAD_SIZE')
    const apiVersion = flags.getValue('API_VERSION')
    log.push(`  MAX_UPLOAD_SIZE: ${uploadSize} (type: ${typeof uploadSize})`)
    log.push(`  API_VERSION: ${apiVersion} (type: ${typeof apiVersion})`)

    log.push('')
    log.push('=== Feature Flags: overrides ===')
    flags.override('DARK_MODE', true)
    flags.override('MAX_UPLOAD_SIZE', 50)
    flags.override('API_VERSION', 'v2')
    log.push(`  DARK_MODE: ${flags.getValue('DARK_MODE')} (overridden)`)
    log.push(`  MAX_UPLOAD_SIZE: ${flags.getValue('MAX_UPLOAD_SIZE')} (overridden)`)
    log.push(`  API_VERSION: ${flags.getValue('API_VERSION')} (overridden)`)

    log.push('')
    log.push('=== Feature Flags: reset ===')
    flags.reset('DARK_MODE')
    log.push(`  DARK_MODE after reset: ${flags.getValue('DARK_MODE')}`)
    flags.resetAll()
    log.push(`  MAX_UPLOAD_SIZE after resetAll: ${flags.getValue('MAX_UPLOAD_SIZE')}`)
    log.push(`  API_VERSION after resetAll: ${flags.getValue('API_VERSION')}`)

    log.push('')
    log.push('=== Feature Flags: initial overrides ===')
    const flagsWithOverrides = createFeatureFlags(featureRegistry, {
      DARK_MODE: true,
      CACHE_TTL: 600,
    })
    log.push(`  DARK_MODE: ${flagsWithOverrides.getValue('DARK_MODE')}`)
    log.push(`  CACHE_TTL: ${flagsWithOverrides.getValue('CACHE_TTL')}`)
    log.push(`  MAX_UPLOAD_SIZE: ${flagsWithOverrides.getValue('MAX_UPLOAD_SIZE')} (default)`)

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 11.2: Feature Flags</h2>
      <button onClick={runExample}>Запустить</button>
      {results.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Результаты:</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {results.map((r, i) => (
              <li key={i} style={{ padding: '0.25rem 0', fontFamily: 'monospace', whiteSpace: 'pre' }}>{r}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

// ============================================
// Задание 11.3: Environment Types — Решение
// ============================================

type EnvVarDef<T = string> = {
  readonly key: string
  readonly transform?: (raw: string) => T
  readonly fallback?: T
  readonly required?: boolean
  readonly description?: string
}

type EnvResult<T> =
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly error: string }

function envString(key: string, opts?: { fallback?: string; required?: boolean; description?: string }): EnvVarDef<string> {
  return { key, fallback: opts?.fallback, required: opts?.required, description: opts?.description }
}

function envNumber(key: string, opts?: { fallback?: number; required?: boolean; description?: string }): EnvVarDef<number> {
  return {
    key,
    transform: (raw) => {
      const num = Number(raw)
      if (Number.isNaN(num)) throw new Error(`"${key}" is not a valid number: "${raw}"`)
      return num
    },
    fallback: opts?.fallback,
    required: opts?.required,
    description: opts?.description,
  }
}

function envBoolean(key: string, opts?: { fallback?: boolean; required?: boolean; description?: string }): EnvVarDef<boolean> {
  return {
    key,
    transform: (raw) => {
      if (raw === 'true' || raw === '1') return true
      if (raw === 'false' || raw === '0') return false
      throw new Error(`"${key}" must be "true"/"false" or "1"/"0", got "${raw}"`)
    },
    fallback: opts?.fallback,
    required: opts?.required,
    description: opts?.description,
  }
}

function envEnum<T extends string>(key: string, allowed: readonly T[], opts?: { fallback?: T; required?: boolean }): EnvVarDef<T> {
  return {
    key,
    transform: (raw) => {
      if (!allowed.includes(raw as T)) {
        throw new Error(`"${key}" must be one of [${allowed.join(', ')}], got "${raw}"`)
      }
      return raw as T
    },
    fallback: opts?.fallback,
    required: opts?.required,
  }
}

type EnvSpec = Record<string, EnvVarDef<unknown>>

type InferEnv<S extends EnvSpec> = {
  readonly [K in keyof S]: S[K] extends EnvVarDef<infer T> ? T : never
}

function loadEnv<S extends EnvSpec>(
  spec: S,
  env: Record<string, string | undefined>
): { ok: true; value: InferEnv<S> } | { ok: false; errors: string[] } {
  const errors: string[] = []
  const result: Record<string, unknown> = {}

  for (const [name, def] of Object.entries(spec)) {
    const raw = env[def.key]

    if (raw === undefined || raw === '') {
      if (def.fallback !== undefined) {
        result[name] = def.fallback
        continue
      }
      if (def.required) {
        errors.push(`Missing required env var: ${def.key}`)
        continue
      }
      result[name] = undefined
      continue
    }

    try {
      result[name] = def.transform ? def.transform(raw) : raw
    } catch (e) {
      errors.push((e as Error).message)
    }
  }

  if (errors.length > 0) return { ok: false, errors }
  return { ok: true, value: result as InferEnv<S> }
}

const appEnvSpec = {
  nodeEnv: envEnum('NODE_ENV', ['development', 'staging', 'production'] as const, { fallback: 'development' }),
  port: envNumber('PORT', { fallback: 3000 }),
  dbUrl: envString('DATABASE_URL', { required: true, description: 'PostgreSQL connection string' }),
  debug: envBoolean('DEBUG', { fallback: false }),
  logLevel: envEnum('LOG_LEVEL', ['debug', 'info', 'warn', 'error'] as const, { fallback: 'info' }),
  redisHost: envString('REDIS_HOST', { fallback: 'localhost' }),
  redisPort: envNumber('REDIS_PORT', { fallback: 6379 }),
} satisfies EnvSpec

export function Task11_3_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Typed Environment: full config ===')
    const fullEnv: Record<string, string> = {
      NODE_ENV: 'production',
      PORT: '8080',
      DATABASE_URL: 'postgres://prod:5432/app',
      DEBUG: 'false',
      LOG_LEVEL: 'warn',
      REDIS_HOST: 'redis.prod.internal',
      REDIS_PORT: '6380',
    }
    const result1 = loadEnv(appEnvSpec, fullEnv)
    if (result1.ok) {
      log.push(`  nodeEnv: ${result1.value.nodeEnv} (${typeof result1.value.nodeEnv})`)
      log.push(`  port: ${result1.value.port} (${typeof result1.value.port})`)
      log.push(`  dbUrl: ${result1.value.dbUrl}`)
      log.push(`  debug: ${result1.value.debug} (${typeof result1.value.debug})`)
      log.push(`  logLevel: ${result1.value.logLevel}`)
      log.push(`  redisHost: ${result1.value.redisHost}`)
      log.push(`  redisPort: ${result1.value.redisPort} (${typeof result1.value.redisPort})`)
    }

    log.push('')
    log.push('=== Typed Environment: fallbacks applied ===')
    const minEnv: Record<string, string> = {
      DATABASE_URL: 'postgres://localhost:5432/dev',
    }
    const result2 = loadEnv(appEnvSpec, minEnv)
    if (result2.ok) {
      log.push(`  nodeEnv: ${result2.value.nodeEnv} (fallback)`)
      log.push(`  port: ${result2.value.port} (fallback)`)
      log.push(`  debug: ${result2.value.debug} (fallback)`)
      log.push(`  logLevel: ${result2.value.logLevel} (fallback)`)
      log.push(`  redisHost: ${result2.value.redisHost} (fallback)`)
      log.push(`  redisPort: ${result2.value.redisPort} (fallback)`)
    }

    log.push('')
    log.push('=== Typed Environment: validation errors ===')
    const badEnv: Record<string, string> = {
      NODE_ENV: 'test',
      PORT: 'abc',
      LOG_LEVEL: 'verbose',
    }
    const result3 = loadEnv(appEnvSpec, badEnv)
    if (!result3.ok) {
      for (const err of result3.errors) {
        log.push(`  ${err}`)
      }
    }

    log.push('')
    log.push('=== Typed Environment: enum constraint ===')
    const envWithEnum: Record<string, string> = {
      DATABASE_URL: 'postgres://localhost/db',
      NODE_ENV: 'staging',
      LOG_LEVEL: 'debug',
    }
    const result4 = loadEnv(appEnvSpec, envWithEnum)
    if (result4.ok) {
      log.push(`  nodeEnv: "${result4.value.nodeEnv}" (valid enum)`)
      log.push(`  logLevel: "${result4.value.logLevel}" (valid enum)`)
    }

    log.push('')
    log.push('=== Type safety: compile-time guarantees ===')
    log.push('  result.value.port is number — arithmetic works')
    log.push('  result.value.nodeEnv is "development" | "staging" | "production"')
    log.push('  result.value.debug is boolean — no string comparison')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 11.3: Environment Types</h2>
      <button onClick={runExample}>Запустить</button>
      {results.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Результаты:</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {results.map((r, i) => (
              <li key={i} style={{ padding: '0.25rem 0', fontFamily: 'monospace', whiteSpace: 'pre' }}>{r}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
