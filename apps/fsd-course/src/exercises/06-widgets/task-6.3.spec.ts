import { exportsFromPublicApi, importsRespectLayers, noDeepImport, type FsdTaskSpec } from 'src/engine'

/**
 * Задание 6.3 (сложное) — Полный public API сложного виджета.
 *
 * `widgets/sidebar` собирает сразу три соседа: `entities/user`, `features/search`,
 * `features/logout`. `ui/Sidebar.tsx` лезет во все три глубокими импортами, а у
 * самого виджета нет `index.ts`. Задача: навести порядок сразу в двух местах —
 * перевести все импорты `ui/Sidebar.tsx` на public API соседей и собрать полный
 * public API самого виджета (наружу нужен только `Sidebar`).
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

const searchBox = `export function SearchBox() {
  return <input className="search-box" placeholder="Поиск" />
}
`
const searchIndex = `export { SearchBox } from './ui/SearchBox'
`

const logoutButton = `export function LogoutButton() {
  return <button className="logout-button">Выйти</button>
}
`
const logoutIndex = `export { LogoutButton } from './ui/LogoutButton'
`

// НАРУШЕНИЕ: виджет тянет все три соседа глубокими импортами.
const sidebarStart = `import type { User } from '@/entities/user/model/types'
import { UserBadge } from '@/entities/user/ui/UserBadge'
import { SearchBox } from '@/features/search/ui/SearchBox'
import { LogoutButton } from '@/features/logout/ui/LogoutButton'

export function Sidebar({ user }: { user: User }) {
  return (
    <aside className="sidebar">
      <SearchBox />
      <UserBadge user={user} />
      <LogoutButton />
    </aside>
  )
}
`

const sidebarSolution = `import { UserBadge, type User } from '@/entities/user'
import { SearchBox } from '@/features/search'
import { LogoutButton } from '@/features/logout'

export function Sidebar({ user }: { user: User }) {
  return (
    <aside className="sidebar">
      <SearchBox />
      <UserBadge user={user} />
      <LogoutButton />
    </aside>
  )
}
`

const sidebarIndexStart = `// Public API виджета widgets/sidebar.
// TODO: соберите публичный интерфейс — наружу нужен компонент Sidebar,
// внутренние сегменты не публикуем.
`

const sidebarIndexSolution = `export { Sidebar } from './ui/Sidebar'
`

const roFiles = [
  { path: 'src/entities/user/model/types.ts', content: userTypes, role: 'readonly' as const },
  { path: 'src/entities/user/ui/UserBadge.tsx', content: userBadge, role: 'readonly' as const },
  { path: 'src/entities/user/index.ts', content: userIndex, role: 'readonly' as const },
  { path: 'src/features/search/ui/SearchBox.tsx', content: searchBox, role: 'readonly' as const },
  { path: 'src/features/search/index.ts', content: searchIndex, role: 'readonly' as const },
  { path: 'src/features/logout/ui/LogoutButton.tsx', content: logoutButton, role: 'readonly' as const },
  { path: 'src/features/logout/index.ts', content: logoutIndex, role: 'readonly' as const },
]

export const spec: FsdTaskSpec = {
  id: '6.3',
  title: 'Задание 6.3 — Полный public API сложного виджета (сложное)',
  aliases: { '@': 'src' },
  files: [
    ...roFiles,
    { path: 'src/widgets/sidebar/ui/Sidebar.tsx', content: sidebarStart, role: 'editable' },
    { path: 'src/widgets/sidebar/index.ts', content: sidebarIndexStart, role: 'editable' },
  ],
  solution: [
    ...roFiles,
    { path: 'src/widgets/sidebar/ui/Sidebar.tsx', content: sidebarSolution, role: 'editable' },
    { path: 'src/widgets/sidebar/index.ts', content: sidebarIndexSolution, role: 'editable' },
  ],
  checks: [
    exportsFromPublicApi('src/widgets/sidebar/index.ts', 'Sidebar', './ui/Sidebar'),
    noDeepImport(),
    importsRespectLayers(),
  ],
}
