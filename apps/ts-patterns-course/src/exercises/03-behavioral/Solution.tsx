import { useState } from 'react'

// ============================================
// Задание 3.1: Strategy — Решение
// ============================================

interface SortStrategy<T> {
  name: string
  sort(data: T[], compare: (a: T, b: T) => number): T[]
}

class BubbleSort<T> implements SortStrategy<T> {
  name = 'BubbleSort'

  sort(data: T[], compare: (a: T, b: T) => number): T[] {
    const arr = [...data]
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        if (compare(arr[j], arr[j + 1]) > 0) {
          ;[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
        }
      }
    }
    return arr
  }
}

class QuickSort<T> implements SortStrategy<T> {
  name = 'QuickSort'

  sort(data: T[], compare: (a: T, b: T) => number): T[] {
    const arr = [...data]
    this.quickSort(arr, 0, arr.length - 1, compare)
    return arr
  }

  private quickSort(arr: T[], low: number, high: number, compare: (a: T, b: T) => number): void {
    if (low < high) {
      const pi = this.partition(arr, low, high, compare)
      this.quickSort(arr, low, pi - 1, compare)
      this.quickSort(arr, pi + 1, high, compare)
    }
  }

  private partition(arr: T[], low: number, high: number, compare: (a: T, b: T) => number): number {
    const pivot = arr[high]
    let i = low - 1
    for (let j = low; j < high; j++) {
      if (compare(arr[j], pivot) <= 0) {
        i++
        ;[arr[i], arr[j]] = [arr[j], arr[i]]
      }
    }
    ;[arr[i + 1], arr[high]] = [arr[high], arr[i + 1]]
    return i + 1
  }
}

class MergeSort<T> implements SortStrategy<T> {
  name = 'MergeSort'

  sort(data: T[], compare: (a: T, b: T) => number): T[] {
    if (data.length <= 1) return [...data]
    const mid = Math.floor(data.length / 2)
    const left = this.sort(data.slice(0, mid), compare)
    const right = this.sort(data.slice(mid), compare)
    return this.merge(left, right, compare)
  }

  private merge(left: T[], right: T[], compare: (a: T, b: T) => number): T[] {
    const result: T[] = []
    let i = 0
    let j = 0
    while (i < left.length && j < right.length) {
      if (compare(left[i], right[j]) <= 0) {
        result.push(left[i++])
      } else {
        result.push(right[j++])
      }
    }
    return [...result, ...left.slice(i), ...right.slice(j)]
  }
}

class Sorter<T> {
  private strategy: SortStrategy<T>

  constructor(strategy: SortStrategy<T>) {
    this.strategy = strategy
  }

  setStrategy(strategy: SortStrategy<T>): void {
    this.strategy = strategy
  }

  sort(data: T[], compare: (a: T, b: T) => number): T[] {
    return this.strategy.sort(data, compare)
  }

  getStrategyName(): string {
    return this.strategy.name
  }
}

export function Task3_1_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []
    const data = [38, 27, 43, 3, 9, 82, 10]
    const compare = (a: number, b: number) => a - b

    log.push(`Input: [${data.join(', ')}]`)
    log.push('')

    const sorter = new Sorter<number>(new BubbleSort())
    log.push(`Strategy: ${sorter.getStrategyName()}`)
    log.push(`Result:   [${sorter.sort(data, compare).join(', ')}]`)
    log.push('')

    sorter.setStrategy(new QuickSort())
    log.push(`Strategy: ${sorter.getStrategyName()}`)
    log.push(`Result:   [${sorter.sort(data, compare).join(', ')}]`)
    log.push('')

    sorter.setStrategy(new MergeSort())
    log.push(`Strategy: ${sorter.getStrategyName()}`)
    log.push(`Result:   [${sorter.sort(data, compare).join(', ')}]`)
    log.push('')

    // Demonstrate with strings
    const words = ['banana', 'apple', 'cherry', 'date']
    const strCompare = (a: string, b: string) => a.localeCompare(b)
    const strSorter = new Sorter<string>(new QuickSort())
    log.push(`--- String sorting ---`)
    log.push(`Input:  [${words.join(', ')}]`)
    log.push(`Result: [${strSorter.sort(words, strCompare).join(', ')}]`)

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 3.1: Strategy</h2>
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
// Задание 3.2: Observer — Решение
// ============================================

type Listener<T> = (data: T) => void

class TypedEventEmitter<TEventMap extends Record<string, unknown>> {
  private listeners = new Map<keyof TEventMap, Set<Listener<never>>>()

  on<K extends keyof TEventMap>(event: K, listener: Listener<TEventMap[K]>): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }
    this.listeners.get(event)!.add(listener as Listener<never>)
  }

  off<K extends keyof TEventMap>(event: K, listener: Listener<TEventMap[K]>): void {
    this.listeners.get(event)?.delete(listener as Listener<never>)
  }

  emit<K extends keyof TEventMap>(event: K, data: TEventMap[K]): void {
    const set = this.listeners.get(event)
    if (set) {
      set.forEach(fn => (fn as Listener<TEventMap[K]>)(data))
    }
  }

  listenerCount<K extends keyof TEventMap>(event: K): number {
    return this.listeners.get(event)?.size ?? 0
  }
}

