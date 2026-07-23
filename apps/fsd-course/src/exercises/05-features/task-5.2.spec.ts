import {
  exportsFromPublicApi,
  fileContains,
  importsRespectLayers,
  noDeepImport,
  type FsdTaskSpec,
} from 'src/engine'

/**
 * Задание 5.2 (среднее) — Фича собирает сущность и shared, потребитель подключается
 * через public API.
 *
 * `features/login` использует `entities/user` (кому мы логинимся) и `shared/api`
 * (как ходим на бэкенд). Плюс есть потребитель — `widgets/header`, который
 * вызывает `login`. Все три связи сейчас идут в обход public API. Задача:
 * поправить импорты фичи, собрать её index.ts и переключить потребителя на
 * public API фичи.
 */

const userTypes = `export interface User {
  id: string
  name: string
}
`
const userIndex = `export type { User } from './model/types'
`

const httpRequest = `export function request<T>(url: string, body: unknown): Promise<T> {
  return fetch(url, { method: 'POST', body: JSON.stringify(body) }).then(r => r.json())
}
`
const apiIndex = `export { request } from './http'
`

// НАРУШЕНИЕ: фича лезет вглубь entities/user и shared/api мимо их index.ts.
const loginStart = `import type { User } from '@/entities/user/model/types'
import { request } from '@/shared/api/http'

export function login(email: string, password: string): Promise<User> {
  return request<User>('/api/login', { email, password })
}
`

const loginSolution = `import type { User } from '@/entities/user'
import { request } from '@/shared/api'

export function login(email: string, password: string): Promise<User> {
  return request<User>('/api/login', { email, password })
}
`

// НАРУШЕНИЕ: у фичи нет public API.
const featureIndexStart = `// Public API фичи features/login.
// TODO: реэкспортируйте login из ./model/login.
`
const featureIndexSolution = `export { login } from './model/login'
`

// НАРУШЕНИЕ: виджет-потребитель тянет фичу глубоким импортом, минуя её index.ts.
const headerStart = `import { login } from '@/features/login/model/login'

export function Header() {
  return (
    <header>
      <button onClick={() => login('ada@example.com', 'secret')}>Войти</button>
    </header>
  )
}
`
const headerSolution = `import { login } from '@/features/login'

export function Header() {
  return (
    <header>
      <button onClick={() => login('ada@example.com', 'secret')}>Войти</button>
    </header>
  )
}
`

const roFiles = [
  { path: 'src/entities/user/model/types.ts', content: userTypes, role: 'readonly' as const },
  { path: 'src/entities/user/index.ts', content: userIndex, role: 'readonly' as const },
  { path: 'src/shared/api/http.ts', content: httpRequest, role: 'readonly' as const },
  { path: 'src/shared/api/index.ts', content: apiIndex, role: 'readonly' as const },
]

export const spec: FsdTaskSpec = {
  id: '5.2',
  title: 'Задание 5.2 — Фича собирает сущность и shared (среднее)',
  aliases: { '@': 'src' },
  files: [
    ...roFiles,
    { path: 'src/features/login/model/login.ts', content: loginStart, role: 'editable' },
    { path: 'src/features/login/index.ts', content: featureIndexStart, role: 'editable' },
    { path: 'src/widgets/header/ui/Header.tsx', content: headerStart, role: 'editable' },
  ],
  solution: [
    ...roFiles,
    { path: 'src/features/login/model/login.ts', content: loginSolution, role: 'editable' },
    { path: 'src/features/login/index.ts', content: featureIndexSolution, role: 'editable' },
    { path: 'src/widgets/header/ui/Header.tsx', content: headerSolution, role: 'editable' },
  ],
  checks: [
    importsRespectLayers(),
    noDeepImport(),
    exportsFromPublicApi('src/features/login/index.ts', 'login', './model/login'),
    fileContains(
      'src/features/login/model/login.ts',
      /from\s*'@\/entities\/user'/,
      'login берёт User через public API entities/user, а не вглубь model/types'
    ),
    fileContains(
      'src/features/login/model/login.ts',
      /from\s*'@\/shared\/api'/,
      'login берёт request через public API shared/api, а не вглубь shared/api/http'
    ),
    fileContains(
      'src/widgets/header/ui/Header.tsx',
      /from\s*'@\/features\/login'/,
      'Header подключает фичу через её public API, а не вглубь model/login'
    ),
  ],
}
