import { fileContains, noRuntimeCycles, type LabSpec } from 'src/engine'

/**
 * Задание 4.5 (среднее) — два barrel'а (два подпакета) тянут друг друга.
 *
 * `featureA` и `featureB` — соседние независимые фичи, у каждой свой barrel
 * (`index.ts`). Обоим компонентам нужна утилита `formatPrice`, которая на
 * самом деле лежит в общем `shared.ts`. Но по ошибке `featureA/component.ts`
 * берёт её из barrel `featureB`, а `featureB/component.ts` — из barrel
 * `featureA`. Получается цикл через два barrel'а:
 * `A/component → B/index → B/component → A/index → A/component`.
 *
 * Здесь недостаточно просто «импортировать напрямую у соседа» — соседний
 * barrel не должен вообще знать про другую фичу. Правильный приём —
 * реорганизация: обе фичи должны брать `formatPrice` из общего `shared.ts`.
 */

const sharedContent = `export function formatPrice(cents: number): string {
  return '$' + (cents / 100).toFixed(2)
}
`

const featureAIndexContent = `import { getA } from './component'

export { getA }
`

const featureBIndexContent = `import { getB } from './component'

export { getB }
`

const featureAComponentStart = `import { formatPrice } from '../featureB' // TODO: импортируй formatPrice из '../shared', а не из соседнего barrel featureB

export function getA(cents: number): string {
  return 'A:' + formatPrice(cents)
}
`

const featureAComponentSolution = `import { formatPrice } from '../shared'

export function getA(cents: number): string {
  return 'A:' + formatPrice(cents)
}
`

const featureBComponentStart = `import { formatPrice } from '../featureA' // TODO: импортируй formatPrice из '../shared', а не из соседнего barrel featureA

export function getB(cents: number): string {
  return 'B:' + formatPrice(cents)
}
`

const featureBComponentSolution = `import { formatPrice } from '../shared'

export function getB(cents: number): string {
  return 'B:' + formatPrice(cents)
}
`

export const spec: LabSpec = {
  id: '4.5',
  title: 'Задание 4.5 — Два barrel тянут друг друга (среднее)',
  aliases: { '@': 'src' },
  files: [
    { path: 'src/shared.ts', content: sharedContent, role: 'readonly' },
    { path: 'src/featureA/index.ts', content: featureAIndexContent, role: 'readonly' },
    { path: 'src/featureA/component.ts', content: featureAComponentStart, role: 'editable' },
    { path: 'src/featureB/index.ts', content: featureBIndexContent, role: 'readonly' },
    { path: 'src/featureB/component.ts', content: featureBComponentStart, role: 'editable' },
  ],
  solution: [
    { path: 'src/shared.ts', content: sharedContent, role: 'readonly' },
    { path: 'src/featureA/index.ts', content: featureAIndexContent, role: 'readonly' },
    { path: 'src/featureA/component.ts', content: featureAComponentSolution, role: 'editable' },
    { path: 'src/featureB/index.ts', content: featureBIndexContent, role: 'readonly' },
    { path: 'src/featureB/component.ts', content: featureBComponentSolution, role: 'editable' },
  ],
  checks: [
    noRuntimeCycles(),
    fileContains(
      'src/featureA/component.ts',
      /from\s*'\.\.\/shared'/,
      "featureA/component.ts берёт formatPrice из общего '../shared'"
    ),
    fileContains(
      'src/featureB/component.ts',
      /from\s*'\.\.\/shared'/,
      "featureB/component.ts берёт formatPrice из общего '../shared'"
    ),
  ],
}
