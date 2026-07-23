import { importsRespectLayers, noDeepImport, type FsdTaskSpec } from 'src/engine'

/**
 * Задание 6.4 (простое) — Виджет не импортирует вверх.
 *
 * `widgets/header` тянет `PageTitle` из `pages/dashboard` — это импорт «вверх» по
 * слоям (`widgets` → `pages`), который переворачивает зависимость с ног на голову:
 * низкоуровневый виджет теперь знает про конкретную страницу и не может
 * переиспользоваться на других страницах. Задача: убрать этот импорт, оставив
 * виджету только то, что ему разрешено — `entities` и `shared`.
 */

const userTypes = `export interface User {
  id: string
  name: string
}
`
const userBadge = `import type { User } from '../model/types'

export function UserBadge({ user }: { user: User }) {
  return <span className="user-badge">{user.name}</span>
}
`
const userIndex = `export type { User } from './model/types'
export { UserBadge } from './ui/UserBadge'
`

const pageTitle = `export function PageTitle() {
  return <h1 className="page-title">Дашборд</h1>
}
`
const dashboardIndex = `export { PageTitle } from './ui/PageTitle'
`

// НАРУШЕНИЕ: виджет импортирует вверх — из pages/dashboard.
const headerStart = `import { UserBadge, type User } from '@/entities/user'
import { PageTitle } from '@/pages/dashboard'

export function Header({ user }: { user: User }) {
  return (
    <header className="header">
      <PageTitle />
      <UserBadge user={user} />
    </header>
  )
}
`

const headerSolution = `import { UserBadge, type User } from '@/entities/user'

export function Header({ user }: { user: User }) {
  return (
    <header className="header">
      <UserBadge user={user} />
    </header>
  )
}
`

const headerIndex = `export { Header } from './ui/Header'
`

const roFiles = [
  { path: 'src/entities/user/model/types.ts', content: userTypes, role: 'readonly' as const },
  { path: 'src/entities/user/ui/UserBadge.tsx', content: userBadge, role: 'readonly' as const },
  { path: 'src/entities/user/index.ts', content: userIndex, role: 'readonly' as const },
  { path: 'src/pages/dashboard/ui/PageTitle.tsx', content: pageTitle, role: 'readonly' as const },
  { path: 'src/pages/dashboard/index.ts', content: dashboardIndex, role: 'readonly' as const },
  { path: 'src/widgets/header/index.ts', content: headerIndex, role: 'readonly' as const },
]

export const spec: FsdTaskSpec = {
  id: '6.4',
  title: 'Задание 6.4 — Виджет не импортирует вверх (простое)',
  aliases: { '@': 'src' },
  files: [...roFiles, { path: 'src/widgets/header/ui/Header.tsx', content: headerStart, role: 'editable' }],
  solution: [
    ...roFiles,
    { path: 'src/widgets/header/ui/Header.tsx', content: headerSolution, role: 'editable' },
  ],
  checks: [importsRespectLayers(), noDeepImport()],
}
