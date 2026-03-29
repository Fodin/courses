import { useState } from 'react'

// ============================================
// Задание 6.1: State Transitions — Решение
// ============================================

type TransitionMap = {
  idle: 'fetching'
  fetching: 'success' | 'error'
  success: 'idle' | 'fetching'
  error: 'idle' | 'fetching'
}

type MachineState = keyof TransitionMap

interface StateMachine<TMap extends Record<string, string>> {
  current: keyof TMap
  transition<S extends keyof TMap>(
    from: S,
    to: TMap[S]
  ): void
  canTransition<S extends keyof TMap>(
    from: S,
    to: string
  ): boolean
  getHistory(): Array<{ from: string; to: string; timestamp: number }>
}

function createMachine<TMap extends Record<string, string>>(
  initial: keyof TMap,
  transitions: TMap
): StateMachine<TMap> {
  let current: keyof TMap = initial
  const history: Array<{ from: string; to: string; timestamp: number }> = []

  const getAllowedTransitions = (state: keyof TMap): string[] => {
    const allowed = transitions[state]
    if (!allowed) return []
    return (allowed as string).split('|').map((s) => s.trim())
  }

  return {
    get current() {
      return current
    },
    transition<S extends keyof TMap>(from: S, to: TMap[S]) {
      if (current !== from) {
        throw new Error(`Expected state "${String(from)}" but current is "${String(current)}"`)
      }
      const allowed = getAllowedTransitions(from)
      if (!allowed.includes(to as string)) {
        throw new Error(`Invalid transition: ${String(from)} → ${String(to)}`)
      }
      history.push({ from: String(from), to: String(to), timestamp: Date.now() })
      current = to as unknown as keyof TMap
    },
    canTransition<S extends keyof TMap>(from: S, to: string): boolean {
      return current === from && getAllowedTransitions(from).includes(to)
    },
    getHistory() {
      return [...history]
    },
  }
}

// Simpler approach with explicit allowed transitions
type AllowedTransitions = {
  [K in MachineState]: MachineState[]
}

const fetchTransitions: AllowedTransitions = {
  idle: ['fetching'],
  fetching: ['success', 'error'],
  success: ['idle', 'fetching'],
  error: ['idle', 'fetching'],
}

class TypedStateMachine {
  private _state: MachineState = 'idle'
  private _history: Array<{ from: MachineState; to: MachineState }> = []

  get state(): MachineState {
    return this._state
  }

  transition(to: MachineState): void {
    const allowed = fetchTransitions[this._state]
    if (!allowed.includes(to)) {
      throw new Error(
        `Invalid transition: ${this._state} → ${to}. Allowed: [${allowed.join(', ')}]`
      )
    }
    this._history.push({ from: this._state, to })
    this._state = to
  }

  get history() {
    return [...this._history]
  }
}

export function Task6_1_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Typed State Machine: Fetch lifecycle ===')
    const machine = new TypedStateMachine()
    log.push(`  Initial state: ${machine.state}`)

    machine.transition('fetching')
    log.push(`  After fetch start: ${machine.state}`)

    machine.transition('success')
    log.push(`  After success: ${machine.state}`)

    machine.transition('fetching')
    log.push(`  Refetch: ${machine.state}`)

    machine.transition('error')
    log.push(`  After error: ${machine.state}`)

    machine.transition('idle')
    log.push(`  Reset to idle: ${machine.state}`)

    log.push('')
    log.push('=== Invalid Transitions ===')

    const machine2 = new TypedStateMachine()
    try {
      machine2.transition('success')
    } catch (e) {
      log.push(`  idle → success: ${(e as Error).message}`)
    }

    machine2.transition('fetching')
    try {
      machine2.transition('idle')
    } catch (e) {
      log.push(`  fetching → idle: ${(e as Error).message}`)
    }

    log.push('')
    log.push('=== Transition History ===')
    for (const entry of machine.history) {
      log.push(`  ${entry.from} → ${entry.to}`)
    }

    log.push('')
    log.push('=== Allowed Transitions Map ===')
    for (const [state, targets] of Object.entries(fetchTransitions)) {
      log.push(`  ${state} → [${targets.join(', ')}]`)
    }

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 6.1: State Transitions</h2>
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
// Задание 6.2: State Data Association — Решение
// ============================================

