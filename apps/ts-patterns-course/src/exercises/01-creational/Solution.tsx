import { useState } from 'react'

// ============================================
// Задание 1.1: Factory Method — Решение
// ============================================

interface Notification {
  send(message: string): string
  format(message: string): string
}

class EmailNotification implements Notification {
  send(message: string): string {
    return `[EMAIL] Sent: ${this.format(message)}`
  }
  format(message: string): string {
    return `<html><body>${message}</body></html>`
  }
}

class SMSNotification implements Notification {
  send(message: string): string {
    return `[SMS] Sent: ${this.format(message)}`
  }
  format(message: string): string {
    return message.length > 160 ? message.slice(0, 157) + '...' : message
  }
}

class PushNotification implements Notification {
  send(message: string): string {
    return `[PUSH] Sent: ${this.format(message)}`
  }
  format(message: string): string {
    return `🔔 ${message}`
  }
}

type NotificationType = 'email' | 'sms' | 'push'

function createNotification(type: NotificationType): Notification {
  switch (type) {
    case 'email':
      return new EmailNotification()
    case 'sms':
      return new SMSNotification()
    case 'push':
      return new PushNotification()
  }
}

export function Task1_1_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    const types: NotificationType[] = ['email', 'sms', 'push']

    log.push('--- Factory Method: Notifications ---')
    for (const type of types) {
      const notification = createNotification(type)
      log.push(`✅ ${notification.send('Hello from Factory!')}`)
    }

    log.push('')
    log.push('--- Format examples ---')
    const email = createNotification('email')
    log.push(`📧 Email format: ${email.format('Important update')}`)

    const sms = createNotification('sms')
    log.push(`📱 SMS format: ${sms.format('Short msg')}`)

    const push = createNotification('push')
    log.push(`🔔 Push format: ${push.format('New message')}`)

    log.push('')
    log.push('--- Type safety ---')
    log.push('✅ createNotification("email") — compiles OK')
    log.push('❌ createNotification("telegram") — TS error: not in NotificationType')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 1.1: Factory Method</h2>
      <button onClick={runExample}>Запустить</button>
      {results.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Результаты:</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {results.map((r, i) => (
              <li key={i} style={{ padding: '0.25rem 0', fontFamily: 'monospace', whiteSpace: 'pre' }}>
                {r}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

// ============================================
// Задание 1.2: Abstract Factory — Решение
// ============================================

interface UIComponent {
  render(): string
}

class LightButton implements UIComponent {
  constructor(private label: string) {}
  render() {
    return `[Light Button] "${this.label}" | bg: #ffffff, color: #333333, border: 1px solid #cccccc`
  }
}

class LightInput implements UIComponent {
  constructor(private placeholder: string) {}
  render() {
    return `[Light Input] placeholder: "${this.placeholder}" | bg: #ffffff, border: 1px solid #dddddd`
  }
}

class LightCard implements UIComponent {
  constructor(private title: string, private content: string) {}
  render() {
    return `[Light Card] "${this.title}" — ${this.content} | bg: #f9f9f9, shadow: light`
  }
}

class DarkButton implements UIComponent {
  constructor(private label: string) {}
  render() {
    return `[Dark Button] "${this.label}" | bg: #1a1a2e, color: #e0e0e0, border: 1px solid #444444`
  }
}

class DarkInput implements UIComponent {
  constructor(private placeholder: string) {}
  render() {
    return `[Dark Input] placeholder: "${this.placeholder}" | bg: #16213e, border: 1px solid #555555`
  }
}

class DarkCard implements UIComponent {
  constructor(private title: string, private content: string) {}
  render() {
    return `[Dark Card] "${this.title}" — ${this.content} | bg: #0f3460, shadow: dark`
  }
}

interface UIFactory {
  createButton(label: string): UIComponent
  createInput(placeholder: string): UIComponent
  createCard(title: string, content: string): UIComponent
}

class LightThemeFactory implements UIFactory {
  createButton(label: string) { return new LightButton(label) }
  createInput(placeholder: string) { return new LightInput(placeholder) }
  createCard(title: string, content: string) { return new LightCard(title, content) }
}

class DarkThemeFactory implements UIFactory {
  createButton(label: string) { return new DarkButton(label) }
  createInput(placeholder: string) { return new DarkInput(placeholder) }
  createCard(title: string, content: string) { return new DarkCard(title, content) }
}

function getFactory(theme: 'light' | 'dark'): UIFactory {
  return theme === 'light' ? new LightThemeFactory() : new DarkThemeFactory()
}

export function Task1_2_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    const themes: Array<'light' | 'dark'> = ['light', 'dark']

    for (const theme of themes) {
      const factory = getFactory(theme)
      log.push(`--- ${theme.toUpperCase()} Theme ---`)

      const button = factory.createButton('Submit')
      const input = factory.createInput('Enter your name')
      const card = factory.createCard('Welcome', 'Hello, user!')

      log.push(`  ${button.render()}`)
      log.push(`  ${input.render()}`)
      log.push(`  ${card.render()}`)
      log.push('')
    }

    log.push('--- Consistency guarantee ---')
    log.push('✅ All components from one factory share the same theme')
    log.push('✅ Impossible to mix Light Button with Dark Input')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 1.2: Abstract Factory</h2>
      <button onClick={runExample}>Запустить</button>
      {results.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Результаты:</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {results.map((r, i) => (
              <li key={i} style={{ padding: '0.25rem 0', fontFamily: 'monospace', whiteSpace: 'pre' }}>
                {r}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

// ============================================
// Задание 1.3: Builder — Решение
// ============================================

interface Query {
  table: string
  fields: string[]
  conditions: string[]
  order?: { field: string; direction: 'asc' | 'desc' }
  limitCount?: number
}

class QueryBuilder {
  private query: Partial<Query> = {}

  select(...fields: string[]): this {
    this.query.fields = fields
    return this
  }

  from(table: string): this {
    this.query.table = table
    return this
  }

  where(condition: string): this {
    if (!this.query.conditions) {
      this.query.conditions = []
    }
    this.query.conditions.push(condition)
    return this
  }

  orderBy(field: string, direction: 'asc' | 'desc' = 'asc'): this {
    this.query.order = { field, direction }
    return this
  }

  limit(count: number): this {
    this.query.limitCount = count
    return this
  }

  build(): Query {
    if (!this.query.table) {
      throw new Error('Query must have a table (use .from())')
    }
    if (!this.query.fields || this.query.fields.length === 0) {
      throw new Error('Query must have fields (use .select())')
    }
    return {
      table: this.query.table,
      fields: this.query.fields,
      conditions: this.query.conditions ?? [],
      order: this.query.order,
      limitCount: this.query.limitCount,
    }
  }

  toSQL(): string {
    const q = this.build()
    let sql = `SELECT ${q.fields.join(', ')} FROM ${q.table}`
    if (q.conditions.length > 0) {
      sql += ` WHERE ${q.conditions.join(' AND ')}`
    }
    if (q.order) {
      sql += ` ORDER BY ${q.order.field} ${q.order.direction.toUpperCase()}`
    }
    if (q.limitCount !== undefined) {
      sql += ` LIMIT ${q.limitCount}`
    }
    return sql
  }
}

export function Task1_3_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('--- Builder: QueryBuilder ---')

    // Simple query
    const q1 = new QueryBuilder()
      .select('name', 'email')
      .from('users')
      .build()
    log.push(`✅ Simple: ${JSON.stringify(q1)}`)

    // Complex query
    const q2SQL = new QueryBuilder()
      .select('id', 'name', 'email')
      .from('users')
      .where('age > 18')
      .where('active = true')
      .orderBy('name', 'asc')
      .limit(10)
      .toSQL()
    log.push(`✅ Complex: ${q2SQL}`)

    // Another query
    const q3SQL = new QueryBuilder()
      .select('product', 'price')
      .from('orders')
      .where('status = "shipped"')
      .orderBy('price', 'desc')
      .limit(5)
      .toSQL()
    log.push(`✅ Orders: ${q3SQL}`)

    // Validation
    log.push('')
    log.push('--- Validation ---')
    try {
      new QueryBuilder().select('name').build()
    } catch (e) {
      if (e instanceof Error) log.push(`❌ ${e.message}`)
    }

    try {
      new QueryBuilder().from('users').build()
    } catch (e) {
      if (e instanceof Error) log.push(`❌ ${e.message}`)
    }

    log.push('')
    log.push('--- Chaining ---')
    log.push('✅ .select().from().where().orderBy().limit().build()')
    log.push('✅ Each method returns `this` for fluent chaining')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 1.3: Builder</h2>
      <button onClick={runExample}>Запустить</button>
      {results.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Результаты:</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {results.map((r, i) => (
              <li key={i} style={{ padding: '0.25rem 0', fontFamily: 'monospace', whiteSpace: 'pre' }}>
                {r}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

// ============================================
// Задание 1.4: Singleton — Решение
// ============================================

class ConfigManager {
  private static instance: ConfigManager | null = null
  private config = new Map<string, unknown>()

  private constructor() {}

  static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager()
    }
    return ConfigManager.instance
  }

  get<T>(key: string): T | undefined {
    return this.config.get(key) as T | undefined
  }

  set<T>(key: string, value: T): void {
    this.config.set(key, value)
  }

  has(key: string): boolean {
    return this.config.has(key)
  }

  getAll(): Record<string, unknown> {
    return Object.fromEntries(this.config)
  }

  clear(): void {
    this.config.clear()
  }

  static resetInstance(): void {
    ConfigManager.instance = null
  }
}

export function Task1_4_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    // Reset for demo purposes
    ConfigManager.resetInstance()

    log.push('--- Singleton: ConfigManager ---')

    // Get instance and set values
    const config1 = ConfigManager.getInstance()
    config1.set<string>('theme', 'dark')
    config1.set<number>('maxRetries', 3)
    config1.set<boolean>('debugMode', true)
    log.push(`✅ config1 set: theme=dark, maxRetries=3, debugMode=true`)

    // Get another reference — same instance
    const config2 = ConfigManager.getInstance()
    log.push(`✅ config2.get("theme") = "${config2.get<string>('theme')}"`)
    log.push(`✅ config2.get("maxRetries") = ${config2.get<number>('maxRetries')}`)
    log.push(`✅ config2.get("debugMode") = ${config2.get<boolean>('debugMode')}`)

    // Verify same instance
    log.push('')
    log.push('--- Same instance check ---')
    log.push(`✅ config1 === config2: ${config1 === config2}`)

    // Modify via config2, read via config1
    config2.set<string>('theme', 'light')
    log.push(`✅ config2.set("theme", "light")`)
    log.push(`✅ config1.get("theme") = "${config1.get<string>('theme')}" (updated!)`)

    // has() and getAll()
    log.push('')
    log.push('--- Utility methods ---')
    log.push(`✅ has("theme"): ${config1.has('theme')}`)
    log.push(`✅ has("unknown"): ${config1.has('unknown')}`)
    log.push(`✅ getAll(): ${JSON.stringify(config1.getAll())}`)

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 1.4: Singleton</h2>
      <button onClick={runExample}>Запустить</button>
      {results.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Результаты:</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {results.map((r, i) => (
              <li key={i} style={{ padding: '0.25rem 0', fontFamily: 'monospace', whiteSpace: 'pre' }}>
                {r}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
