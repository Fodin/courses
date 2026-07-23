import { noRuntimeCycles, fileContains, type LabSpec } from 'src/engine'

/**
 * Задание 12.2 (среднее) — кольцо из трёх пакетов: a → b → c → a.
 *
 * `@repo/a` вызывает значение из `@repo/b`, `@repo/b` — значение из `@repo/c` —
 * обе связи легитимны и должны остаться статическими рантайм-импортами.
 * Замыкает кольцо `@repo/c`, которому `describeA` из `@repo/a` нужен только
 * изредка, для отладочного хелпера — идеальный случай для ленивой загрузки
 * через динамический `import()`, который не создаёт статического ребра в графе.
 */

const aIndex = `import { formatB } from '@repo/b'

export function describeA(id: string): string {
  return 'a:' + formatB(id)
}
`

const bIndex = `import { formatC } from '@repo/c'

export function formatB(id: string): string {
  return 'b(' + formatC(id) + ')'
}
`

const cIndexStart = `import { describeA } from '@repo/a'

// TODO: describeA нужен здесь редко — только для отладочного хелпера
// debugWithA. Замените статический импорт на динамический import() внутри
// функции, чтобы разорвать кольцо @repo/a -> @repo/b -> @repo/c -> @repo/a.
export function formatC(id: string): string {
  return 'c:' + id
}

export async function debugWithA(id: string): Promise<string> {
  return describeA(id)
}
`

const cIndexSolution = `export function formatC(id: string): string {
  return 'c:' + id
}

export async function debugWithA(id: string): Promise<string> {
  const { describeA } = await import('@repo/a')
  return describeA(id)
}
`

export const spec: LabSpec = {
  id: '12.2',
  title: 'Задание 12.2 — Кольцо из трёх пакетов a → b → c → a (среднее)',
  aliases: {
    '@repo/a': 'packages/a/src',
    '@repo/b': 'packages/b/src',
    '@repo/c': 'packages/c/src',
  },
  files: [
    { path: 'packages/a/src/index.ts', content: aIndex, role: 'readonly' },
    { path: 'packages/b/src/index.ts', content: bIndex, role: 'readonly' },
    { path: 'packages/c/src/index.ts', content: cIndexStart, role: 'editable' },
  ],
  solution: [
    { path: 'packages/a/src/index.ts', content: aIndex, role: 'readonly' },
    { path: 'packages/b/src/index.ts', content: bIndex, role: 'readonly' },
    { path: 'packages/c/src/index.ts', content: cIndexSolution, role: 'editable' },
  ],
  checks: [
    noRuntimeCycles(),
    fileContains(
      'packages/c/src/index.ts',
      /await\s+import\(['"]@repo\/a['"]\)/,
      '`debugWithA` загружает `@repo/a` динамически, а не статическим импортом'
    ),
  ],
}