type FetchState<T, E = Error> =
  | { readonly status: 'idle' }
  | { readonly status: 'loading'; readonly startedAt: number }
  | { readonly status: 'success'; readonly data: T; readonly fetchedAt: number }
  | { readonly status: 'error'; readonly error: E; readonly failedAt: number; readonly retryCount: number }

function idle<T, E = Error>(): FetchState<T, E> {
  return { status: 'idle' }
}

function loading<T, E = Error>(startedAt: number): FetchState<T, E> {
  return { status: 'loading', startedAt }
}

function success<T, E = Error>(data: T): FetchState<T, E> {
  return { status: 'success', data, fetchedAt: Date.now() }
}

function error<T, E>(err: E, retryCount: number): FetchState<T, E> {
  return { status: 'error', error: err, failedAt: Date.now(), retryCount }
}

function mapFetchState<T, U, E>(
  state: FetchState<T, E>,
  fn: (data: T) => U
): FetchState<U, E> {
  if (state.status === 'success') {
    return success(fn(state.data))
  }
  return state as unknown as FetchState<U, E>
}

function foldFetchState<T, E, R>(
  state: FetchState<T, E>,
  handlers: {
    idle: () => R
    loading: (startedAt: number) => R
    success: (data: T, fetchedAt: number) => R
    error: (err: E, retryCount: number) => R
  }
): R {
  switch (state.status) {
    case 'idle': return handlers.idle()
    case 'loading': return handlers.loading(state.startedAt)
    case 'success': return handlers.success(state.data, state.fetchedAt)
    case 'error': return handlers.error(state.error, state.retryCount)
  }
}

interface User {
  id: string
  name: string
  email: string
}

type FormState =
  | { readonly status: 'editing'; readonly values: Record<string, string>; readonly dirty: boolean }
  | { readonly status: 'validating'; readonly values: Record<string, string> }
  | { readonly status: 'submitting'; readonly values: Record<string, string> }
  | { readonly status: 'submitted'; readonly responseId: string }
  | { readonly status: 'failed'; readonly errors: string[]; readonly values: Record<string, string> }

export function Task6_2_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== FetchState: data associated with states ===')

    let state: FetchState<User[], string> = idle()
    log.push(`  1. ${foldFetchState(state, {
      idle: () => 'Idle — no data, no error',
      loading: (t) => `Loading since ${t}`,
      success: (d, t) => `${d.length} users fetched at ${t}`,
      error: (e, r) => `Error: ${e}, retries: ${r}`,
    })}`)

    state = loading(Date.now())
    log.push(`  2. ${foldFetchState(state, {
      idle: () => 'Idle',
      loading: () => 'Loading — has startedAt timestamp',
      success: (d) => `Success: ${d.length} users`,
      error: (e) => `Error: ${e}`,
    })}`)

    state = success([
      { id: '1', name: 'Alice', email: 'alice@test.com' },
      { id: '2', name: 'Bob', email: 'bob@test.com' },
    ])
    log.push(`  3. ${foldFetchState(state, {
      idle: () => 'Idle',
      loading: () => 'Loading',
      success: (users) => `Success: [${users.map((u) => u.name).join(', ')}]`,
      error: (e) => `Error: ${e}`,
    })}`)

    state = error('Network timeout', 2)
    log.push(`  4. ${foldFetchState(state, {
      idle: () => 'Idle',
      loading: () => 'Loading',
      success: (d) => `Success: ${d.length}`,
      error: (e, retries) => `Error: "${e}", retryCount=${retries}`,
    })}`)

    log.push('')
    log.push('=== Type narrowing in each state ===')
    const demoState: FetchState<User[], string> = success([
      { id: '1', name: 'Charlie', email: 'charlie@test.com' },
    ])
    if (demoState.status === 'success') {
      // TypeScript knows: demoState.data is User[], demoState.fetchedAt is number
      log.push(`  In success branch: data.length=${demoState.data.length}, fetchedAt=${demoState.fetchedAt}`)
    }
    if (demoState.status === 'error') {
      // TypeScript knows: demoState.error and demoState.retryCount exist
      log.push(`  In error branch: error=${demoState.error}`)
    }

    log.push('')
    log.push('=== mapFetchState: transform data ===')
    const usersState: FetchState<User[], string> = success([
      { id: '1', name: 'Alice', email: 'alice@test.com' },
    ])
    const namesState = mapFetchState(usersState, (users) => users.map((u) => u.name))
    log.push(`  Mapped User[] → string[]: ${foldFetchState(namesState, {
      idle: () => 'idle',
      loading: () => 'loading',
      success: (names) => `[${names.join(', ')}]`,
      error: (e) => `error: ${e}`,
    })}`)

    log.push('')
    log.push('=== FormState: different data per status ===')
    const formStates: FormState[] = [
      { status: 'editing', values: { name: 'Alice' }, dirty: true },
      { status: 'validating', values: { name: 'Alice' } },
      { status: 'submitting', values: { name: 'Alice' } },
      { status: 'submitted', responseId: 'resp-123' },
      { status: 'failed', errors: ['Name too short'], values: { name: 'Al' } },
    ]
    for (const form of formStates) {
      switch (form.status) {
        case 'editing':
          log.push(`  editing: dirty=${form.dirty}, values=${JSON.stringify(form.values)}`)
          break
        case 'validating':
          log.push(`  validating: values=${JSON.stringify(form.values)}`)
          break
        case 'submitting':
          log.push(`  submitting: values=${JSON.stringify(form.values)}`)
          break
        case 'submitted':
          log.push(`  submitted: responseId=${form.responseId}`)
          break
        case 'failed':
          log.push(`  failed: errors=[${form.errors.join('; ')}]`)
          break
      }
    }

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 6.2: State Data Association</h2>
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
// Задание 6.3: Hierarchical States — Решение
// ============================================

