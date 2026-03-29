import { useState } from 'react'

// ============================================
// Задание 11.1: Exact Types — Решение
// ============================================

export function Task11_1_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    // Problem: TypeScript allows excess properties in some contexts
    // Exact<T> prevents this

    // Exact type implementation
    type Exact<T, Shape = T> =
      T extends Shape
        ? Exclude<keyof T, keyof Shape> extends never
          ? T
          : never
        : never

    // Stricter version using mapped types
    type StrictExact<T> = {
      [K in keyof T]: T[K]
    } & Record<string, never>

    // Practical: function that only accepts exact shape
    type UserConfig = {
      name: string
      theme: 'light' | 'dark'
      notifications: boolean
    }

    function applyConfig<T extends UserConfig>(
      config: T & Exact<T, UserConfig>
    ): string {
      return JSON.stringify(config)
    }

    // DeepExact for nested objects
    type DeepExact<T, Shape> = {
      [K in keyof Shape]: K extends keyof T
        ? T[K] extends object
          ? Shape[K] extends object
            ? DeepExact<T[K], Shape[K]>
            : Shape[K]
          : Shape[K]
        : Shape[K]
    }

    log.push('=== Exact Types ===')
    log.push('')

    // Demonstrate the excess property problem
    log.push('--- The Problem: Excess Properties ---')

    interface Config {
      host: string
      port: number
    }

    // Direct assignment catches extras
    // const c: Config = { host: 'localhost', port: 3000, debug: true } // Error!

    // But indirect assignment doesn't
    const fullConfig = { host: 'localhost', port: 3000, debug: true }
    const c: Config = fullConfig // No error — debug is silently ignored!
    log.push(`Config = ${JSON.stringify(c)}`)
    log.push(`Original had "debug: true" — silently lost!`)

    log.push('')
    log.push('--- Solution: Exact<T, Shape> ---')

    // Using Exact
    const validConfig = { name: 'Alice', theme: 'dark' as const, notifications: true }
    const result = applyConfig(validConfig)
    log.push(`applyConfig({name, theme, notifications}) = ${result}`)

    log.push('')
    log.push('--- Compile-time protections ---')
    log.push('applyConfig({name, theme, notifications, extra: 1}) // Error!')
    log.push('  → Excess property "extra" not assignable to Exact<T, UserConfig>')

    log.push('')
    log.push('--- Technique: Conditional Exact Check ---')
    log.push('type Exact<T, Shape> =')
    log.push('  T extends Shape')
    log.push('    ? Exclude<keyof T, keyof Shape> extends never')
    log.push('      ? T    // No excess keys')
    log.push('      : never // Has excess keys')
    log.push('    : never')

    log.push('')
    log.push('--- Use Cases ---')
    log.push('1. API request bodies — prevent sending unknown fields')
    log.push('2. Configuration objects — catch typos in option names')
    log.push('3. Database insert operations — prevent extra columns')
    log.push('4. Form data validation — strict shape enforcement')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 11.1: Exact Types</h2>
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
// Задание 11.2: XOR Type — Решение
// ============================================

