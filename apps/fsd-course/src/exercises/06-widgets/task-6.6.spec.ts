import { fileContains, importsRespectLayers, noDeepImport, type FsdTaskSpec } from 'src/engine'

/**
 * Задание 6.6 (сложное) — Двойное нарушение изоляции и композиция на странице.
 *
 * `widgets/header` одновременно импортирует вверх (`pages/dashboard`) и вбок,
 * cross-import соседнего виджета (`widgets/sidebar`) — он рендерит заголовок
 * страницы и сайдбар прямо внутри себя. Задача: очистить `Header` до его
 * собственной ответственности (только `entities/user`), а сборку `PageTitle` +
 * `Sidebar` + `Header` вместе поднять на уровень страницы — `pages/dashboard`,
 * единственный слой, которому разрешено знать про все три сразу.
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

const sidebarUi = `export function Sidebar() {
  return <aside className="sidebar">Меню</aside>
}
`
const sidebarIndex = `export { Sidebar } from './ui/Sidebar'
`

const headerIndex = `export { Header } from './ui/Header'
`

const pageTitle = `export function PageTitle() {
  return <h1 className="page-title">Дашборд</h1>
}
`

// НАРУШЕНИЕ: Header лезет и вверх (pages/dashboard), и вбок (widgets/sidebar).
const headerStart = `import { UserBadge, type User } from '@/entities/user'
import { Sidebar } from '@/widgets/sidebar'
import { PageTitle } from '@/pages/dashboard'

export function Header({ user }: { user: User }) {
  return (
    <header className="header">
      <PageTitle />
      <Sidebar />
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

// Страница пока не собирает виджеты вместе — только свой заголовок.
const dashboardPageStart = `import { PageTitle } from './PageTitle'

export function DashboardPage() {
  return (
    <div className="dashboard-page">
      <PageTitle />
    </div>
  )
}
`

const dashboardPageSolution = `import { Header } from '@/widgets/header'
import { Sidebar } from '@/widgets/sidebar'

import { PageTitle } from './PageTitle'

export function DashboardPage() {
  return (
    <div className="dashboard-page">
      <PageTitle />
      <Header user={{ id: '1', name: 'Ада' }} />
      <Sidebar />
    </div>
  )
}
`

const roFiles = [
  { path: 'src/entities/user/model/types.ts', content: userTypes, role: 'readonly' as const },
  { path: 'src/entities/user/ui/UserBadge.tsx', content: userBadge, role: 'readonly' as const },
  { path: 'src/entities/user/index.ts', content: userIndex, role: 'readonly' as const },
  { path: 'src/widgets/sidebar/ui/Sidebar.tsx', content: sidebarUi, role: 'readonly' as const },
  { path: 'src/widgets/sidebar/index.ts', content: sidebarIndex, role: 'readonly' as const },
  { path: 'src/widgets/header/index.ts', content: headerIndex, role: 'readonly' as const },
  { path: 'src/pages/dashboard/ui/PageTitle.tsx', content: pageTitle, role: 'readonly' as const },
]

export const spec: FsdTaskSpec = {
  id: '6.6',
  title: 'Задание 6.6 — Двойное нарушение изоляции виджета (сложное)',
  aliases: { '@': 'src' },
  files: [
    ...roFiles,
    { path: 'src/widgets/header/ui/Header.tsx', content: headerStart, role: 'editable' },
    { path: 'src/pages/dashboard/ui/DashboardPage.tsx', content: dashboardPageStart, role: 'editable' },
  ],
  solution: [
    ...roFiles,
    { path: 'src/widgets/header/ui/Header.tsx', content: headerSolution, role: 'editable' },
    { path: 'src/pages/dashboard/ui/DashboardPage.tsx', content: dashboardPageSolution, role: 'editable' },
  ],
  checks: [
    importsRespectLayers(),
    noDeepImport(),
    fileContains(
      'src/pages/dashboard/ui/DashboardPage.tsx',
      /from\s*'@\/widgets\/header'/,
      'Страница подключает Header через public API `@/widgets/header`'
    ),
    fileContains(
      'src/pages/dashboard/ui/DashboardPage.tsx',
      /from\s*'@\/widgets\/sidebar'/,
      'Страница подключает Sidebar через public API `@/widgets/sidebar`'
    ),
  ],
}