type ConnectionSubState =
  | { readonly status: 'connecting'; readonly attempt: number }
  | { readonly status: 'connected'; readonly connectedAt: number; readonly latency: number }

type AuthSubState =
  | { readonly status: 'anonymous' }
  | { readonly status: 'authenticating'; readonly provider: string }
  | { readonly status: 'authenticated'; readonly userId: string; readonly token: string }
  | { readonly status: 'authError'; readonly reason: string }

type AppState =
  | { readonly phase: 'offline' }
  | { readonly phase: 'online'; readonly connection: ConnectionSubState; readonly auth: AuthSubState }
  | { readonly phase: 'maintenance'; readonly estimatedEnd: number; readonly message: string }

function describeAppState(state: AppState): string[] {
  const lines: string[] = []

  switch (state.phase) {
    case 'offline':
      lines.push('App is OFFLINE')
      break

    case 'maintenance':
      lines.push(`App is in MAINTENANCE mode`)
      lines.push(`  Message: ${state.message}`)
      lines.push(`  Estimated end: ${new Date(state.estimatedEnd).toISOString()}`)
      break

    case 'online': {
      lines.push('App is ONLINE')

      switch (state.connection.status) {
        case 'connecting':
          lines.push(`  Connection: connecting (attempt #${state.connection.attempt})`)
          break
        case 'connected':
          lines.push(`  Connection: connected (latency: ${state.connection.latency}ms)`)
          break
      }

      switch (state.auth.status) {
        case 'anonymous':
          lines.push('  Auth: not logged in')
          break
        case 'authenticating':
          lines.push(`  Auth: logging in via ${state.auth.provider}...`)
          break
        case 'authenticated':
          lines.push(`  Auth: logged in as ${state.auth.userId}`)
          break
        case 'authError':
          lines.push(`  Auth: error — ${state.auth.reason}`)
          break
      }
      break
    }
  }

  return lines
}

type AppAction =
  | { type: 'GO_ONLINE' }
  | { type: 'GO_OFFLINE' }
  | { type: 'CONNECTED'; latency: number }
  | { type: 'LOGIN'; provider: string }
  | { type: 'LOGIN_SUCCESS'; userId: string; token: string }
  | { type: 'LOGIN_ERROR'; reason: string }
  | { type: 'LOGOUT' }
  | { type: 'MAINTENANCE'; estimatedEnd: number; message: string }