export function Task11_2_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    // XOR: Mutually exclusive union
    // Either A or B, but never both

    type Without<T, U> = {
      [P in Exclude<keyof T, keyof U>]?: never
    }

    type XOR<T, U> = (T & Without<U, T>) | (U & Without<T, U>)

    // Multi-way XOR
    type XOR3<A, B, C> = XOR<XOR<A, B>, C>

    // Practical examples
    interface CardPayment {
      cardNumber: string
      cvv: string
      expiry: string
    }

    interface BankTransfer {
      bankAccount: string
      routingNumber: string
    }

    interface CryptoPayment {
      walletAddress: string
      network: 'ethereum' | 'bitcoin'
    }

    type PaymentMethod = XOR3<CardPayment, BankTransfer, CryptoPayment>

    // Function that accepts XOR payment
    function processPayment(payment: PaymentMethod): string {
      if ('cardNumber' in payment) {
        return `Card: ****${payment.cardNumber!.slice(-4)}`
      }
      if ('bankAccount' in payment) {
        return `Bank: ${payment.bankAccount}`
      }
      if ('walletAddress' in payment) {
        return `Crypto: ${payment.walletAddress.slice(0, 8)}... (${payment.network})`
      }
      return 'Unknown payment'
    }

    log.push('=== XOR Type (Mutually Exclusive Unions) ===')
    log.push('')

    // Problem with regular union
    log.push('--- Problem: Regular Union allows both ---')

    type RegularPayment = CardPayment | BankTransfer
    const ambiguous: RegularPayment = {
      cardNumber: '4111111111111111',
      cvv: '123',
      expiry: '12/25',
      bankAccount: 'ACC123', // Regular union allows this!
      routingNumber: 'RTN456',
    }
    log.push(`Regular union allows: card + bank at once`)
    log.push(`  ${JSON.stringify(ambiguous)}`)

    log.push('')
    log.push('--- Solution: XOR<A, B> ---')

    // Valid: card only
    const cardPay: PaymentMethod = {
      cardNumber: '4111111111111111',
      cvv: '123',
      expiry: '12/25',
    }
    log.push(`processPayment(card) = "${processPayment(cardPay)}"`)

    // Valid: bank only
    const bankPay: PaymentMethod = {
      bankAccount: 'ACC-9876543',
      routingNumber: 'RTN-123',
    }
    log.push(`processPayment(bank) = "${processPayment(bankPay)}"`)

    // Valid: crypto only
    const cryptoPay: PaymentMethod = {
      walletAddress: '0xABCDEF1234567890ABCDEF',
      network: 'ethereum',
    }
    log.push(`processPayment(crypto) = "${processPayment(cryptoPay)}"`)

    log.push('')
    log.push('--- XOR prevents mixing ---')
    log.push('{ cardNumber: "...", bankAccount: "..." }  // Compile error!')
    log.push('{ cardNumber: "...", walletAddress: "..." } // Compile error!')

    log.push('')
    log.push('--- How XOR works ---')
    log.push('type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never }')
    log.push('type XOR<T, U> = (T & Without<U, T>) | (U & Without<T, U>)')
    log.push('')
    log.push('Without makes the "other" keys optional with type `never`.')
    log.push('This means if you provide a key from B, you cannot also provide keys from A.')

    log.push('')
    log.push('--- Another Example: Response Type ---')

    type Success = { data: unknown; status: 'ok' }
    type Failure = { error: string; status: 'error' }
    type Response = XOR<Success, Failure>

    const ok: Response = { data: { id: 1 }, status: 'ok' }
    const err: Response = { error: 'Not found', status: 'error' }
    log.push(`Success: ${JSON.stringify(ok)}`)
    log.push(`Failure: ${JSON.stringify(err)}`)
    log.push('{ data: {}, error: "..." } // Compile error!')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 11.2: XOR Type</h2>
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
// Задание 11.3: DeepPick & DeepOmit — Решение
// ============================================

