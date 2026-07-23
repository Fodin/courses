import { noRuntimeCycles, fileContains, type LabSpec } from 'src/engine'

/**
 * Задание 7.2 (среднее) — Инверсия зависимости в цепочке из трёх модулей.
 *
 * Дано: order.ts → notifier.ts → formatter.ts → order.ts — цикл длиной 3.
 * Задача: formatter.ts перестаёт импортировать order.ts, а нужную функцию
 * логирования принимает параметром; notifier.ts прокидывает её дальше, не
 * импортируя order.ts напрямую (он получает её от order.ts как аргумент).
 */

const orderStart = `import { notifyOrderCreated } from './notifier'

export interface Order {
  id: string
  total: number
}

export function logOrderEvent(message: string): void {
  console.log('[order]', message)
}

export function createOrder(total: number): Order {
  const order: Order = { id: 'o1', total }
  notifyOrderCreated(order)
  return order
}
`

const orderSolution = `import { notifyOrderCreated } from './notifier'

export interface Order {
  id: string
  total: number
}

export function logOrderEvent(message: string): void {
  console.log('[order]', message)
}

export function createOrder(total: number): Order {
  const order: Order = { id: 'o1', total }
  notifyOrderCreated(order, logOrderEvent)
  return order
}
`

const notifierStart = `import { formatOrderSummary } from './formatter'
import type { Order } from './order'

// TODO: notifyOrderCreated должен прокидывать logOrderEvent дальше в
// formatOrderSummary параметром, а не полагаться на импорт внутри formatter.ts.
export function notifyOrderCreated(order: Order): void {
  console.log(formatOrderSummary(order))
}
`

const notifierSolution = `import { formatOrderSummary } from './formatter'
import type { Order } from './order'

export function notifyOrderCreated(
  order: Order,
  logOrderEvent: (message: string) => void
): void {
  console.log(formatOrderSummary(order, logOrderEvent))
}
`

const formatterStart = `import { logOrderEvent } from './order'

export function formatOrderSummary(order: { id: string; total: number }): string {
  const summary = \`Order \${order.id}: $\${order.total}\`
  logOrderEvent(summary)
  return summary
}
`

const formatterSolution = `export function formatOrderSummary(
  order: { id: string; total: number },
  logOrderEvent: (message: string) => void
): string {
  const summary = \`Order \${order.id}: $\${order.total}\`
  logOrderEvent(summary)
  return summary
}
`

export const spec: LabSpec = {
  id: '7.2',
  title: 'Задание 7.2 — Инверсия зависимости в цепочке из трёх модулей (среднее)',
  aliases: { '@': 'src' },
  files: [
    { path: 'src/order.ts', content: orderStart, role: 'editable' },
    { path: 'src/notifier.ts', content: notifierStart, role: 'editable' },
    { path: 'src/formatter.ts', content: formatterStart, role: 'editable' },
  ],
  solution: [
    { path: 'src/order.ts', content: orderSolution, role: 'editable' },
    { path: 'src/notifier.ts', content: notifierSolution, role: 'editable' },
    { path: 'src/formatter.ts', content: formatterSolution, role: 'editable' },
  ],
  checks: [
    noRuntimeCycles(),
    fileContains(
      'src/formatter.ts',
      /formatOrderSummary\(\s*order:[\s\S]*?,\s*logOrderEvent:\s*\(/,
      '`formatOrderSummary` принимает `logOrderEvent` параметром, а не импортирует его из order.ts'
    ),
    fileContains(
      'src/notifier.ts',
      /notifyOrderCreated\(\s*order:[\s\S]*?,\s*logOrderEvent:\s*\(/,
      '`notifyOrderCreated` принимает `logOrderEvent` параметром и прокидывает его дальше'
    ),
  ],
}
