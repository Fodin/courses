import { exportsFromPublicApi, fileExists, importsRespectLayers, noDeepImport, type FsdTaskSpec } from 'src/engine'

/**
 * Задание 6.1 (простое) — Виджет собирает public API.
 *
 * `widgets/header` уже правильно компонует `entities/user` и `shared/ui/Logo` —
 * `ui/Header.tsx` дан только для чтения и импортирует соседей корректно, через их
 * public API. Но у самого виджета нет входной двери: `index.ts` пуст. Задача: описать
 * public API виджета, реэкспортировав `Header`, чтобы страницы могли подключить
 * виджет одной строкой `import { Header } from '@/widgets/header'`.
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

const logo = `export function Logo() {
  return <span className="logo">Shop</span>
}
`

const header = `import { Logo } from '@/shared/ui/Logo'
import { UserBadge, type User } from '@/entities/user'

export function Header({ user }: { user: User }) {
  return (
    <header className="header">
      <Logo />
      <UserBadge user={user} />
    </header>
  )
}
`

const headerIndexStart = `// Public API виджета widgets/header.
// TODO: реэкспортируйте наружу компонент Header, чтобы страницы могли подключить
// виджет через '@/widgets/header', не заглядывая внутрь сегмента ui/.
`

const headerIndexSolution = `export { Header } from './ui/Header'
`

const roFiles = [
  { path: 'src/entities/user/model/types.ts', content: userTypes, role: 'readonly' as const },
  { path: 'src/entities/user/ui/UserBadge.tsx', content: userBadge, role: 'readonly' as const },
  { path: 'src/entities/user/index.ts', content: userIndex, role: 'readonly' as const },
  { path: 'src/shared/ui/Logo.tsx', content: logo, role: 'readonly' as const },
  { path: 'src/widgets/header/ui/Header.tsx', content: header, role: 'readonly' as const },
]

export const spec: FsdTaskSpec = {
  id: '6.1',
  title: 'Задание 6.1 — Виджет собирает public API (простое)',
  aliases: { '@': 'src' },
  files: [...roFiles, { path: 'src/widgets/header/index.ts', content: headerIndexStart, role: 'editable' }],
  solution: [
    ...roFiles,
    { path: 'src/widgets/header/index.ts', content: headerIndexSolution, role: 'editable' },
  ],
  checks: [
    fileExists('src/widgets/header/index.ts'),
    exportsFromPublicApi('src/widgets/header/index.ts', 'Header', './ui/Header'),
    importsRespectLayers(),
    noDeepImport(),
  ],
}
