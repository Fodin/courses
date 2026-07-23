import {
  exportsFromPublicApi,
  fileContains,
  noDeepImport,
  type FsdTaskSpec,
} from 'src/engine'

/**
 * Задание 3.5 (среднее) — Отделяем общий примитив от доменной логики.
 *
 * `shared/lib` уже честно хранит только переиспользуемый примитив без бизнес-смысла
 * — `capitalize` (только чтение, готовый пример «как надо»). А форматирование
 * подписи пользователя (`formatUserLabel`) — это ДОМЕННАЯ логика: она знает про
 * бизнес-поле `role`. Ей место не в shared, а в `entities/user`. Задача: реализовать
 * `formatUserLabel` в `entities/user/lib`, использовать общий `capitalize` из
 * public API `shared/lib`, собрать public API сущности и переключить потребителя.
 */

const capitalizeTs = `export function capitalize(value: string): string {
  return value.length === 0 ? value : value[0].toUpperCase() + value.slice(1)
}
`
const libIndex = `export { capitalize } from './capitalize'
`

const userTypes = `export interface User {
  id: string
  name: string
  role: 'admin' | 'member'
}
`

const formatUserLabelStart = `// TODO: реализуйте formatUserLabel(user: User): string.
// Используйте общий capitalize из public API '@/shared/lib' (не копируйте его код!),
// а к имени добавьте роль пользователя — это уже бизнес-логика сущности:
//   "Admin — Ada" для role === 'admin', "Ada" для role === 'member'.
export function formatUserLabel(): string {
  return ''
}
`

const formatUserLabelSolution = `import { capitalize } from '@/shared/lib'
import type { User } from '../model/types'

export function formatUserLabel(user: User): string {
  const name = capitalize(user.name)
  return user.role === 'admin' ? \`Admin — \${name}\` : name
}
`

const entitiesUserIndexStart = `// Public API сущности entities/user.
// TODO: реэкспортируйте User и formatUserLabel.
`
const entitiesUserIndexSolution = `export type { User } from './model/types'
export { formatUserLabel } from './lib/formatUserLabel'
`

// НАРУШЕНИЕ: виджет тянет доменное форматирование глубоким импортом из entities.
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
  { path: 'src/shared/lib/index.ts', content: libIndex, role: 'readonly' as const },
  { path: 'src/entities/user/model/types.ts', content: userTypes, role: 'readonly' as const },
]

export const spec: FsdTaskSpec = {
  id: '3.5',
  title: 'Задание 3.5 — Отделяем примитив от доменной логики (среднее)',
  aliases: { '@': 'src' },
  files: [
    ...roFiles,
    {
      path: 'src/entities/user/lib/formatUserLabel.ts',
      content: formatUserLabelStart,
      role: 'editable',
    },
    { path: 'src/entities/user/index.ts', content: entitiesUserIndexStart, role: 'editable' },
    { path: 'src/widgets/user-badge/ui/UserBadge.tsx', content: userBadgeStart, role: 'editable' },
  ],
  solution: [
    ...roFiles,
    {
      path: 'src/entities/user/lib/formatUserLabel.ts',
      content: formatUserLabelSolution,
      role: 'editable',
    },
    { path: 'src/entities/user/index.ts', content: entitiesUserIndexSolution, role: 'editable' },
    {
      path: 'src/widgets/user-badge/ui/UserBadge.tsx',
      content: userBadgeSolution,
      role: 'editable',
    },
  ],
  checks: [
    exportsFromPublicApi('src/entities/user/index.ts', 'formatUserLabel', './lib/formatUserLabel'),
    fileContains(
      'src/entities/user/lib/formatUserLabel.ts',
      /from\s*'@\/shared\/lib'/,
      'formatUserLabel переиспользует общий capitalize из public API shared/lib'
    ),
    fileContains(
      'src/entities/user/lib/formatUserLabel.ts',
      /user\.role/,
      'formatUserLabel учитывает бизнес-поле role — эта логика доменная, не общая'
    ),
    noDeepImport(),
    fileContains(
      'src/widgets/user-badge/ui/UserBadge.tsx',
      /from\s*'@\/entities\/user'/,
      'Виджет берёт форматирование через public API сущности, а не глубоким импортом'
    ),
  ],
}
