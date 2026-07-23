import {
  exportsFromPublicApi,
  fileContains,
  importsRespectLayers,
  noDeepImport,
  type FsdTaskSpec,
} from 'src/engine'

/**
 * Задание 14.2 (среднее) — Выделяем сущность из legacy.
 *
 * Тип `User` живёт в `src/utils/userHelpers.ts`, а компонент отображения —
 * в `src/components/UserBadge.tsx`. Это бизнес-сущность, которой не место
 * в общей папке утилит. Задача: собрать полноценный слайс `entities/user`
 * (model + ui + public API) и переключить виджет-потребитель на него.
 */

// Legacy-источники — образцы, откуда переносим код.
const legacyUserHelpers = `export interface User {
  id: string
  name: string
  email: string
}
`

const legacyUserBadge = `import type { User } from '../utils/userHelpers'

export function UserBadge({ user }: { user: User }) {
  return <span className="legacy-user-badge">{user.name}</span>
}
`

// Целевые файлы сущности.
const modelStart = `// TODO: перенесите сюда интерфейс User из 'src/utils/userHelpers.ts'.
`
const modelSolution = `export interface User {
  id: string
  name: string
  email: string
}
`

const uiStart = `// TODO: перенесите сюда компонент UserBadge из 'src/components/UserBadge.tsx'.
// Используйте тип User из '../model/types'.
`
const uiSolution = `import type { User } from '../model/types'

export function UserBadge({ user }: { user: User }) {
  return <span className="user-badge">{user.name}</span>
}
`

const indexStart = `// Public API слайса entities/user.
// TODO: реэкспортируйте User и UserBadge.
`
const indexSolution = `export type { User } from './model/types'
export { UserBadge } from './ui/UserBadge'
`

// Потребитель — виджет, сейчас тянущий legacy-код напрямую.
const consumerStart = `import type { User } from '@/utils/userHelpers'
import { UserBadge } from '@/components/UserBadge'

const demoUser: User = { id: '1', name: 'Ада', email: 'ada@example.com' }

export function ProfileWidget() {
  return (
    <aside className="profile-widget">
      <UserBadge user={demoUser} />
    </aside>
  )
}
`

const consumerSolution = `import { UserBadge, type User } from '@/entities/user'

const demoUser: User = { id: '1', name: 'Ада', email: 'ada@example.com' }

export function ProfileWidget() {
  return (
    <aside className="profile-widget">
      <UserBadge user={demoUser} />
    </aside>
  )
}
`

export const spec: FsdTaskSpec = {
  id: '14.2',
  title: 'Задание 14.2 — Выделяем сущность из legacy (среднее)',
  aliases: { '@': 'src' },
  files: [
    { path: 'src/utils/userHelpers.ts', content: legacyUserHelpers, role: 'readonly' },
    { path: 'src/components/UserBadge.tsx', content: legacyUserBadge, role: 'readonly' },
    { path: 'src/entities/user/model/types.ts', content: modelStart, role: 'editable' },
    { path: 'src/entities/user/ui/UserBadge.tsx', content: uiStart, role: 'editable' },
    { path: 'src/entities/user/index.ts', content: indexStart, role: 'editable' },
    { path: 'src/widgets/profile/ui/ProfileWidget.tsx', content: consumerStart, role: 'editable' },
  ],
  solution: [
    { path: 'src/utils/userHelpers.ts', content: legacyUserHelpers, role: 'readonly' },
    { path: 'src/components/UserBadge.tsx', content: legacyUserBadge, role: 'readonly' },
    { path: 'src/entities/user/model/types.ts', content: modelSolution, role: 'editable' },
    { path: 'src/entities/user/ui/UserBadge.tsx', content: uiSolution, role: 'editable' },
    { path: 'src/entities/user/index.ts', content: indexSolution, role: 'editable' },
    { path: 'src/widgets/profile/ui/ProfileWidget.tsx', content: consumerSolution, role: 'editable' },
  ],
  checks: [
    importsRespectLayers(),
    noDeepImport(),
    fileContains(
      'src/entities/user/model/types.ts',
      /interface User/,
      '`entities/user/model/types.ts` содержит интерфейс User'
    ),
    fileContains(
      'src/entities/user/ui/UserBadge.tsx',
      /export function UserBadge/,
      '`entities/user/ui/UserBadge.tsx` содержит перенесённый компонент'
    ),
    exportsFromPublicApi('src/entities/user/index.ts', 'User', './model/types'),
    exportsFromPublicApi('src/entities/user/index.ts', 'UserBadge', './ui/UserBadge'),
    fileContains(
      'src/widgets/profile/ui/ProfileWidget.tsx',
      /from\s*'@\/entities\/user'/,
      'ProfileWidget импортирует User и UserBadge из public API `@/entities/user`'
    ),
  ],
}
