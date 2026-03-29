import { useState } from 'react'

// ============================================
// Задание 8.1: Schema Inference — Решение
// ============================================

type SchemaType = 'string' | 'number' | 'boolean'

interface SchemaField<T extends SchemaType> {
  type: T
  required?: boolean
}

interface ObjectSchema {
  [key: string]: SchemaField<SchemaType> | ObjectSchema
}

type InferFieldType<T extends SchemaField<SchemaType>> =
  T extends SchemaField<'string'> ? string :
  T extends SchemaField<'number'> ? number :
  T extends SchemaField<'boolean'> ? boolean :
  never

type InferSchema<T extends ObjectSchema> = {
  [K in keyof T]: T[K] extends SchemaField<SchemaType>
    ? T[K]['required'] extends false
      ? InferFieldType<T[K]> | undefined
      : InferFieldType<T[K]>
    : T[K] extends ObjectSchema
      ? InferSchema<T[K]>
      : never
}

function field<T extends SchemaType>(type: T, required = true): SchemaField<T> {
  return { type, required }
}

function createSchema<T extends ObjectSchema>(schema: T) {
  return {
    schema,
    validate(data: unknown): data is InferSchema<T> {
      if (typeof data !== 'object' || data === null) return false
      const obj = data as Record<string, unknown>

      for (const [key, def] of Object.entries(schema)) {
        if ('type' in def) {
          const fieldDef = def as SchemaField<SchemaType>
          if (fieldDef.required !== false && !(key in obj)) return false
          if (key in obj && typeof obj[key] !== fieldDef.type) return false
        }
      }
      return true
    },
    parse(data: unknown): InferSchema<T> | null {
      if (this.validate(data)) return data
      return null
    },
  }
}

const userSchema = createSchema({
  id: field('number'),
  name: field('string'),
  email: field('string'),
  isActive: field('boolean'),
  nickname: field('string', false),
})

export function Task8_1_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Schema Inference ===')
    log.push('')

    log.push('Schema definition:')
    log.push('  id:       number (required)')
    log.push('  name:     string (required)')
    log.push('  email:    string (required)')
    log.push('  isActive: boolean (required)')
    log.push('  nickname: string (optional)')
    log.push('')

    log.push('Inferred type: InferSchema<typeof userSchema.schema>')
    log.push('  {')
    log.push('    id: number')
    log.push('    name: string')
    log.push('    email: string')
    log.push('    isActive: boolean')
    log.push('    nickname: string | undefined')
    log.push('  }')
    log.push('')

    // Valid data
    const valid = { id: 1, name: 'Alice', email: 'a@b.com', isActive: true, nickname: 'ali' }
    const parsed1 = userSchema.parse(valid)
    log.push(`Validate valid data: ${parsed1 !== null}`)
    if (parsed1) {
      log.push(`  id: ${parsed1.id}, name: "${parsed1.name}", active: ${parsed1.isActive}`)
    }
    log.push('')

    // Valid without optional
    const validNoNickname = { id: 2, name: 'Bob', email: 'b@c.com', isActive: false }
    const parsed2 = userSchema.parse(validNoNickname)
    log.push(`Validate without optional field: ${parsed2 !== null}`)
    log.push('')

    // Invalid: wrong type
    const invalidType = { id: '3', name: 'Charlie', email: 'c@d.com', isActive: true }
    const parsed3 = userSchema.parse(invalidType)
    log.push(`Validate wrong type (id: string): ${parsed3 !== null}`)
    log.push('')

    // Invalid: missing required
    const missingRequired = { id: 4, name: 'Diana' }
    const parsed4 = userSchema.parse(missingRequired)
    log.push(`Validate missing required fields: ${parsed4 !== null}`)
    log.push('')

    log.push('Type safety:')
    log.push('  const user = userSchema.parse(data)')
    log.push('  user.id      // number (autocomplete works!)')
    log.push('  user.name    // string')
    log.push('  user.nickname // string | undefined')
    log.push('  user.unknown // Compile error!')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 8.1: Schema Inference</h2>
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
// Задание 8.2: Codec Pattern — Решение
// ============================================

interface Codec<TDecoded, TEncoded> {
  encode: (value: TDecoded) => TEncoded
  decode: (value: TEncoded) => TDecoded
  pipe<TFinal>(other: Codec<TEncoded, TFinal>): Codec<TDecoded, TFinal>
}

