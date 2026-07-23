import { fileContains, importsRespectLayers, type FsdTaskSpec } from 'src/engine'

/**
 * Задание 2.1 (простое) — Импорт вверх по слоям.
 *
 * `entities/user/model/permissions.ts` импортирует `isPremiumUser` из
 * `features/subscription` — сущность тянет функцию из вышестоящего слоя. Задача:
 * убрать импорт `features` и принимать признак `isPremium` параметром.
 */

const userTypes = `export interface User {
  id: string
  name: string
}
`

const userIndex = `export type { User } from './model/types'
export { canEditProfile } from './model/permissions'
`

// Существует для резолва импорта в стартовом файле — сама функция не редактируется.
const subscriptionIndex = `export function isPremiumUser(userId: string): boolean {
  return userId.length > 0
}
`

// НАРУШЕНИЕ: entities импортирует функцию из features (слой выше по стеку).
const permissionsStart = `import type { User } from './types'
import { isPremiumUser } from '@/features/subscription'

export function canEditProfile(user: User): boolean {
  return isPremiumUser(user.id)
}
`

const permissionsSolution = `import type { User } from './types'

export function canEditProfile(user: User, isPremium: boolean): boolean {
  return isPremium
}
`

const roFiles = [
  { path: 'src/entities/user/model/types.ts', content: userTypes, role: 'readonly' as const },
  { path: 'src/entities/user/index.ts', content: userIndex, role: 'readonly' as const },
  {
    path: 'src/features/subscription/index.ts',
    content: subscriptionIndex,
    role: 'readonly' as const,
  },
]

export const spec: FsdTaskSpec = {
  id: '2.1',
  title: 'Задание 2.1 — Импорт вверх по слоям (простое)',
  aliases: { '@': 'src' },
  files: [
    ...roFiles,
    { path: 'src/entities/user/model/permissions.ts', content: permissionsStart, role: 'editable' },
  ],
  solution: [
    ...roFiles,
    {
      path: 'src/entities/user/model/permissions.ts',
      content: permissionsSolution,
      role: 'editable',
    },
  ],
  checks: [
    importsRespectLayers(),
    fileContains(
      'src/entities/user/model/permissions.ts',
      /canEditProfile\(user: User, isPremium: boolean\)/,
      'canEditProfile принимает isPremium параметром, а не тянет его из features'
    ),
  ],
}