function reduceAppState(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'GO_ONLINE':
      return {
        phase: 'online',
        connection: { status: 'connecting', attempt: 1 },
        auth: { status: 'anonymous' },
      }

    case 'GO_OFFLINE':
      return { phase: 'offline' }

    case 'MAINTENANCE':
      return {
        phase: 'maintenance',
        estimatedEnd: action.estimatedEnd,
        message: action.message,
      }

    case 'CONNECTED':
      if (state.phase !== 'online') return state
      return {
        ...state,
        connection: { status: 'connected', connectedAt: Date.now(), latency: action.latency },
      }

    case 'LOGIN':
      if (state.phase !== 'online') return state
      return {
        ...state,
        auth: { status: 'authenticating', provider: action.provider },
      }

    case 'LOGIN_SUCCESS':
      if (state.phase !== 'online') return state
      return {
        ...state,
        auth: { status: 'authenticated', userId: action.userId, token: action.token },
      }

    case 'LOGIN_ERROR':
      if (state.phase !== 'online') return state
      return {
        ...state,
        auth: { status: 'authError', reason: action.reason },
      }

    case 'LOGOUT':
      if (state.phase !== 'online') return state
      return {
        ...state,
        auth: { status: 'anonymous' },
      }
  }
}

export function Task6_3_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Hierarchical State Machine ===')

    let state: AppState = { phase: 'offline' }
    log.push('Step 1: Initial')
    log.push(...describeAppState(state).map((l) => `  ${l}`))

    log.push('')
    state = reduceAppState(state, { type: 'GO_ONLINE' })
    log.push('Step 2: Go online')
    log.push(...describeAppState(state).map((l) => `  ${l}`))

    log.push('')
    state = reduceAppState(state, { type: 'CONNECTED', latency: 45 })
    log.push('Step 3: Connected')
    log.push(...describeAppState(state).map((l) => `  ${l}`))

    log.push('')
    state = reduceAppState(state, { type: 'LOGIN', provider: 'GitHub' })
    log.push('Step 4: Login attempt')
    log.push(...describeAppState(state).map((l) => `  ${l}`))

    log.push('')
    state = reduceAppState(state, { type: 'LOGIN_SUCCESS', userId: 'user-42', token: 'jwt-xxx' })
    log.push('Step 5: Login success')
    log.push(...describeAppState(state).map((l) => `  ${l}`))

    log.push('')
    state = reduceAppState(state, { type: 'LOGOUT' })
    log.push('Step 6: Logout')
    log.push(...describeAppState(state).map((l) => `  ${l}`))

    log.push('')
    state = reduceAppState(state, {
      type: 'MAINTENANCE',
      estimatedEnd: Date.now() + 3600000,
      message: 'Scheduled database migration',
    })
    log.push('Step 7: Maintenance mode')
    log.push(...describeAppState(state).map((l) => `  ${l}`))

    log.push('')
    log.push('=== Type Safety: nested state access ===')
    const onlineState: AppState = {
      phase: 'online',
      connection: { status: 'connected', connectedAt: Date.now(), latency: 30 },
      auth: { status: 'authenticated', userId: 'user-1', token: 'abc' },
    }
    if (onlineState.phase === 'online') {
      if (onlineState.auth.status === 'authenticated') {
        log.push(`  Online + Authenticated: user=${onlineState.auth.userId}`)
        log.push(`  Connection latency: ${onlineState.connection.status === 'connected' ? onlineState.connection.latency : 'N/A'}ms`)
      }
    }

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 6.3: Hierarchical States</h2>
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
// Задание 6.4: State Narrowing — Решение
// ============================================

type DocumentState =
  | { readonly status: 'draft'; readonly content: string; readonly author: string }
  | { readonly status: 'review'; readonly content: string; readonly author: string; readonly reviewer: string; readonly comments: string[] }
  | { readonly status: 'approved'; readonly content: string; readonly author: string; readonly approvedBy: string; readonly approvedAt: number }
  | { readonly status: 'published'; readonly content: string; readonly author: string; readonly publishedAt: number; readonly url: string }
  | { readonly status: 'archived'; readonly content: string; readonly author: string; readonly archivedAt: number; readonly reason: string }

function isInState<S extends DocumentState['status']>(
  state: DocumentState,
  status: S
): state is Extract<DocumentState, { status: S }> {
  return state.status === status
}

function getStateData<S extends DocumentState['status']>(
  state: DocumentState,
  status: S
): Extract<DocumentState, { status: S }> | null {
  if (state.status === status) {
    return state as Extract<DocumentState, { status: S }>
  }
  return null
}