function createCodec<TDecoded, TEncoded>(
  encode: (value: TDecoded) => TEncoded,
  decode: (value: TEncoded) => TDecoded
): Codec<TDecoded, TEncoded> {
  return {
    encode,
    decode,
    pipe<TFinal>(other: Codec<TEncoded, TFinal>): Codec<TDecoded, TFinal> {
      return createCodec(
        (value: TDecoded) => other.encode(encode(value)),
        (value: TFinal) => decode(other.decode(value))
      )
    },
  }
}

const dateCodec = createCodec<Date, string>(
  (date) => date.toISOString(),
  (str) => new Date(str)
)

const numberCodec = createCodec<number, string>(
  (num) => String(num),
  (str) => Number(str)
)

const base64Codec = createCodec<string, string>(
  (str) => btoa(str),
  (encoded) => atob(encoded)
)

const jsonCodec = createCodec<Record<string, unknown>, string>(
  (obj) => JSON.stringify(obj),
  (str) => JSON.parse(str)
)

const compressedJsonCodec = jsonCodec.pipe(base64Codec)

export function Task8_2_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Codec Pattern ===')
    log.push('')

    // Date codec
    const now = new Date()
    const encoded1 = dateCodec.encode(now)
    const decoded1 = dateCodec.decode(encoded1)
    log.push('Date Codec (Date <-> string):')
    log.push(`  Original:  ${now.toISOString()}`)
    log.push(`  Encoded:   "${encoded1}"`)
    log.push(`  Decoded:   ${decoded1.toISOString()}`)
    log.push(`  Roundtrip: ${now.getTime() === decoded1.getTime()}`)
    log.push('')

    // Number codec
    const num = 42.5
    const encoded2 = numberCodec.encode(num)
    const decoded2 = numberCodec.decode(encoded2)
    log.push('Number Codec (number <-> string):')
    log.push(`  Original:  ${num}`)
    log.push(`  Encoded:   "${encoded2}"`)
    log.push(`  Decoded:   ${decoded2}`)
    log.push(`  Roundtrip: ${num === decoded2}`)
    log.push('')

    // Base64 codec
    const text = 'Hello, TypeScript!'
    const encoded3 = base64Codec.encode(text)
    const decoded3 = base64Codec.decode(encoded3)
    log.push('Base64 Codec (string <-> string):')
    log.push(`  Original:  "${text}"`)
    log.push(`  Encoded:   "${encoded3}"`)
    log.push(`  Decoded:   "${decoded3}"`)
    log.push(`  Roundtrip: ${text === decoded3}`)
    log.push('')

    // Composed codec: JSON -> Base64
    const obj = { name: 'Alice', score: 100 }
    const encoded4 = compressedJsonCodec.encode(obj)
    const decoded4 = compressedJsonCodec.decode(encoded4)
    log.push('Composed Codec (object -> JSON -> Base64):')
    log.push(`  Original:  ${JSON.stringify(obj)}`)
    log.push(`  Encoded:   "${encoded4}"`)
    log.push(`  Decoded:   ${JSON.stringify(decoded4)}`)
    log.push('')

    log.push('Type safety:')
    log.push('  dateCodec.encode(42)           // Error: number != Date')
    log.push('  dateCodec.decode(123)          // Error: number != string')
    log.push('  jsonCodec.pipe(numberCodec)    // Error: string != number')
    log.push('  compressedJsonCodec.encode(obj) -> string (inferred!)')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 8.2: Codec Pattern</h2>
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
// Задание 8.3: Data Migrations — Решение
// ============================================

interface Migration<TFrom, TTo> {
  fromVersion: number
  toVersion: number
  migrate: (data: TFrom) => TTo
}

function createMigration<TFrom, TTo>(
  fromVersion: number,
  toVersion: number,
  migrate: (data: TFrom) => TTo
): Migration<TFrom, TTo> {
  return { fromVersion, toVersion, migrate }
}

interface VersionedData<T> {
  version: number
  data: T
}

interface UserV1 {
  name: string
  email: string
}

interface UserV2 {
  firstName: string
  lastName: string
  email: string
  createdAt: string
}

interface UserV3 {
  firstName: string
  lastName: string
  emails: { primary: string; secondary?: string }
  createdAt: string
  role: 'admin' | 'user' | 'viewer'
}

interface UserV4 {
  firstName: string
  lastName: string
  emails: { primary: string; secondary?: string }
  createdAt: string
  role: 'admin' | 'user' | 'viewer'
  preferences: { theme: 'light' | 'dark'; locale: string }
}

