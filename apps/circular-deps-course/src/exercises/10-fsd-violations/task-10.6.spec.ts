import { importsRespectLayers, noDeepImport, noRuntimeCycles, type LabSpec } from 'src/engine'

/**
 * Задание 10.6 (сложное) — Полноценное ревью: цикл + импорт вверх + глубокий импорт.
 *
 * `entities/user/model/session.ts` (внутренний файл слайса, не часть public API)
 * импортирует `notifyProfileSaved` из `features/profile-edit` — это импорт вверх
 * по слоям. `features/profile-edit/index.ts` в ответ импортирует `setSession`
 * НАПРЯМУЮ из `entities/user/model/session.ts`, в обход `entities/user/index.ts`
 * (обход public API). Вместе эти два нарушения замыкают рантайм-цикл.
 *
 * Правки:
 * 1. `entities/user/model/session.ts` — убрать импорт из features, уведомление —
 *    забота вызывающего кода, а не сессии.
 * 2. `entities/user/index.ts` — добавить `setSession`/`getSession` в public API.
 * 3. `features/profile-edit/index.ts` — импортировать `setSession` через public
 *    API `entities/user`, а не в обход, и самому вызывать нотификацию.
 */

const userTypesStart = `export interface User {
  id: string
  name: string
}
`

const userIndexStart = `export type { User } from './model/types'

export function getUser(id: string) {
  return { id, name: 'Anonymous' }
}

// TODO: setSession/getSession используются снаружи, но не экспортированы отсюда
`

const userIndexSolution = `export type { User } from './model/types'
export { setSession, getSession } from './model/session'

export function getUser(id: string) {
  return { id, name: 'Anonymous' }
}
`

const sessionStart = `import { notifyProfileSaved } from '@/features/profile-edit'
import type { User } from './types'

let currentUser: User | null = null

// TODO: entities не должен импортировать features — убери notifyProfileSaved отсюда
export function setSession(user: User): void {
  currentUser = user
  notifyProfileSaved(user.id)
}

export function getSession(): User | null {
  return currentUser
}
`

const sessionSolution = `import type { User } from './types'

let currentUser: User | null = null

export function setSession(user: User): void {
  currentUser = user
}

export function getSession(): User | null {
  return currentUser
}
`

const profileEditStart = `import { setSession } from '@/entities/user/model/session'

export function notifyProfileSaved(userId: string): void {
  console.log('profile saved for', userId)
}

// TODO: импортируй setSession через public API entities/user, а не в обход
export function saveProfile(id: string, name: string): void {
  setSession({ id, name })
}
`

const profileEditSolution = `import { setSession } from '@/entities/user'

export function notifyProfileSaved(userId: string): void {
  console.log('profile saved for', userId)
}

export function saveProfile(id: string, name: string): void {
  setSession({ id, name })
  notifyProfileSaved(id)
}
`

const roFiles = [
  { path: 'src/entities/user/model/types.ts', content: userTypesStart, role: 'readonly' as const },
]

export const spec: LabSpec = {
  id: '10.6',
  title: 'Задание 10.6 — Полноценное ревью: цикл + импорт вверх + глубокий импорт (сложное)',
  aliases: { '@': 'src' },
  files: [
    ...roFiles,
    { path: 'src/entities/user/index.ts', content: userIndexStart, role: 'editable' },
    { path: 'src/entities/user/model/session.ts', content: sessionStart, role: 'editable' },
    { path: 'src/features/profile-edit/index.ts', content: profileEditStart, role: 'editable' },
  ],
  solution: [
    ...roFiles,
    { path: 'src/entities/user/index.ts', content: userIndexSolution, role: 'editable' },
    { path: 'src/entities/user/model/session.ts', content: sessionSolution, role: 'editable' },
    {
      path: 'src/features/profile-edit/index.ts',
      content: profileEditSolution,
      role: 'editable',
    },
  ],
  checks: [noRuntimeCycles(), importsRespectLayers(), noDeepImport()],
}
