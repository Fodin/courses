import {
  fileContains,
  fileExists,
  importIsTypeOnly,
  noRuntimeCycles,
  type LabSpec,
} from 'src/engine'

/**
 * Задание 3.5 (среднее) — Общий types.ts для двух модулей со взаимными типами.
 *
 * `a.ts` и `b.ts` ссылаются друг на друга внутри собственных интерфейсов
 * (`A.partner: B`, `B.partner: A`), но подключают чужой тип обычным импортом —
 * это создаёт рантайм-цикл, хотя в обоих направлениях используется только тип.
 * Симметричная связь — хороший повод вынести оба интерфейса в общий `types.ts`,
 * а не оставлять модули зависимыми друг от друга напрямую.
 */

const aStart = `import { B } from './b'
// TODO: B используется здесь только как тип поля partner

export interface A {
  id: string
  partner: B
}

export const aTag = 'a'

export function describeA(a: A): string {
  return \`\${a.id} (\${aTag})\`
}
`

const aSolution = `import type { A, B } from './types'

export const aTag = 'a'

export function describeA(a: A): string {
  return \`\${a.id} (\${aTag})\`
}
`

const bStart = `import { A } from './a'
// TODO: A используется здесь только как тип поля partner

export interface B {
  id: string
  partner: A
}

export const bTag = 'b'

export function describeB(b: B): string {
  return \`\${b.id} (\${bTag})\`
}
`

const bSolution = `import type { A, B } from './types'

export const bTag = 'b'

export function describeB(b: B): string {
  return \`\${b.id} (\${bTag})\`
}
`

const typesStart = `// TODO: перенесите сюда оба интерфейса A и B (они взаимно ссылаются
// друг на друга через поле partner) — так a.ts и b.ts перестанут импортировать
// друг друга ради типов напрямую
`

const typesSolution = `export interface A {
  id: string
  partner: B
}

export interface B {
  id: string
  partner: A
}
`

export const spec: LabSpec = {
  id: '3.5',
  title: 'Задание 3.5 — Общий types.ts для двух модулей со взаимными типами (среднее)',
  aliases: { '@': 'src' },
  files: [
    { path: 'src/a.ts', content: aStart, role: 'editable' },
    { path: 'src/b.ts', content: bStart, role: 'editable' },
    { path: 'src/types.ts', content: typesStart, role: 'editable' },
  ],
  solution: [
    { path: 'src/a.ts', content: aSolution, role: 'editable' },
    { path: 'src/b.ts', content: bSolution, role: 'editable' },
    { path: 'src/types.ts', content: typesSolution, role: 'editable' },
  ],
  checks: [
    noRuntimeCycles(),
    fileExists('src/types.ts'),
    fileContains('src/types.ts', /export interface A/, '`types.ts` содержит интерфейс `A`'),
    fileContains('src/types.ts', /export interface B/, '`types.ts` содержит интерфейс `B`'),
    importIsTypeOnly(
      'src/a.ts',
      /\.\/types/,
      '`a.ts` подключает типы из `types.ts` через import type'
    ),
    importIsTypeOnly(
      'src/b.ts',
      /\.\/types/,
      '`b.ts` подключает типы из `types.ts` через import type'
    ),
  ],
}
