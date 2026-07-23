import {
  exportsFromPublicApi,
  fileExists,
  type FsdTaskSpec,
} from 'src/engine'

/**
 * Задание 9.1 (простое) — Public API слайса.
 *
 * Дано: слайс `entities/user` с сегментами model/ и ui/, но без публичного API.
 * Задача: описать `index.ts`, реэкспортировав наружу тип `User` и компонент
 * `UserCard`. Это самая базовая операция FSD — «закрыть слайс входной дверью».
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

const indexStart = `// Public API слайса entities/user.
// TODO: реэкспортируйте наружу тип User и компонент UserCard,
// чтобы внешний код не лез во внутренние сегменты слайса.
`

const indexSolution = `export type { User } from './model/types'
export { UserCard } from './ui/UserCard'
`

export const spec: FsdTaskSpec = {
  id: '9.1',
  title: 'Задание 9.1 — Public API слайса (простое)',
  aliases: { '@': 'src' },
  files: [
    { path: 'src/entities/user/model/types.ts', content: userTypes, role: 'readonly' },
    { path: 'src/entities/user/ui/UserCard.tsx', content: userCard, role: 'readonly' },
    { path: 'src/entities/user/index.ts', content: indexStart, role: 'editable' },
  ],
  solution: [
    { path: 'src/entities/user/model/types.ts', content: userTypes, role: 'readonly' },
    { path: 'src/entities/user/ui/UserCard.tsx', content: userCard, role: 'readonly' },
    { path: 'src/entities/user/index.ts', content: indexSolution, role: 'editable' },
  ],
  checks: [
    fileExists('src/entities/user/index.ts'),
    exportsFromPublicApi('src/entities/user/index.ts', 'User', './model/types'),
    exportsFromPublicApi('src/entities/user/index.ts', 'UserCard', './ui/UserCard'),
  ],
}