export function Task11_3_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    // DeepPick: Pick nested properties by dot-separated paths
    type DeepPick<T, Paths extends string> =
      Paths extends `${infer Key}.${infer Rest}`
        ? Key extends keyof T
          ? { [K in Key]: DeepPick<T[K], Rest> }
          : never
        : Paths extends keyof T
          ? { [K in Paths]: T[K] }
          : never

    // UnionToIntersection helper
    type UnionToIntersection<U> =
      (U extends unknown ? (x: U) => void : never) extends (x: infer I) => void
        ? I
        : never

    // DeepPick with multiple paths
    type DeepPickMulti<T, Paths extends string> =
      UnionToIntersection<DeepPick<T, Paths>>

    // DeepOmit: Remove nested properties by dot-separated paths
    type DeepOmit<T, Paths extends string> =
      Paths extends `${infer Key}.${infer Rest}`
        ? {
            [K in keyof T]: K extends Key
              ? DeepOmit<T[K], Rest>
              : T[K]
          }
        : Omit<T, Paths>

    // Test data
    interface User {
      id: number
      name: string
      profile: {
        avatar: string
        bio: string
        settings: {
          theme: string
          language: string
          notifications: boolean
        }
      }
      address: {
        city: string
        country: string
        zip: string
      }
    }

    // Runtime deep pick
    function deepPick(obj: Record<string, unknown>, path: string): unknown {
      const keys = path.split('.')
      let current: unknown = obj
      for (const key of keys) {
        if (current && typeof current === 'object' && key in current) {
          current = (current as Record<string, unknown>)[key]
        } else {
          return undefined
        }
      }
      return current
    }

    // Runtime deep omit
    function deepOmit(obj: Record<string, unknown>, path: string): Record<string, unknown> {
      const result = { ...obj }
      const keys = path.split('.')

      if (keys.length === 1) {
        delete result[keys[0]]
        return result
      }

      const [first, ...rest] = keys
      if (first in result && typeof result[first] === 'object' && result[first] !== null) {
        result[first] = deepOmit(
          result[first] as Record<string, unknown>,
          rest.join('.')
        )
      }
      return result
    }

    log.push('=== DeepPick & DeepOmit ===')
    log.push('')

    const user: User = {
      id: 1,
      name: 'Alice',
      profile: {
        avatar: 'alice.jpg',
        bio: 'Developer',
        settings: { theme: 'dark', language: 'en', notifications: true },
      },
      address: { city: 'Berlin', country: 'Germany', zip: '10115' },
    }

    // DeepPick
    log.push('--- DeepPick ---')

    type UserCity = DeepPick<User, 'address.city'>
    // { address: { city: string } }
    log.push('DeepPick<User, "address.city"> = { address: { city: string } }')
    log.push(`  Value: ${deepPick(user as unknown as Record<string, unknown>, 'address.city')}`)

    type UserTheme = DeepPick<User, 'profile.settings.theme'>
    log.push('DeepPick<User, "profile.settings.theme"> = { profile: { settings: { theme: string } } }')
    log.push(`  Value: ${deepPick(user as unknown as Record<string, unknown>, 'profile.settings.theme')}`)

    type UserIdAndCity = DeepPickMulti<User, 'id' | 'address.city'>
    log.push('DeepPickMulti<User, "id" | "address.city"> = { id: number } & { address: { city: string } }')

    log.push('')

    // DeepOmit
    log.push('--- DeepOmit ---')

    type UserWithoutBio = DeepOmit<User, 'profile.bio'>
    log.push('DeepOmit<User, "profile.bio"> removes profile.bio')

    const withoutBio = deepOmit(
      user as unknown as Record<string, unknown>,
      'profile.bio'
    )
    log.push(`  Result profile keys: ${Object.keys((withoutBio.profile as Record<string, unknown>)).join(', ')}`)

    type UserWithoutNotif = DeepOmit<User, 'profile.settings.notifications'>
    log.push('DeepOmit<User, "profile.settings.notifications"> removes nested notification setting')

    const withoutNotif = deepOmit(
      user as unknown as Record<string, unknown>,
      'profile.settings.notifications'
    )
    const settings = ((withoutNotif.profile as Record<string, unknown>).settings as Record<string, unknown>)
    log.push(`  Result settings keys: ${Object.keys(settings).join(', ')}`)

    log.push('')
    log.push('--- Path Autocomplete (type-level) ---')

    // Type-safe path extraction
    type PathsOf<T, Prefix extends string = ''> =
      T extends object
        ? {
            [K in keyof T & string]:
              | `${Prefix}${K}`
              | PathsOf<T[K], `${Prefix}${K}.`>
          }[keyof T & string]
        : never

    type UserPaths = PathsOf<User>
    log.push('PathsOf<User> generates all valid dot-paths:')
    log.push('  "id" | "name" | "profile" | "profile.avatar" | "profile.bio" |')
    log.push('  "profile.settings" | "profile.settings.theme" | ...')
    log.push('  "address" | "address.city" | "address.country" | "address.zip"')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 11.3: DeepPick & DeepOmit</h2>
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
// Задание 11.4: Opaque Types — Решение
// ============================================

