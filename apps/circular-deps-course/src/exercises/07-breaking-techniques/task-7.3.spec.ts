import { noRuntimeCycles, fileContains, type LabSpec } from 'src/engine'

/**
 * Задание 7.3 (сложное) — Инверсия зависимости применяется дважды.
 *
 * Дано: два независимых двусторонних цикла — auth.ts ↔ session.ts и
 * cache.ts ↔ metrics.ts. В обоих случаях «нижний» модуль (session.ts,
 * metrics.ts) вызывает функцию из «верхнего» напрямую через импорт, хотя
 * нужна она ему только внутри одной вспомогательной функции. Задача: в
 * обоих модулях убрать обратный импорт и принять нужную функцию параметром.
 */

const authStart = `import { touchSession } from './session'

export interface AuthUser {
  id: string
  role: string
}

export function login(id: string, role: string): AuthUser {
  const user: AuthUser = { id, role }
  touchSession(user)
  return user
}
`

const sessionStart = `import { login } from './auth'

export function touchSession(user: { id: string; role: string }): void {
  console.log('session touched for', user.id)
}

// TODO: reLogin вызывает login обратно из auth.ts — уберите импорт
// и примите login параметром функции.
export function reLogin(id: string, role: string) {
  return login(id, role)
}
`

const sessionSolution = `export function touchSession(user: { id: string; role: string }): void {
  console.log('session touched for', user.id)
}

export function reLogin(
  id: string,
  role: string,
  login: (id: string, role: string) => { id: string; role: string }
) {
  return login(id, role)
}
`

const cacheStart = `import { recordHit } from './metrics'

export interface CacheEntry {
  key: string
  value: string
}

export function get(key: string, store: Map<string, string>): CacheEntry | undefined {
  const value = store.get(key)
  recordHit(key, Boolean(value))
  return value ? { key, value } : undefined
}
`

const metricsStart = `import { get } from './cache'

export function recordHit(key: string, hit: boolean): void {
  console.log(key, hit)
}

// TODO: replay вызывает get обратно из cache.ts — уберите импорт
// и примите get параметром функции.
export function replay(key: string, store: Map<string, string>) {
  return get(key, store)
}
`

const metricsSolution = `export function recordHit(key: string, hit: boolean): void {
  console.log(key, hit)
}

export function replay(
  key: string,
  store: Map<string, string>,
  get: (key: string, store: Map<string, string>) => { key: string; value: string } | undefined
) {
  return get(key, store)
}
`

export const spec: LabSpec = {
  id: '7.3',
  title: 'Задание 7.3 — Инверсия зависимости применяется дважды (сложное)',
  aliases: { '@': 'src' },
  files: [
    { path: 'src/auth.ts', content: authStart, role: 'readonly' },
    { path: 'src/session.ts', content: sessionStart, role: 'editable' },
    { path: 'src/cache.ts', content: cacheStart, role: 'readonly' },
    { path: 'src/metrics.ts', content: metricsStart, role: 'editable' },
  ],
  solution: [
    { path: 'src/auth.ts', content: authStart, role: 'readonly' },
    { path: 'src/session.ts', content: sessionSolution, role: 'editable' },
    { path: 'src/cache.ts', content: cacheStart, role: 'readonly' },
    { path: 'src/metrics.ts', content: metricsSolution, role: 'editable' },
  ],
  checks: [
    noRuntimeCycles(),
    fileContains(
      'src/session.ts',
      /reLogin\(\s*id: string,\s*role: string,\s*login:\s*\(/,
      '`reLogin` принимает `login` параметром, а не импортирует его из auth.ts'
    ),
    fileContains(
      'src/metrics.ts',
      /replay\(\s*key: string,\s*store: Map<string, string>,\s*get:\s*\(/,
      '`replay` принимает `get` параметром, а не импортирует его из cache.ts'
    ),
  ],
}
