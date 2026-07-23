import {
  exportsFromPublicApi,
  fileContains,
  fileExists,
  importsRespectLayers,
  noDeepImport,
  type FsdTaskSpec,
} from 'src/engine'

/**
 * Задание 7.4 (простое) — Логика вниз, а не в page.
 *
 * Сущность `entities/user` уже содержит готовую функцию `formatUserName` и
 * отдаёт её через public API (readonly, трогать не нужно). Но страница
 * `pages/profile` не знает об этом и держит собственную копию форматирования
 * прямо внутри себя. Задача: убрать локальную функцию и использовать готовую
 * из `@/entities/user`.
 */

const userTypes = `export interface User {
  id: string
  firstName: string
  lastName: string
}
`

const formatUserName = `import type { User } from '../model/types'

export function formatUserName(user: User) {
  return \`\${user.firstName} \${user.lastName}\`.trim()
}
`

const userIndex = `export type { User } from './model/types'
export { formatUserName } from './lib/formatUserName'
`

// НАРУШЕНИЕ: страница держит собственную копию доменной логики форматирования.
const profilePageStart = `import type { User } from '@/entities/user'

function formatUserName(user: User) {
  return \`\${user.firstName} \${user.lastName}\`.trim()
}

export function ProfilePage({ user }: { user: User }) {
  return <h1>{formatUserName(user)}</h1>
}
`

const profilePageSolution = `import { formatUserName, type User } from '@/entities/user'

export function ProfilePage({ user }: { user: User }) {
  return <h1>{formatUserName(user)}</h1>
}
`

const roFiles = [
  { path: 'src/entities/user/model/types.ts', content: userTypes, role: 'readonly' as const },
  {
    path: 'src/entities/user/lib/formatUserName.ts',
    content: formatUserName,
    role: 'readonly' as const,
  },
  { path: 'src/entities/user/index.ts', content: userIndex, role: 'readonly' as const },
]

export const spec: FsdTaskSpec = {
  id: '7.4',
  title: 'Задание 7.4 — Логика вниз, а не в page (простое)',
  aliases: { '@': 'src' },
  files: [
    ...roFiles,
    { path: 'src/pages/profile/ui/ProfilePage.tsx', content: profilePageStart, role: 'editable' },
  ],
  solution: [
    ...roFiles,
    {
      path: 'src/pages/profile/ui/ProfilePage.tsx',
      content: profilePageSolution,
      role: 'editable',
    },
  ],
  checks: [
    fileExists('src/entities/user/lib/formatUserName.ts'),
    exportsFromPublicApi('src/entities/user/index.ts', 'formatUserName', './lib/formatUserName'),
    fileContains(
      'src/pages/profile/ui/ProfilePage.tsx',
      /^(?:(?!function formatUserName).)*$/s,
      'В странице больше нет собственной функции formatUserName — логика живёт в entities/user'
    ),
    fileContains(
      'src/pages/profile/ui/ProfilePage.tsx',
      /from\s*'@\/entities\/user'/,
      'formatUserName импортируется из public API `@/entities/user`'
    ),
    importsRespectLayers(),
    noDeepImport(),
  ],
}
