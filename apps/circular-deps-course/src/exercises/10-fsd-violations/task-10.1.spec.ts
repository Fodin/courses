import { noRuntimeCycles, type LabSpec } from 'src/engine'

/**
 * Задание 10.1 (простое) — Ревью: найти и убрать цикл.
 *
 * Слайс `entities/user` разбит на два файла сегмента `model`. Один рантайм-цикл
 * спрятан внутри: `types.ts` импортирует значение из `user.ts`, а `user.ts`
 * импортирует тип из `types.ts` обычным (не типовым) импортом.
 */

const typesStart = `import { userValue } from './user'

export interface UserTypes {
  id: string
}

export const typesValue = 'types:' + userValue
`

const userStart = `import { UserTypes } from './types'

export const userValue = 'user'

// TODO: этот импорт используется только как тип — разорви цикл
export function makeUser(): UserTypes {
  return { id: userValue }
}
`

const userSolution = `import type { UserTypes } from './types'

export const userValue = 'user'

export function makeUser(): UserTypes {
  return { id: userValue }
}
`

const roFiles = [
  { path: 'src/entities/user/model/types.ts', content: typesStart, role: 'readonly' as const },
]

export const spec: LabSpec = {
  id: '10.1',
  title: 'Задание 10.1 — Ревью: найти и убрать цикл (простое)',
  aliases: { '@': 'src' },
  files: [
    ...roFiles,
    { path: 'src/entities/user/model/user.ts', content: userStart, role: 'editable' },
  ],
  solution: [
    ...roFiles,
    { path: 'src/entities/user/model/user.ts', content: userSolution, role: 'editable' },
  ],
  checks: [noRuntimeCycles()],
}
