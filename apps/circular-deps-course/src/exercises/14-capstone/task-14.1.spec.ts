import { noRuntimeCycles, type LabSpec } from 'src/engine'

/**
 * Задание 14.1 (простое) — Тема A «Распутать модульный граф».
 *
 * Дано: `order.ts` вызывает `invoiceTotal` из `invoice.ts` (рантайм-импорт),
 * а `invoice.ts` импортирует тип `Order` из `order.ts` обычным (не типовым)
 * импортом — на деле там используется только форма объекта, значение
 * `order.ts` не использует. Это классический типовой цикл, спрятанный под
 * видом рантайм-импорта. Задача: применить ОДИН подходящий приём курса —
 * пометить импорт `Order` как `import type`.
 */

const orderStart = `import { invoiceTotal } from './invoice'

export interface Order {
  id: string
  items: string[]
}

export function summarize(order: Order): string {
  return \`\${order.id}: \${invoiceTotal(order)}\`
}
`

const invoiceStart = `import { Order } from './order'

// TODO: этот файл использует Order только как тип (форму параметра), но
// импортирует его обычным (рантайм) импортом — это и создаёт цикл order.ts
// <-> invoice.ts. Примените один приём курса: сделайте импорт типовым
// (\`import type { Order } from './order'\`).
export function invoiceTotal(order: Order): number {
  return order.items.length * 10
}
`

const invoiceSolution = `import type { Order } from './order'

export function invoiceTotal(order: Order): number {
  return order.items.length * 10
}
`

export const spec: LabSpec = {
  id: '14.1',
  title: 'Задание 14.1 — Распутать модульный граф: один цикл (простое)',
  aliases: { '@': 'src' },
  files: [
    { path: 'src/order.ts', content: orderStart, role: 'readonly' },
    { path: 'src/invoice.ts', content: invoiceStart, role: 'editable' },
  ],
  solution: [
    { path: 'src/order.ts', content: orderStart, role: 'readonly' },
    { path: 'src/invoice.ts', content: invoiceSolution, role: 'editable' },
  ],
  checks: [noRuntimeCycles()],
}
