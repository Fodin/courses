import { importIsTypeOnly, noRuntimeCycles, type LabSpec } from 'src/engine'

/**
 * Задание 3.1 (простое) — Разорвать цикл через `import type`.
 *
 * `b.ts` импортирует `A` из `a.ts` исключительно ради типовой аннотации
 * возвращаемого значения, но делает это обычным (value) импортом. Раз `a.ts`
 * тоже импортирует значение из `b.ts` — граф замыкается в рантайм-цикл. Нужно
 * заменить один импорт на `import type`, ничего больше не трогая.
 */

const aTs = `import { bValue } from './b'

export interface A {
  id: string
}

export const aValue = 'a:' + bValue
`

const bStart = `import { A } from './a'
// TODO: A используется здесь только как тип — замените импорт на \`import type\`

export const bValue = 'b'

export function makeB(): A {
  return { id: bValue }
}
`

const bSolution = `import type { A } from './a'

export const bValue = 'b'

export function makeB(): A {
  return { id: bValue }
}
`

export const spec: LabSpec = {
  id: '3.1',
  title: 'Задание 3.1 — Разорвать цикл через import type (простое)',
  aliases: { '@': 'src' },
  files: [
    { path: 'src/a.ts', content: aTs, role: 'readonly' },
    { path: 'src/b.ts', content: bStart, role: 'editable' },
  ],
  solution: [
    { path: 'src/a.ts', content: aTs, role: 'readonly' },
    { path: 'src/b.ts', content: bSolution, role: 'editable' },
  ],
  checks: [
    noRuntimeCycles(),
    importIsTypeOnly(
      'src/b.ts',
      /\.\/a/,
      '`b.ts` импортирует `A` из `a.ts` как тип (`import type`)'
    ),
  ],
}
