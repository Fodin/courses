import { importIsTypeOnly, noRuntimeCycles, type LabSpec } from 'src/engine'

/**
 * Задание 3.2 (среднее) — Найти типовое ребро в цикле из трёх файлов.
 *
 * Цикл длиннее: `a.ts → c.ts → b.ts → a.ts`. Два ребра из трёх — настоящие
 * значения (`cValue`, `bValue`) и трогать их нельзя. Третье ребро (`b.ts → a.ts`)
 * использует `A` только как тип параметра — именно его нужно найти и перевести
 * в `import type`.
 */

const aTs = `import { cValue } from './c'

export interface A {
  id: string
}

export const aValue = 'a:' + cValue
`

const cTs = `import { bValue } from './b'

export const cValue = 'c:' + bValue

export function makeC(): string {
  return cValue
}
`

const bStart = `import { A } from './a'
// TODO: одно из рёбер цикла a -> c -> b -> a чисто типовое — найдите его

export const bValue = 'b'

export function describe(a: A): string {
  return \`b sees \${a.id}\`
}
`

const bSolution = `import type { A } from './a'

export const bValue = 'b'

export function describe(a: A): string {
  return \`b sees \${a.id}\`
}
`

export const spec: LabSpec = {
  id: '3.2',
  title: 'Задание 3.2 — Найти типовое ребро в цикле из трёх файлов (среднее)',
  aliases: { '@': 'src' },
  files: [
    { path: 'src/a.ts', content: aTs, role: 'readonly' },
    { path: 'src/b.ts', content: bStart, role: 'editable' },
    { path: 'src/c.ts', content: cTs, role: 'readonly' },
  ],
  solution: [
    { path: 'src/a.ts', content: aTs, role: 'readonly' },
    { path: 'src/b.ts', content: bSolution, role: 'editable' },
    { path: 'src/c.ts', content: cTs, role: 'readonly' },
  ],
  checks: [
    noRuntimeCycles(),
    importIsTypeOnly(
      'src/b.ts',
      /\.\/a/,
      'Ребро `b.ts → a.ts` в цикле a → c → b → a переведено в `import type`'
    ),
  ],
}
