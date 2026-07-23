import {
  exportsFromPublicApi,
  fileContains,
  importsRespectLayers,
  type FsdTaskSpec,
} from 'src/engine'

/**
 * Задание 5.5 (среднее) — Фича не тянет соседнюю фичу.
 *
 * `features/login` импортирует `validateEmail` прямо из `features/register` —
 * это cross-import двух слайсов одного слоя. Общая проверка почты — не секрет
 * ни одной из фич, это переиспользуемый примитив без бизнес-смысла, и он уже
 * лежит там, где ему место — в `shared/lib`. Задача: переключить `login` на
 * общую версию из `shared/lib` и собрать public API фичи.
 */

const registerValidate = `export function validateEmail(email: string): boolean {
  return email.includes('@')
}
`
const registerIndex = `export { validateEmail } from './model/validate'
`

const sharedValidateEmail = `export function validateEmail(email: string): boolean {
  return email.includes('@')
}
`
const sharedLibIndex = `export { validateEmail } from './validateEmail'
`

// НАРУШЕНИЕ: features/login тянет соседнюю фичу features/register.
const loginStart = `import { validateEmail } from '@/features/register'

export function login(email: string, password: string): boolean {
  return validateEmail(email) && password.length > 0
}
`

const loginSolution = `import { validateEmail } from '@/shared/lib'

export function login(email: string, password: string): boolean {
  return validateEmail(email) && password.length > 0
}
`

// НАРУШЕНИЕ: у фичи нет public API.
const featureIndexStart = `// Public API фичи features/login.
// TODO: реэкспортируйте login из ./model/login.
`
const featureIndexSolution = `export { login } from './model/login'
`

const roFiles = [
  {
    path: 'src/features/register/model/validate.ts',
    content: registerValidate,
    role: 'readonly' as const,
  },
  { path: 'src/features/register/index.ts', content: registerIndex, role: 'readonly' as const },
  {
    path: 'src/shared/lib/validateEmail.ts',
    content: sharedValidateEmail,
    role: 'readonly' as const,
  },
  { path: 'src/shared/lib/index.ts', content: sharedLibIndex, role: 'readonly' as const },
]

export const spec: FsdTaskSpec = {
  id: '5.5',
  title: 'Задание 5.5 — Фича не тянет соседнюю фичу (среднее)',
  aliases: { '@': 'src' },
  files: [
    ...roFiles,
    { path: 'src/features/login/model/login.ts', content: loginStart, role: 'editable' },
    { path: 'src/features/login/index.ts', content: featureIndexStart, role: 'editable' },
  ],
  solution: [
    ...roFiles,
    { path: 'src/features/login/model/login.ts', content: loginSolution, role: 'editable' },
    { path: 'src/features/login/index.ts', content: featureIndexSolution, role: 'editable' },
  ],
  checks: [
    importsRespectLayers(),
    exportsFromPublicApi('src/features/login/index.ts', 'login', './model/login'),
    fileContains(
      'src/features/login/model/login.ts',
      /from\s*'@\/shared\/lib'/,
      'login берёт validateEmail из общего shared/lib, а не из соседней фичи register'
    ),
  ],
}
