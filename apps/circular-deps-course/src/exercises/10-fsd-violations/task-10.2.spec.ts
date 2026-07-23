import { noRuntimeCycles, type LabSpec } from 'src/engine'

/**
 * Задание 10.2 (среднее) — Ревью: найти и убрать цикл через 3 файла.
 *
 * Слайс `entities/order` разложен на три «рабочих» файла и один readonly-файл
 * «шум» (`lib/currency.ts`, вообще не участвует в цикле). Реальный цикл:
 * `order.ts` → `lib/format.ts` → `model/types.ts` → `order.ts`. Правки требует
 * только один файл — `model/types.ts`: он тянет `createOrder` из `order.ts`
 * лишь ради `typeof`, значит импорт можно сделать типовым.
 */

const orderStart = `import { formatOrder } from '../lib/format'

export function createOrder(id: string, total: number) {
  return { id, total, label: formatOrder(total) }
}
`

const formatStart = `import { CURRENCY_LABEL } from '../model/types'

export function formatOrder(total: number): string {
  return \`\${total} \${CURRENCY_LABEL}\`
}
`

const currencyStart = `export const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$',
  EUR: '€',
}
`

const typesStart = `import { createOrder } from './order'

export const CURRENCY_LABEL = 'USD'

export interface Order {
  id: string
  total: number
}

// TODO: этот импорт нужен только для typeof — разорви цикл
export type OrderFactory = typeof createOrder
`

const typesSolution = `import type { createOrder } from './order'

export const CURRENCY_LABEL = 'USD'

export interface Order {
  id: string
  total: number
}

export type OrderFactory = typeof createOrder
`

const roFiles = [
  { path: 'src/entities/order/model/order.ts', content: orderStart, role: 'readonly' as const },
  { path: 'src/entities/order/lib/format.ts', content: formatStart, role: 'readonly' as const },
  {
    path: 'src/entities/order/lib/currency.ts',
    content: currencyStart,
    role: 'readonly' as const,
  },
]

export const spec: LabSpec = {
  id: '10.2',
  title: 'Задание 10.2 — Ревью: цикл через 3 файла (среднее)',
  aliases: { '@': 'src' },
  files: [
    ...roFiles,
    { path: 'src/entities/order/model/types.ts', content: typesStart, role: 'editable' },
  ],
  solution: [
    ...roFiles,
    { path: 'src/entities/order/model/types.ts', content: typesSolution, role: 'editable' },
  ],
  checks: [noRuntimeCycles()],
}