interface AppEvents {
  userLogin: { userId: string; timestamp: number }
  userLogout: { userId: string }
  error: { message: string; code: number }
}

export function Task3_2_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []
    const emitter = new TypedEventEmitter<AppEvents>()

    // Subscribe to events
    emitter.on('userLogin', (data) => {
      log.push(`[LOGIN] User ${data.userId} at ${new Date(data.timestamp).toLocaleTimeString()}`)
    })

    const logoutHandler: Listener<AppEvents['userLogout']> = (data) => {
      log.push(`[LOGOUT] User ${data.userId}`)
    }
    emitter.on('userLogout', logoutHandler)

    emitter.on('error', (data) => {
      log.push(`[ERROR] Code ${data.code}: ${data.message}`)
    })

    log.push('--- Emitting events ---')
    emitter.emit('userLogin', { userId: 'alice', timestamp: Date.now() })
    emitter.emit('error', { message: 'Connection timeout', code: 408 })
    emitter.emit('userLogout', { userId: 'alice' })

    log.push('')
    log.push(`Listener count for "userLogin": ${emitter.listenerCount('userLogin')}`)
    log.push(`Listener count for "userLogout": ${emitter.listenerCount('userLogout')}`)

    // Unsubscribe
    emitter.off('userLogout', logoutHandler)
    log.push('')
    log.push('--- After off("userLogout") ---')
    log.push(`Listener count for "userLogout": ${emitter.listenerCount('userLogout')}`)
    emitter.emit('userLogout', { userId: 'bob' })
    log.push('(no output — listener removed)')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 3.2: Observer (TypedEventEmitter)</h2>
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
// Задание 3.3: Command — Решение
// ============================================

interface Command {
  execute(): void
  undo(): void
  describe(): string
}

class TextEditor {
  private content = ''
  private history: Command[] = []

  getContent(): string {
    return this.content
  }

  setContent(content: string): void {
    this.content = content
  }

  executeCommand(command: Command): void {
    command.execute()
    this.history.push(command)
  }

  undo(): Command | undefined {
    const command = this.history.pop()
    command?.undo()
    return command
  }

  getHistorySize(): number {
    return this.history.length
  }
}

class InsertTextCommand implements Command {
  private previousContent = ''

  constructor(
    private editor: TextEditor,
    private text: string,
    private position: number
  ) {}

  execute(): void {
    this.previousContent = this.editor.getContent()
    const content = this.editor.getContent()
    const newContent = content.slice(0, this.position) + this.text + content.slice(this.position)
    this.editor.setContent(newContent)
  }

  undo(): void {
    this.editor.setContent(this.previousContent)
  }

  describe(): string {
    return `Insert "${this.text}" at position ${this.position}`
  }
}

class DeleteTextCommand implements Command {
  private deletedText = ''
  private previousContent = ''

  constructor(
    private editor: TextEditor,
    private position: number,
    private length: number
  ) {}

  execute(): void {
    this.previousContent = this.editor.getContent()
    const content = this.editor.getContent()
    this.deletedText = content.slice(this.position, this.position + this.length)
    const newContent = content.slice(0, this.position) + content.slice(this.position + this.length)
    this.editor.setContent(newContent)
  }

  undo(): void {
    this.editor.setContent(this.previousContent)
  }

  describe(): string {
    return `Delete ${this.length} chars at position ${this.position} ("${this.deletedText}")`
  }
}

export function Task3_3_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []
    const editor = new TextEditor()

    log.push('--- Executing commands ---')

    const cmd1 = new InsertTextCommand(editor, 'Hello', 0)
    editor.executeCommand(cmd1)
    log.push(`${cmd1.describe()}`)
    log.push(`  Content: "${editor.getContent()}"`)

    const cmd2 = new InsertTextCommand(editor, ' World', 5)
    editor.executeCommand(cmd2)
    log.push(`${cmd2.describe()}`)
    log.push(`  Content: "${editor.getContent()}"`)

    const cmd3 = new InsertTextCommand(editor, '!', 11)
    editor.executeCommand(cmd3)
    log.push(`${cmd3.describe()}`)
    log.push(`  Content: "${editor.getContent()}"`)

    const cmd4 = new DeleteTextCommand(editor, 5, 6)
    editor.executeCommand(cmd4)
    log.push(`${cmd4.describe()}`)
    log.push(`  Content: "${editor.getContent()}"`)

    log.push('')
    log.push(`History size: ${editor.getHistorySize()}`)
    log.push('')
    log.push('--- Undo operations ---')

    let undone = editor.undo()
    log.push(`Undo: ${undone?.describe()}`)
    log.push(`  Content: "${editor.getContent()}"`)

    undone = editor.undo()
    log.push(`Undo: ${undone?.describe()}`)
    log.push(`  Content: "${editor.getContent()}"`)

    undone = editor.undo()
    log.push(`Undo: ${undone?.describe()}`)
    log.push(`  Content: "${editor.getContent()}"`)

    log.push('')
    log.push(`History size: ${editor.getHistorySize()}`)

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 3.3: Command (TextEditor)</h2>
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
// Задание 3.4: Chain of Responsibility — Решение
// ============================================