const migrationV1toV2 = createMigration<UserV1, UserV2>(1, 2, (data) => {
  const parts = data.name.split(' ')
  return {
    firstName: parts[0] || '',
    lastName: parts.slice(1).join(' ') || '',
    email: data.email,
    createdAt: new Date().toISOString(),
  }
})

const migrationV2toV3 = createMigration<UserV2, UserV3>(2, 3, (data) => ({
  firstName: data.firstName,
  lastName: data.lastName,
  emails: { primary: data.email },
  createdAt: data.createdAt,
  role: 'user',
}))

const migrationV3toV4 = createMigration<UserV3, UserV4>(3, 4, (data) => ({
  ...data,
  preferences: { theme: 'light', locale: 'en' },
}))

class MigrationPipeline {
  private migrations: Migration<unknown, unknown>[] = []

  register<TFrom, TTo>(migration: Migration<TFrom, TTo>): this {
    this.migrations.push(migration as Migration<unknown, unknown>)
    this.migrations.sort((a, b) => a.fromVersion - b.fromVersion)
    return this
  }

  migrate<T>(versioned: VersionedData<unknown>, targetVersion: number): VersionedData<T> {
    let current = versioned
    for (const migration of this.migrations) {
      if (current.version === migration.fromVersion && migration.toVersion <= targetVersion) {
        current = {
          version: migration.toVersion,
          data: migration.migrate(current.data),
        }
      }
    }
    return current as VersionedData<T>
  }
}

export function Task8_3_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Data Migrations ===')
    log.push('')

    const pipeline = new MigrationPipeline()
      .register(migrationV1toV2)
      .register(migrationV2toV3)
      .register(migrationV3toV4)

    // Migrate from V1 to V4
    const v1Data: VersionedData<UserV1> = {
      version: 1,
      data: { name: 'John Doe', email: 'john@example.com' },
    }

    log.push('Original data (V1):')
    log.push(`  version: ${v1Data.version}`)
    log.push(`  data: ${JSON.stringify(v1Data.data)}`)
    log.push('')

    // Step by step
    const v2Data = pipeline.migrate<UserV2>(v1Data, 2)
    log.push('After migration to V2:')
    log.push(`  version: ${v2Data.version}`)
    log.push(`  data: ${JSON.stringify(v2Data.data)}`)
    log.push('')

    const v3Data = pipeline.migrate<UserV3>(v1Data, 3)
    log.push('After migration to V3 (from V1, skips V2 automatically):')
    log.push(`  version: ${v3Data.version}`)
    log.push(`  data: ${JSON.stringify(v3Data.data)}`)
    log.push('')

    const v4Data = pipeline.migrate<UserV4>(v1Data, 4)
    log.push('After migration to V4 (full chain V1 -> V2 -> V3 -> V4):')
    log.push(`  version: ${v4Data.version}`)
    log.push(`  firstName: "${v4Data.data.firstName}"`)
    log.push(`  lastName: "${v4Data.data.lastName}"`)
    log.push(`  emails: ${JSON.stringify(v4Data.data.emails)}`)
    log.push(`  role: "${v4Data.data.role}"`)
    log.push(`  preferences: ${JSON.stringify(v4Data.data.preferences)}`)
    log.push('')

    // Already at target version
    const alreadyV3: VersionedData<UserV3> = {
      version: 3,
      data: {
        firstName: 'Alice',
        lastName: 'Smith',
        emails: { primary: 'alice@example.com' },
        createdAt: '2024-01-01T00:00:00Z',
        role: 'admin',
      },
    }
    const v4FromV3 = pipeline.migrate<UserV4>(alreadyV3, 4)
    log.push('Migration from V3 to V4 (single step):')
    log.push(`  version: ${v4FromV3.version}`)
    log.push(`  role: "${v4FromV3.data.role}" (preserved from V3)`)
    log.push(`  preferences: ${JSON.stringify(v4FromV3.data.preferences)} (defaults added)`)
    log.push('')

    log.push('Type safety:')
    log.push('  - Each migration has typed input/output')
    log.push('  - createMigration<V1, V2>(1, 2, fn) checks fn: V1 -> V2')
    log.push('  - Version numbers track schema evolution')
    log.push('  - Pipeline applies migrations in order')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 8.3: Data Migrations</h2>
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
