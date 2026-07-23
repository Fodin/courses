import { fileContains, importsRespectLayers, type FsdTaskSpec } from 'src/engine'

/**
 * Задание 12.4 (простое) — Cross-import двух слайсов одного слоя.
 *
 * `features/auth` импортирует `features/profile` — даже через его public API это
 * запрещённая горизонтальная связь между слайсами одного слоя. Задача: убрать
 * зависимость, ведь форме логина не нужны данные профиля.
 */

const profileTypes = `export interface ProfileForm {
  name: string
}
`

const profileIndex = `export type { ProfileForm } from './model/types'
`

// НАРУШЕНИЕ: features/auth напрямую знает про соседний слайс features/profile.
const authTypesStart = `import type { ProfileForm } from '@/features/profile'

export interface LoginForm {
  email: string
  password: string
  profile: ProfileForm
}
`

const authTypesSolution = `export interface LoginForm {
  email: string
  password: string
}
`

const roFiles = [
  { path: 'src/features/profile/model/types.ts', content: profileTypes, role: 'readonly' as const },
  { path: 'src/features/profile/index.ts', content: profileIndex, role: 'readonly' as const },
]

export const spec: FsdTaskSpec = {
  id: '12.4',
  title: 'Задание 12.4 — Cross-import слайсов одного слоя (простое)',
  aliases: { '@': 'src' },
  files: [
    ...roFiles,
    { path: 'src/features/auth/model/types.ts', content: authTypesStart, role: 'editable' },
  ],
  solution: [
    ...roFiles,
    { path: 'src/features/auth/model/types.ts', content: authTypesSolution, role: 'editable' },
  ],
  checks: [
    importsRespectLayers(),
    fileContains(
      'src/features/auth/model/types.ts',
      /^(?:(?!features\/profile)[\s\S])*$/,
      'LoginForm больше не зависит от соседнего слайса features/profile'
    ),
    fileContains(
      'src/features/auth/model/types.ts',
      /email\s*:\s*string[\s\S]*password\s*:\s*string/,
      'LoginForm хранит только email и password'
    ),
  ],
}
