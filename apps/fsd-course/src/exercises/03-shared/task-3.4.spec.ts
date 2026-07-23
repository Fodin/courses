import {
  exportsFromPublicApi,
  fileContains,
  fileExists,
  noDeepImport,
  type FsdTaskSpec,
} from 'src/engine'

/**
 * Задание 3.4 (простое) — Бизнес-сущность не место в shared.
 *
 * Тип `User` по ошибке живёт в `shared/user/model/types.ts` — но это доменная
 * сущность («что это» — пользователь со своими полями), а не переиспользуемый
 * примитив без бизнес-смысла. Задача: определить `User` в `entities/user`, собрать
 * ему public API и переключить потребителя на `@/entities/user`.
 *
 * Файл `shared/user/model/types.ts` оставлен только для чтения — как «было» для
 * сверки; в реальном проекте его бы удалили, здесь он просто больше никому не нужен.
 */

const legacySharedUserTypes = `// Так сделали по ошибке: бизнес-сущность засунули в shared.
export interface User {
  id: string
  name: string
  email: string
}
`

const entitiesUserTypesStart = `// TODO: определите здесь тип User с полями id, name, email —
// такими же, как в src/shared/user/model/types.ts (файл только для сверки).
`
const entitiesUserTypesSolution = `export interface User {
  id: string
  name: string
  email: string
}
`

const entitiesUserIndexStart = `// Public API сущности entities/user.
// TODO: реэкспортируйте наружу тип User.
`
const entitiesUserIndexSolution = `export type { User } from './model/types'
`

// НАРУШЕНИЕ: виджет тянет бизнес-тип из shared.
const profileHeaderStart = `import type { User } from '@/shared/user/model/types'

export function ProfileHeader({ user }: { user: User }) {
  return <h2>{user.name}</h2>
}
`

const profileHeaderSolution = `import type { User } from '@/entities/user'

export function ProfileHeader({ user }: { user: User }) {
  return <h2>{user.name}</h2>
}
`

export const spec: FsdTaskSpec = {
  id: '3.4',
  title: 'Задание 3.4 — Бизнес-сущность не место в shared (простое)',
  aliases: { '@': 'src' },
  files: [
    { path: 'src/shared/user/model/types.ts', content: legacySharedUserTypes, role: 'readonly' },
    { path: 'src/entities/user/model/types.ts', content: entitiesUserTypesStart, role: 'editable' },
    { path: 'src/entities/user/index.ts', content: entitiesUserIndexStart, role: 'editable' },
    {
      path: 'src/widgets/profile-header/ui/ProfileHeader.tsx',
      content: profileHeaderStart,
      role: 'editable',
    },
  ],
  solution: [
    { path: 'src/shared/user/model/types.ts', content: legacySharedUserTypes, role: 'readonly' },
    {
      path: 'src/entities/user/model/types.ts',
      content: entitiesUserTypesSolution,
      role: 'editable',
    },
    { path: 'src/entities/user/index.ts', content: entitiesUserIndexSolution, role: 'editable' },
    {
      path: 'src/widgets/profile-header/ui/ProfileHeader.tsx',
      content: profileHeaderSolution,
      role: 'editable',
    },
  ],
  checks: [
    fileExists('src/entities/user/index.ts'),
    exportsFromPublicApi('src/entities/user/index.ts', 'User', './model/types'),
    noDeepImport(),
    fileContains(
      'src/widgets/profile-header/ui/ProfileHeader.tsx',
      /from\s*'@\/entities\/user'/,
      'Потребитель импортирует User из entities, а не из shared'
    ),
  ],
}
