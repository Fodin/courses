import { noRuntimeCycles, importIsTypeOnly, fileContains, type LabSpec } from 'src/engine'

/**
 * Задание 12.3 (сложное) — два пакета в цикле со смешанными (тип/значение)
 * зависимостями.
 *
 * `@repo/b` (readonly) реально вызывает значение `AHelper` из `@repo/a` — это
 * настоящий рантайм-импорт, оставить как есть. А вот `@repo/a` импортирует из
 * `@repo/b` СМЕШАННЫЙ клоз `{ BHelper, type BShape }`: `BShape` используется
 * как тип, а `BHelper` — импортирован, но нигде не вызывается (мёртвый
 * рантайм-импорт, оставшийся после рефакторинга). Задача — разобраться, какая
 * часть импорта реально нужна в рантайме, убрать неиспользуемое значение и
 * оставить чистый `import type`, сохранив корректный рантайм в обе стороны.
 */

const aIndexStart = `import { BHelper, type BShape } from '@repo/b'

export interface AShape {
  id: string
}

export function AHelper(): string {
  return 'a-value'
}

// TODO: BHelper импортирован, но нигде не используется — реально нужен только
// тип BShape (см. сигнатуру ниже). Уберите неиспользуемое значение и
// оставьте чистый \`import type\`, чтобы разорвать цикл @repo/a <-> @repo/b,
// не потеряв рантайм-связь, которая реально нужна пакету @repo/b.
export function describeShape(shape: BShape): string {
  return 'shape:' + shape.id
}
`

const aIndexSolution = `import type { BShape } from '@repo/b'

export interface AShape {
  id: string
}

export function AHelper(): string {
  return 'a-value'
}

export function describeShape(shape: BShape): string {
  return 'shape:' + shape.id
}
`

const bIndex = `import { AHelper, type AShape } from '@repo/a'

export interface BShape {
  id: string
}

export function makeA(): AShape {
  return { id: AHelper() }
}

export function BHelper(): string {
  return 'b-value'
}
`

export const spec: LabSpec = {
  id: '12.3',
  title: 'Задание 12.3 — Смешанные тип/значение зависимости в цикле пакетов (сложное)',
  aliases: {
    '@repo/a': 'packages/a/src',
    '@repo/b': 'packages/b/src',
  },
  files: [
    { path: 'packages/a/src/index.ts', content: aIndexStart, role: 'editable' },
    { path: 'packages/b/src/index.ts', content: bIndex, role: 'readonly' },
  ],
  solution: [
    { path: 'packages/a/src/index.ts', content: aIndexSolution, role: 'editable' },
    { path: 'packages/b/src/index.ts', content: bIndex, role: 'readonly' },
  ],
  checks: [
    noRuntimeCycles(),
    importIsTypeOnly(
      'packages/a/src/index.ts',
      /@repo\/b/,
      'Импорт `@repo/b` в `packages/a/src/index.ts` целиком типовой'
    ),
    fileContains(
      'packages/a/src/index.ts',
      /^(?:(?!BHelper).)*$/s,
      'Неиспользуемое значение `BHelper` больше не импортируется в `@repo/a`'
    ),
  ],
}
