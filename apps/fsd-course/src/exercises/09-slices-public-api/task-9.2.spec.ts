import {
  importsRespectLayers,
  noDeepImport,
  fileContains,
  type FsdTaskSpec,
} from 'src/engine'

/**
 * Задание 9.2 (среднее) — Глубокие импорты.
 *
 * Слайс `entities/user` уже закрыт корректным public API (index.ts, только чтение).
 * Но виджет `widgets/user-panel` тянет внутренности сущности напрямую —
 * `@/entities/user/ui/UserCard`, `@/entities/user/model/types`. Задача: переключить
 * импорты виджета на public API слайса и убрать глубокие пути.
 */

const userTypes = `export interface User {
  id: string
  name: string
  email: string
}
`

const userCard = `import type { User } from '../model/types'

export function UserCard({ user }: { user: User }) {
  return (
    <div className="user-card">
      <strong>{user.name}</strong>
      <span>{user.email}</span>
    </div>
  )
}
`

// Корректный public API — уже готов, трогать не нужно.
const userIndex = `export type { User } from './model/types'
export { UserCard } from './ui/UserCard'
`

// НАРУШЕНИЕ: виджет лезет во внутренние сегменты сущности.
const panelStart = `import { UserCard } from '@/entities/user/ui/UserCard'
import type { User } from '@/entities/user/model/types'

const demoUser: User = {
  id: '1',
  name: 'Ада',
  email: 'ada@example.com',
}

export function UserPanel() {
  return (
    <section className="user-panel">
      <h3>Профиль</h3>
      <UserCard user={demoUser} />
    </section>
  )
}
`

// Эталон: импорт только через public API сущности.
const panelSolution = `import { UserCard, type User } from '@/entities/user'

const demoUser: User = {
  id: '1',
  name: 'Ада',
  email: 'ada@example.com',
}

export function UserPanel() {
  return (
    <section className="user-panel">
      <h3>Профиль</h3>
      <UserCard user={demoUser} />
    </section>
  )
}
`

export const spec: FsdTaskSpec = {
  id: '9.2',
  title: 'Задание 9.2 — Глубокие импорты (среднее)',
  aliases: { '@': 'src' },
  files: [
    { path: 'src/entities/user/model/types.ts', content: userTypes, role: 'readonly' },
    { path: 'src/entities/user/ui/UserCard.tsx', content: userCard, role: 'readonly' },
    { path: 'src/entities/user/index.ts', content: userIndex, role: 'readonly' },
    { path: 'src/widgets/user-panel/ui/UserPanel.tsx', content: panelStart, role: 'editable' },
  ],
  solution: [
    { path: 'src/entities/user/model/types.ts', content: userTypes, role: 'readonly' },
    { path: 'src/entities/user/ui/UserCard.tsx', content: userCard, role: 'readonly' },
    { path: 'src/entities/user/index.ts', content: userIndex, role: 'readonly' },
    { path: 'src/widgets/user-panel/ui/UserPanel.tsx', content: panelSolution, role: 'editable' },
  ],
  checks: [
    noDeepImport(),
    importsRespectLayers(),
    fileContains(
      'src/widgets/user-panel/ui/UserPanel.tsx',
      /from\s*'@\/entities\/user'/,
      'Импорт идёт через public API `@/entities/user`'
    ),
  ],
}