function matchDocumentState<R>(
  state: DocumentState,
  handlers: {
    draft: (s: Extract<DocumentState, { status: 'draft' }>) => R
    review: (s: Extract<DocumentState, { status: 'review' }>) => R
    approved: (s: Extract<DocumentState, { status: 'approved' }>) => R
    published: (s: Extract<DocumentState, { status: 'published' }>) => R
    archived: (s: Extract<DocumentState, { status: 'archived' }>) => R
  }
): R {
  switch (state.status) {
    case 'draft': return handlers.draft(state)
    case 'review': return handlers.review(state)
    case 'approved': return handlers.approved(state)
    case 'published': return handlers.published(state)
    case 'archived': return handlers.archived(state)
  }
}

function submitForReview(state: Extract<DocumentState, { status: 'draft' }>, reviewer: string): Extract<DocumentState, { status: 'review' }> {
  return {
    status: 'review',
    content: state.content,
    author: state.author,
    reviewer,
    comments: [],
  }
}

function approve(state: Extract<DocumentState, { status: 'review' }>): Extract<DocumentState, { status: 'approved' }> {
  return {
    status: 'approved',
    content: state.content,
    author: state.author,
    approvedBy: state.reviewer,
    approvedAt: Date.now(),
  }
}

function publish(state: Extract<DocumentState, { status: 'approved' }>, url: string): Extract<DocumentState, { status: 'published' }> {
  return {
    status: 'published',
    content: state.content,
    author: state.author,
    publishedAt: Date.now(),
    url,
  }
}

function archive(state: DocumentState, reason: string): Extract<DocumentState, { status: 'archived' }> {
  if (state.status === 'archived') {
    throw new Error('Already archived')
  }
  return {
    status: 'archived',
    content: state.content,
    author: state.author,
    archivedAt: Date.now(),
    reason,
  }
}

export function Task6_4_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Document Workflow with State Narrowing ===')

    const draft: Extract<DocumentState, { status: 'draft' }> = {
      status: 'draft',
      content: 'TypeScript State Machines Guide',
      author: 'Alice',
    }
    log.push(`  1. Draft: "${draft.content}" by ${draft.author}`)

    const inReview = submitForReview(draft, 'Bob')
    log.push(`  2. Review: reviewer=${inReview.reviewer}, comments=${inReview.comments.length}`)

    const approved = approve(inReview)
    log.push(`  3. Approved: by ${approved.approvedBy}`)

    const published = publish(approved, 'https://blog.example.com/ts-state-machines')
    log.push(`  4. Published: url=${published.url}`)

    log.push('')
    log.push('=== Type Guard: isInState() ===')
    const states: DocumentState[] = [draft, inReview, approved, published]
    for (const state of states) {
      if (isInState(state, 'review')) {
        log.push(`  Found review state: reviewer=${state.reviewer}`)
      }
      if (isInState(state, 'published')) {
        log.push(`  Found published state: url=${state.url}`)
      }
    }

    log.push('')
    log.push('=== Safe Extraction: getStateData() ===')
    for (const state of states) {
      const reviewData = getStateData(state, 'review')
      if (reviewData) {
        log.push(`  Extracted review: reviewer=${reviewData.reviewer}`)
      }
      const pubData = getStateData(state, 'published')
      if (pubData) {
        log.push(`  Extracted published: url=${pubData.url}`)
      }
    }

    log.push('')
    log.push('=== Exhaustive Match: matchDocumentState() ===')
    for (const state of states) {
      const description = matchDocumentState(state, {
        draft: (s) => `DRAFT: "${s.content}" by ${s.author}`,
        review: (s) => `REVIEW: reviewer=${s.reviewer}, ${s.comments.length} comments`,
        approved: (s) => `APPROVED: by ${s.approvedBy}`,
        published: (s) => `PUBLISHED: ${s.url}`,
        archived: (s) => `ARCHIVED: reason="${s.reason}"`,
      })
      log.push(`  ${description}`)
    }

    log.push('')
    log.push('=== Archive from any state ===')
    const archivedDoc = archive(published, 'Content outdated')
    log.push(`  Archived: reason="${archivedDoc.reason}"`)
    try {
      archive(archivedDoc, 'Double archive')
    } catch (e) {
      log.push(`  Re-archive rejected: ${(e as Error).message}`)
    }

    log.push('')
    log.push('=== Type-safe transitions: compile-time guarantees ===')
    log.push('  submitForReview() only accepts draft state')
    log.push('  approve() only accepts review state')
    log.push('  publish() only accepts approved state')
    log.push('  Passing wrong state → TypeScript compilation error')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 6.4: State Narrowing</h2>
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
