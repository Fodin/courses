import { fileContains, importIsTypeOnly, noRuntimeCycles, type LabSpec } from 'src/engine'

/**
 * Задание 3.3 (сложное) — Разорвать сразу два цикла, не трогая рантайм-рёбра.
 *
 * Пять файлов, два маленьких цикла вокруг общего узла `b.ts`:
 * - `a.ts ⇄ b.ts` — `a.ts` реально использует значение `bValue` (оставить как
 *   есть), а `b.ts` использует `A` только как тип параметра (нужно перевести).
 * - `b.ts ⇄ d.ts` — `b.ts` реально использует значение `dValue` (оставить как
 *   есть), а `d.ts` использует `B` только как тип параметра (нужно перевести).
 * `c.ts` и `e.ts` — сторонние потребители значений `b.ts`/`d.ts`, в циклах не
 * участвуют, их трогать не нужно — они здесь, чтобы показать, что не каждое
 * ребро графа связано с циклом.
 */

const aTs = `import { bValue } from './b'

export interface A {
  id: string
}

export const aValue = 'a:' + bValue
`

const bStart = `import { A } from './a'
import { dValue } from './d'
// TODO: A используется здесь только как тип. dValue — реальная рантайм-зависимость, её трогать не нужно

export interface B {
  tag: string
}

export const bValue = 'b:' + dValue

export function describeA(a: A): string {
  return \`b sees \${a.id}\`
}
`

const bSolution = `import type { A } from './a'
import { dValue } from './d'

export interface B {
  tag: string
}

export const bValue = 'b:' + dValue

export function describeA(a: A): string {
  return \`b sees \${a.id}\`
}
`

const cTs = `import { bValue } from './b'

export const cValue = 'c:' + bValue

export function makeC(): string {
  return cValue
}
`

const dStart = `import { B } from './b'
// TODO: B используется здесь только как тип — переведите импорт в import type

export interface D {
  code: string
}

export const dValue = 'd'

export function describeB(b: B): string {
  return \`d sees \${b.tag}\`
}
`

const dSolution = `import type { B } from './b'

export interface D {
  code: string
}

export const dValue = 'd'

export function describeB(b: B): string {
  return \`d sees \${b.tag}\`
}
`

const eTs = `import { dValue } from './d'

export const eValue = 'e:' + dValue

export function makeE(): string {
  return eValue
}
`

export const spec: LabSpec = {
  id: '3.3',
  title: 'Задание 3.3 — Разорвать сразу два цикла вокруг общего файла (сложное)',
  aliases: { '@': 'src' },
  files: [
    { path: 'src/a.ts', content: aTs, role: 'readonly' },
    { path: 'src/b.ts', content: bStart, role: 'editable' },
    { path: 'src/c.ts', content: cTs, role: 'readonly' },
    { path: 'src/d.ts', content: dStart, role: 'editable' },
    { path: 'src/e.ts', content: eTs, role: 'readonly' },
  ],
  solution: [
    { path: 'src/a.ts', content: aTs, role: 'readonly' },
    { path: 'src/b.ts', content: bSolution, role: 'editable' },
    { path: 'src/c.ts', content: cTs, role: 'readonly' },
    { path: 'src/d.ts', content: dSolution, role: 'editable' },
    { path: 'src/e.ts', content: eTs, role: 'readonly' },
  ],
  checks: [
    noRuntimeCycles(),
    importIsTypeOnly('src/b.ts', /\.\/a/, '`b.ts` импортирует `A` как тип (цикл a ⇄ b разорван)'),
    importIsTypeOnly('src/d.ts', /\.\/b/, '`d.ts` импортирует `B` как тип (цикл b ⇄ d разорван)'),
    fileContains(
      'src/b.ts',
      /import\s*\{\s*dValue\s*\}\s*from\s*'\.\/d'/,
      '`b.ts` по-прежнему импортирует `dValue` как значение — реальная зависимость сохранена'
    ),
  ],
}