export function Task11_4_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    // Opaque (Branded) Types
    // Prevent accidental mixing of structurally identical types

    // Brand symbol approach — use a string literal key for branding
    type Brand<T, B extends string> = T & { readonly __brand: B }

    // Domain types
    type UserId = Brand<number, 'UserId'>
    type PostId = Brand<number, 'PostId'>
    type Email = Brand<string, 'Email'>
    type Money = Brand<number, 'Money'>
    type Percentage = Brand<number, 'Percentage'>

    // Smart constructors with validation
    function createUserId(id: number): UserId {
      if (id <= 0 || !Number.isInteger(id)) {
        throw new Error(`Invalid UserId: ${id}`)
      }
      return id as UserId
    }

    function createPostId(id: number): PostId {
      if (id <= 0 || !Number.isInteger(id)) {
        throw new Error(`Invalid PostId: ${id}`)
      }
      return id as PostId
    }

    function createEmail(value: string): Email {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        throw new Error(`Invalid Email: ${value}`)
      }
      return value as Email
    }

    function createMoney(amount: number): Money {
      if (!Number.isFinite(amount)) {
        throw new Error(`Invalid Money: ${amount}`)
      }
      return Math.round(amount * 100) / 100 as Money
    }

    function createPercentage(value: number): Percentage {
      if (value < 0 || value > 100) {
        throw new Error(`Invalid Percentage: ${value}`)
      }
      return value as Percentage
    }

    // Type-safe functions
    function getUserById(id: UserId): string {
      return `User #${id}`
    }

    function getPostById(id: PostId): string {
      return `Post #${id}`
    }

    function sendEmail(to: Email, subject: string): string {
      return `Email to ${to}: "${subject}"`
    }

    function applyDiscount(price: Money, discount: Percentage): Money {
      return createMoney((price as number) * (1 - (discount as number) / 100))
    }

    log.push('=== Opaque (Branded) Types ===')
    log.push('')

    // Problem
    log.push('--- Problem: Structural typing allows mixing ---')
    log.push('Without brands, UserId and PostId are both just `number`.')
    log.push('getUserById(postId) would compile fine — a dangerous bug!')

    log.push('')
    log.push('--- Solution: Brand<T, B> ---')
    log.push('type Brand<T, B> = T & { readonly [__brand]: B }')
    log.push('type UserId = Brand<number, "UserId">')
    log.push('type PostId = Brand<number, "PostId">')

    log.push('')
    log.push('--- Smart Constructors (validation) ---')

    const userId = createUserId(42)
    log.push(`createUserId(42) → ${userId}`)

    const postId = createPostId(7)
    log.push(`createPostId(7) → ${postId}`)

    const email = createEmail('alice@example.com')
    log.push(`createEmail("alice@example.com") → ${email}`)

    const price = createMoney(99.99)
    log.push(`createMoney(99.99) → ${price}`)

    const discount = createPercentage(20)
    log.push(`createPercentage(20) → ${discount}`)

    log.push('')
    log.push('--- Type-Safe Operations ---')

    log.push(`getUserById(userId) → "${getUserById(userId)}"`)
    log.push(`getPostById(postId) → "${getPostById(postId)}"`)
    log.push(`sendEmail(email, "Hello") → "${sendEmail(email, 'Hello')}"`)

    const discounted = applyDiscount(price, discount)
    log.push(`applyDiscount($${price}, ${discount}%) → $${discounted}`)

    log.push('')
    log.push('--- Compile-time Safety ---')
    log.push('getUserById(postId)            // Error! PostId !== UserId')
    log.push('getPostById(42)                // Error! number !== PostId')
    log.push('sendEmail("not-email", "Hi")   // Error! string !== Email')
    log.push('applyDiscount(price, price)    // Error! Money !== Percentage')

    log.push('')
    log.push('--- Validation Errors ---')

    try { createUserId(-1) } catch (e) { log.push(`createUserId(-1) → ${(e as Error).message}`) }
    try { createEmail('invalid') } catch (e) { log.push(`createEmail("invalid") → ${(e as Error).message}`) }
    try { createPercentage(150) } catch (e) { log.push(`createPercentage(150) → ${(e as Error).message}`) }

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 11.4: Opaque Types</h2>
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
