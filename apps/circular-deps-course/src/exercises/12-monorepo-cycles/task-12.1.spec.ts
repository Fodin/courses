import { noRuntimeCycles, importIsTypeOnly, type LabSpec } from 'src/engine'

/**
 * Задание 12.1 (простое) — цикл между двумя пакетами монорепозитория.
 *
 * Пакеты эмулируются каталогами `packages/<pkg>/src/index.ts` и bare-специфаерами
 * `@repo/a` / `@repo/b`, которые резолвятся через `aliases` в путь пакета.
 *
 * `@repo/a` реально использует значение `formatB` из `@repo/b` — это легитимный
 * рантайм-импорт, его трогать не нужно. А вот `@repo/b` импортирует из `@repo/a`
 * только ТИП `A` (используется исключительно как аннотация возвращаемого типа) —
 * это тот самый случай, когда `import type` полностью решает проблему.
 */

const aIndex = `import { formatB } from '@repo/b'

export interface A {
  id: string
}

export function describeA(a: A): string {
  return formatB(a.id)
}
`

const bIndexStart = `import { A } from '@repo/a'

// TODO: пакет @repo/b использует \`A\` только как тип (в сигнатуре makeA),
// значение из @repo/a ему не нужно. Сделайте импорт типовым (\`import type\`),
// чтобы разорвать цикл пакетов @repo/a <-> @repo/b.
export function formatB(id: string): string {
  return 'b:' + id
}

export function makeA(id: string): A {
  return { id }
}
`

const bIndexSolution = `import type { A } from '@repo/a'

export function formatB(id: string): string {
  return 'b:' + id
}

export function makeA(id: string): A {
  return { id }
}
`

export const spec: LabSpec = {
  id: '12.1',
  title: 'Задание 12.1 — Цикл между пакетами a ↔ b (простое)',
  aliases: {
    '@repo/a': 'packages/a/src',
    '@repo/b': 'packages/b/src',
  },
  files: [
    { path: 'packages/a/src/index.ts', content: aIndex, role: 'readonly' },
    { path: 'packages/b/src/index.ts', content: bIndexStart, role: 'editable' },
  ],
  solution: [
    { path: 'packages/a/src/index.ts', content: aIndex, role: 'readonly' },
    { path: 'packages/b/src/index.ts', content: bIndexSolution, role: 'editable' },
  ],
  checks: [
    noRuntimeCycles(),
    importIsTypeOnly(
      'packages/b/src/index.ts',
      /@repo\/a/,
      'Импорт `@repo/a` в `packages/b/src/index.ts` помечен как типовой'
    ),
  ],
}