interface HttpRequest {
  userId: string
  token: string
  body: Record<string, unknown>
  timestamp: number
  logs: string[]
}

interface Handler<T> {
  setNext(handler: Handler<T>): Handler<T>
  handle(request: T): T | null
}

abstract class BaseHandler implements Handler<HttpRequest> {
  private next: Handler<HttpRequest> | null = null

  setNext(handler: Handler<HttpRequest>): Handler<HttpRequest> {
    this.next = handler
    return handler
  }

  handle(request: HttpRequest): HttpRequest | null {
    if (this.next) {
      return this.next.handle(request)
    }
    return request
  }
}

class AuthHandler extends BaseHandler {
  private validTokens = new Set(['token-abc', 'token-xyz'])

  handle(request: HttpRequest): HttpRequest | null {
    if (!this.validTokens.has(request.token)) {
      request.logs.push('❌ [Auth] Invalid token — request rejected')
      return null
    }
    request.logs.push('✅ [Auth] Token valid')
    return super.handle(request)
  }
}

class RateLimitHandler extends BaseHandler {
  private requestCounts = new Map<string, number>()
  private limit = 3

  handle(request: HttpRequest): HttpRequest | null {
    const count = (this.requestCounts.get(request.userId) ?? 0) + 1
    this.requestCounts.set(request.userId, count)

    if (count > this.limit) {
      request.logs.push(`❌ [RateLimit] User "${request.userId}" exceeded limit (${count}/${this.limit})`)
      return null
    }
    request.logs.push(`✅ [RateLimit] ${count}/${this.limit} requests`)
    return super.handle(request)
  }
}

class ValidationHandler extends BaseHandler {
  handle(request: HttpRequest): HttpRequest | null {
    if (!request.body || Object.keys(request.body).length === 0) {
      request.logs.push('❌ [Validation] Empty request body')
      return null
    }
    request.logs.push(`✅ [Validation] Body has ${Object.keys(request.body).length} field(s)`)
    return super.handle(request)
  }
}

class LogHandler extends BaseHandler {
  handle(request: HttpRequest): HttpRequest | null {
    const elapsed = Date.now() - request.timestamp
    request.logs.push(`✅ [Log] Request from "${request.userId}" processed in ${elapsed}ms`)
    return super.handle(request)
  }
}

export function Task3_4_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    // Build chain: Auth → RateLimit → Validation → Log
    const auth = new AuthHandler()
    const rateLimit = new RateLimitHandler()
    const validation = new ValidationHandler()
    const logger = new LogHandler()

    auth.setNext(rateLimit).setNext(validation).setNext(logger)

    // Request 1: valid
    log.push('--- Request 1: Valid ---')
    const req1: HttpRequest = {
      userId: 'alice',
      token: 'token-abc',
      body: { action: 'create', name: 'test' },
      timestamp: Date.now(),
      logs: [],
    }
    const result1 = auth.handle(req1)
    log.push(...req1.logs)
    log.push(result1 ? '→ Request passed all handlers' : '→ Request was rejected')

    // Request 2: invalid token
    log.push('')
    log.push('--- Request 2: Invalid token ---')
    const req2: HttpRequest = {
      userId: 'bob',
      token: 'invalid-token',
      body: { action: 'read' },
      timestamp: Date.now(),
      logs: [],
    }
    const result2 = auth.handle(req2)
    log.push(...req2.logs)
    log.push(result2 ? '→ Request passed all handlers' : '→ Request was rejected')

    // Request 3: empty body
    log.push('')
    log.push('--- Request 3: Empty body ---')
    const req3: HttpRequest = {
      userId: 'alice',
      token: 'token-abc',
      body: {},
      timestamp: Date.now(),
      logs: [],
    }
    const result3 = auth.handle(req3)
    log.push(...req3.logs)
    log.push(result3 ? '→ Request passed all handlers' : '→ Request was rejected')

    // Request 4-6: rate limit exceeded
    log.push('')
    log.push('--- Requests 4-5: Rate limit test ---')
    for (let i = 0; i < 2; i++) {
      const req: HttpRequest = {
        userId: 'alice',
        token: 'token-abc',
        body: { i },
        timestamp: Date.now(),
        logs: [],
      }
      const result = auth.handle(req)
      log.push(...req.logs)
      log.push(result ? '→ Passed' : '→ Rejected')
      log.push('')
    }

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 3.4: Chain of Responsibility</h2>
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
