import { fileContains, noRuntimeCycles, type LabSpec } from 'src/engine'

/**
 * Задание 4.2 (среднее) — два модуля тянут общую утилиту через barrel.
 *
 * `userService.ts` и `orderService.ts` обоим нужен `formatDate` из
 * `formatUtils.ts`, но вместо прямого импорта они берут его через `./index`.
 * Barrel реэкспортирует оба сервиса — каждый из них замыкается на barrel в
 * свой собственный цикл (`userService → index → userService` и
 * `orderService → index → orderService`).
 */

const indexContent = `import { getUser } from './userService'
import { getOrder } from './orderService'
import { formatDate } from './formatUtils'

export { getUser, getOrder, formatDate }
`

const formatUtilsContent = `export function formatDate(iso: string): string {
  return iso.slice(0, 10)
}
`

const userServiceStart = `import { formatDate } from './index' // TODO: импортируй formatDate напрямую из './formatUtils'

export function getUser(createdAt: string): string {
  return 'user:' + formatDate(createdAt)
}
`

const userServiceSolution = `import { formatDate } from './formatUtils'

export function getUser(createdAt: string): string {
  return 'user:' + formatDate(createdAt)
}
`

const orderServiceStart = `import { formatDate } from './index' // TODO: импортируй formatDate напрямую из './formatUtils'

export function getOrder(createdAt: string): string {
  return 'order:' + formatDate(createdAt)
}
`

const orderServiceSolution = `import { formatDate } from './formatUtils'

export function getOrder(createdAt: string): string {
  return 'order:' + formatDate(createdAt)
}
`

export const spec: LabSpec = {
  id: '4.2',
  title: 'Задание 4.2 — Два сервиса тянут утилиту через barrel (среднее)',
  aliases: { '@': 'src' },
  files: [
    { path: 'src/index.ts', content: indexContent, role: 'readonly' },
    { path: 'src/formatUtils.ts', content: formatUtilsContent, role: 'readonly' },
    { path: 'src/userService.ts', content: userServiceStart, role: 'editable' },
    { path: 'src/orderService.ts', content: orderServiceStart, role: 'editable' },
  ],
  solution: [
    { path: 'src/index.ts', content: indexContent, role: 'readonly' },
    { path: 'src/formatUtils.ts', content: formatUtilsContent, role: 'readonly' },
    { path: 'src/userService.ts', content: userServiceSolution, role: 'editable' },
    { path: 'src/orderService.ts', content: orderServiceSolution, role: 'editable' },
  ],
  checks: [
    noRuntimeCycles(),
    fileContains(
      'src/userService.ts',
      /from\s*'\.\/formatUtils'/,
      "userService.ts импортирует formatDate напрямую из './formatUtils'"
    ),
    fileContains(
      'src/orderService.ts',
      /from\s*'\.\/formatUtils'/,
      "orderService.ts импортирует formatDate напрямую из './formatUtils'"
    ),
  ],
}
