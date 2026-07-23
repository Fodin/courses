import {
  exportsFromPublicApi,
  fileContains,
  importsRespectLayers,
  noDeepImport,
  type FsdTaskSpec,
} from 'src/engine'

/**
 * Задание 3.6 (сложное) — Разбираем «свалку» на честный shared и сущность.
 *
 * Все нужные файлы уже реализованы и лежат в правильных местах: генеричный
 * примитив `capitalize` — в `shared/lib`, доменные `User` и `formatUserLabel` — в
 * `entities/user`. Но ни у одного сегмента/слайса нет public API, а виджет
 * `widgets/user-badge` тянет всё глубокими импортами. Задача: закрыть оба входа
 * (`shared/lib/index.ts` и `entities/user/index.ts`) и переключить виджет на них —
 * так, чтобы генерик и домен остались раздельными зонами ответственности, каждая
 * со своей понятной дверью.
 */

const capitalizeTs = `export function capitalize(value: string): string {
  return value.length === 0 ? value : value[0].toUpperCase() + value.slice(1)
}
`

const userTypes = `export interface User {
  id: string
  name: string
  role: 'admin' | 'member'
}
`

const formatUserLabelTs = `import { capitalize } from '@/shared/lib'
import type { User } from '../model/types'

export function formatUserLabel(user: User): string {
  const name = capitalize(user.name)
  return user.role === 'admin' ? \`Admin — \${name}\` : name
}
`

const libIndexStart = `// Public API сегмента shared/lib.
// TODO: реэкспортируйте capitalize — генеричный примитив без бизнес-смысла.
`
const libIndexSolution = `export { capitalize } from './capitalize'
`

const entitiesUserIndexStart = `// Public API сущности entities/user.
// TODO: реэкспортируйте User и formatUserLabel — доменную часть.
`
const entitiesUserIndexSolution = `export type { User } from './model/types'
export { formatUserLabel } from './lib/formatUserLabel'
`

// НАРУШЕНИЕ: виджет тянет и generic, и доменный код глубокими импортами напрямую.
const userBadgeStart = `import { formatUserLabel } from '@/entities/user/lib/formatUserLabel'
import type { User } from '@/entities/user/model/types'

export function UserBadge({ user }: { user: User }) {
  return <span className="user-badge">{formatUserLabel(user)}</span>
}
`

const userBadgeSolution = `import { formatUserLabel, type User } from '@/entities/user'

export function UserBadge({ user }: { user: User }) {
  return <span className="user-badge">{formatUserLabel(user)}</span>
}
`

const roFiles = [
  { path: 'src/shared/lib/capitalize.ts', content: capitalizeTs, role: 'readonly' as const },
  { path: 'src/entities/user/model/types.ts', content: userTypes, role: 'readonly' as const },
  {
    path: 'src/entities/user/lib/formatUserLabel.ts',
    content: formatUserLabelTs,
    role: 'readonly' as const,
  },
]

export const spec: FsdTaskSpec = {
  id: '3.6',
  title: 'Задание 3.6 — Разбираем «свалку» на shared и сущность (сложное)',
  aliases: { '@': 'src' },
  files: [
    ...roFiles,
    { path: 'src/shared/lib/index.ts', content: libIndexStart, role: 'editable' },
    { path: 'src/entities/user/index.ts', content: entitiesUserIndexStart, role: 'editable' },
    { path: 'src/widgets/user-badge/ui/UserBadge.tsx', content: userBadgeStart, role: 'editable' },
  ],
  solution: [
    ...roFiles,
    { path: 'src/shared/lib/index.ts', content: libIndexSolution, role: 'editable' },
    { path: 'src/entities/user/index.ts', content: entitiesUserIndexSolution, role: 'editable' },
    {
      path: 'src/widgets/user-badge/ui/UserBadge.tsx',
      content: userBadgeSolution,
      role: 'editable',
    },
  ],
  checks: [
    exportsFromPublicApi('src/shared/lib/index.ts', 'capitalize', './capitalize'),
    exportsFromPublicApi('src/entities/user/index.ts', 'User', './model/types'),
    exportsFromPublicApi('src/entities/user/index.ts', 'formatUserLabel', './lib/formatUserLabel'),
    noDeepImport(),
    importsRespectLayers(),
    fileContains(
      'src/widgets/user-badge/ui/UserBadge.tsx',
      /from\s*'@\/entities\/user'/,
      'Виджет подключён через public API entities/user, без глубоких импортов'
    ),
  ],
}
