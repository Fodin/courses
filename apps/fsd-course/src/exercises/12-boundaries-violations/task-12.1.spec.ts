import {
  exportsFromPublicApi,
  fileContains,
  importsRespectLayers,
  type FsdTaskSpec,
} from 'src/engine'

/**
 * Задание 12.1 (простое) — Импорт вверх по слоям.
 *
 * Сущность `entities/user` импортирует тип из `pages/profile` — а это вышестоящий
 * слой (`pages` выше `entities`). Задача: убрать зависимость от страницы, объявив
 * нужный тип прямо в сущности.
 */

const profileTypes = `export type ProfileTheme = 'light' | 'dark'
`

// НАРУШЕНИЕ: entities импортирует из pages — это импорт «вверх» по слоям.
const userTypesStart = `import type { ProfileTheme } from '@/pages/profile/model/types'

export interface User {
  id: string
  name: string
  theme: ProfileTheme
}
`

const userTypesSolution = `export interface User {
  id: string
  name: string
  theme: 'light' | 'dark'
}
`

const userIndex = `export type { User } from './model/types'
`

const roFiles = [
  { path: 'src/pages/profile/model/types.ts', content: profileTypes, role: 'readonly' as const },
  { path: 'src/entities/user/index.ts', content: userIndex, role: 'readonly' as const },
]

export const spec: FsdTaskSpec = {
  id: '12.1',
  title: 'Задание 12.1 — Импорт вверх по слоям (простое)',
  aliases: { '@': 'src' },
  files: [
    ...roFiles,
    { path: 'src/entities/user/model/types.ts', content: userTypesStart, role: 'editable' },
  ],
  solution: [
    ...roFiles,
    { path: 'src/entities/user/model/types.ts', content: userTypesSolution, role: 'editable' },
  ],
  checks: [
    importsRespectLayers(),
    exportsFromPublicApi('src/entities/user/index.ts', 'User', './model/types'),
    fileContains(
      'src/entities/user/model/types.ts',
      /theme\s*:\s*'light'\s*\|\s*'dark'/,
      'User хранит тему как собственный union-тип, а не тип из pages/profile'
    ),
  ],
}
