import {
  exportsFromPublicApi,
  importsRespectLayers,
  noDeepImport,
  type FsdTaskSpec,
} from 'src/engine'

/**
 * Задание 9.3 (сложное) — Полный public API из нескольких сегментов.
 *
 * Слайс `entities/user` разросся: тип, стор, две ui-части и внутренний хелпер.
 * Виджет `widgets/profile` тянет их всех глубокими импортами. Задача: собрать
 * полноценный public API (наружу — `User`, `userStore`, `UserCard`, `UserAvatar`;
 * внутренний `formatName` не публикуем) и перевести виджет на него.
 */

const types = `export interface User {
  id: string
  name: string
}
`

const store = `import type { User } from './types'

export const userStore = {
  current: null as User | null,
}
`

const formatName = `// Внутренний хелпер слайса — НЕ часть public API.
export function formatName(name: string) {
  return name.trim()
}
`

const userCard = `import type { User } from '../model/types'
import { formatName } from '../lib/formatName'

export function UserCard({ user }: { user: User }) {
  return <div className="user-card">{formatName(user.name)}</div>
}
`

const userAvatar = `import type { User } from '../model/types'

export function UserAvatar({ user }: { user: User }) {
  return <div className="user-avatar">{user.name[0]}</div>
}
`

const indexStart = `// Public API слайса entities/user.
// TODO: реэкспортируйте наружу то, что нужно потребителям:
//   тип User, userStore, UserCard, UserAvatar.
// Внутренний formatName наружу не выносим.
`

const indexSolution = `export type { User } from './model/types'
export { userStore } from './model/store'
export { UserCard } from './ui/UserCard'
export { UserAvatar } from './ui/UserAvatar'
`

const profileStart = `import { UserCard } from '@/entities/user/ui/UserCard'
import { UserAvatar } from '@/entities/user/ui/UserAvatar'
import { userStore } from '@/entities/user/model/store'
import type { User } from '@/entities/user/model/types'

export function Profile() {
  const user = userStore.current as User
  return (
    <section className="profile">
      <UserAvatar user={user} />
      <UserCard user={user} />
    </section>
  )
}
`

const profileSolution = `import { UserCard, UserAvatar, userStore, type User } from '@/entities/user'

export function Profile() {
  const user = userStore.current as User
  return (
    <section className="profile">
      <UserAvatar user={user} />
      <UserCard user={user} />
    </section>
  )
}
`

const roFiles = [
  { path: 'src/entities/user/model/types.ts', content: types, role: 'readonly' as const },
  { path: 'src/entities/user/model/store.ts', content: store, role: 'readonly' as const },
  { path: 'src/entities/user/lib/formatName.ts', content: formatName, role: 'readonly' as const },
  { path: 'src/entities/user/ui/UserCard.tsx', content: userCard, role: 'readonly' as const },
  { path: 'src/entities/user/ui/UserAvatar.tsx', content: userAvatar, role: 'readonly' as const },
]

export const spec: FsdTaskSpec = {
  id: '9.3',
  title: 'Задание 9.3 — Полный public API (сложное)',
  aliases: { '@': 'src' },
  files: [
    ...roFiles,
    { path: 'src/entities/user/index.ts', content: indexStart, role: 'editable' },
    { path: 'src/widgets/profile/ui/Profile.tsx', content: profileStart, role: 'editable' },
  ],
  solution: [
    ...roFiles,
    { path: 'src/entities/user/index.ts', content: indexSolution, role: 'editable' },
    { path: 'src/widgets/profile/ui/Profile.tsx', content: profileSolution, role: 'editable' },
  ],
  checks: [
    exportsFromPublicApi('src/entities/user/index.ts', 'User', './model/types'),
    exportsFromPublicApi('src/entities/user/index.ts', 'userStore', './model/store'),
    exportsFromPublicApi('src/entities/user/index.ts', 'UserCard', './ui/UserCard'),
    exportsFromPublicApi('src/entities/user/index.ts', 'UserAvatar', './ui/UserAvatar'),
    noDeepImport(),
    importsRespectLayers(),
  ],
}
