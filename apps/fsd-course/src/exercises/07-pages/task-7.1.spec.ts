import {
  exportsFromPublicApi,
  fileExists,
  importsRespectLayers,
  type FsdTaskSpec,
} from 'src/engine'

/**
 * Задание 7.1 (простое) — Страница как композиция.
 *
 * `pages/profile` уже правильно собирает виджет `widgets/header` и сущность
 * `entities/user` через их public API — сама страница просто их компонует.
 * Не хватает последнего шага: у самой страницы нет своей «входной двери».
 * Задача: закрыть `index.ts` страницы, реэкспортировав `ProfilePage`.
 */

const userTypes = `export interface User {
  id: string
  name: string
}
`

const userCard = `import type { User } from '../model/types'

export function UserCard({ user }: { user: User }) {
  return <div className="user-card">{user.name}</div>
}
`

const userIndex = `export type { User } from './model/types'
export { UserCard } from './ui/UserCard'
`

const header = `export function Header() {
  return (
    <header className="header">
      <strong>Мой магазин</strong>
    </header>
  )
}
`

const headerIndex = `export { Header } from './ui/Header'
`

const profilePage = `import { Header } from '@/widgets/header'
import { UserCard, type User } from '@/entities/user'

const demoUser: User = {
  id: '1',
  name: 'Ада',
}

export function ProfilePage() {
  return (
    <div className="profile-page">
      <Header />
      <UserCard user={demoUser} />
    </div>
  )
}
`

const pageIndexStart = `// Public API страницы pages/profile.
// TODO: реэкспортируйте ProfilePage, чтобы роутер мог подключить страницу.
`

const pageIndexSolution = `export { ProfilePage } from './ui/ProfilePage'
`

const roFiles = [
  { path: 'src/entities/user/model/types.ts', content: userTypes, role: 'readonly' as const },
  { path: 'src/entities/user/ui/UserCard.tsx', content: userCard, role: 'readonly' as const },
  { path: 'src/entities/user/index.ts', content: userIndex, role: 'readonly' as const },
  { path: 'src/widgets/header/ui/Header.tsx', content: header, role: 'readonly' as const },
  { path: 'src/widgets/header/index.ts', content: headerIndex, role: 'readonly' as const },
  { path: 'src/pages/profile/ui/ProfilePage.tsx', content: profilePage, role: 'readonly' as const },
]

export const spec: FsdTaskSpec = {
  id: '7.1',
  title: 'Задание 7.1 — Страница как композиция (простое)',
  aliases: { '@': 'src' },
  files: [
    ...roFiles,
    { path: 'src/pages/profile/index.ts', content: pageIndexStart, role: 'editable' },
  ],
  solution: [
    ...roFiles,
    { path: 'src/pages/profile/index.ts', content: pageIndexSolution, role: 'editable' },
  ],
  checks: [
    fileExists('src/pages/profile/index.ts'),
    exportsFromPublicApi('src/pages/profile/index.ts', 'ProfilePage', './ui/ProfilePage'),
    importsRespectLayers(),
  ],
}
