import { fileContains, importIsTypeOnly, noRuntimeCycles, type LabSpec } from 'src/engine'

/**
 * Задание 14.3 (сложное) — Тема A «Распутать модульный граф».
 *
 * Дано: 6 модулей с ДВУМЯ переплетёнными циклами через общий узел
 * `invoice.ts`:
 *  - цикл 1: `order.ts` <-> `invoice.ts` — `invoice.ts` импортирует тип
 *    `Order` обычным (рантайм) импортом, хотя использует его только как тип;
 *  - цикл 2: `invoice.ts` <-> `payment.ts` — оба модуля равноправно зависят
 *    от общей логики форматирования суммы (`formatMoney`), сейчас она
 *    продублирована обменом импортами между ними.
 *
 * Задача: применить КОМБИНАЦИЮ приёмов —
 *  1) сделать импорт `Order` в `invoice.ts` типовым (`import type`);
 *  2) вынести `formatMoney` в третий модуль `format.ts` (пока пустая
 *     заготовка) и завести на него однонаправленные зависимости.
 */

const orderFile = `import { invoiceStatus } from './invoice'

export interface Order {
  id: string
  amount: number
}

export function summarizeOrder(order: Order): string {
  return \`\${order.id}: \${invoiceStatus(order.id)}\`
}
`

const customerFile = `import { summarizeOrder, type Order } from './order'
import { computeInvoiceTotal } from './invoice'

export function printCustomerInvoice(order: Order): string {
  return \`\${summarizeOrder(order)} total=\${computeInvoiceTotal(order)}\`
}
`

const constantsFile = `export const APP_NAME = 'capstone-shop'
`

const formatStart = `// TODO: заготовка третьего модуля. Вынесите сюда formatMoney — сейчас эта
// логика продублирована обменом импортами между invoice.ts и payment.ts,
// что и создаёт второй цикл.
export {}
`

const formatSolution = `export function formatMoney(amount: number): string {
  return \`$\${amount.toFixed(2)}\`
}
`

const invoiceStart = `import { Order } from './order'
import { chargeAmount } from './payment'

export function invoiceStatus(orderId: string): string {
  return \`invoice for \${orderId}\`
}

export function formatMoney(amount: number): string {
  return \`$\${amount.toFixed(2)}\`
}

// TODO: два приёма сразу нужны в этом файле:
// 1) импорт Order используется только как тип — сделайте его \`import type\`
//    (это разрывает цикл 1: order.ts <-> invoice.ts);
// 2) formatMoney продублирован с payment.ts — перенесите его в format.ts
//    (третий модуль) и удалите объявление отсюда (разрывает цикл 2:
//    invoice.ts <-> payment.ts). payment.ts должен брать formatMoney из
//    format.ts, а не из invoice.ts.
export function computeInvoiceTotal(order: Order): number {
  return chargeAmount(order.amount)
}
`

const invoiceSolution = `import type { Order } from './order'
import { chargeAmount } from './payment'

export function invoiceStatus(orderId: string): string {
  return \`invoice for \${orderId}\`
}

export function computeInvoiceTotal(order: Order): number {
  return chargeAmount(order.amount)
}
`

const paymentStart = `import { formatMoney } from './invoice'

export function chargeAmount(amount: number): number {
  console.log('charge:', formatMoney(amount))
  return amount
}
`

const paymentSolution = `import { formatMoney } from './format'

export function chargeAmount(amount: number): number {
  console.log('charge:', formatMoney(amount))
  return amount
}
`

export const spec: LabSpec = {
  id: '14.3',
  title: 'Задание 14.3 — Распутать модульный граф: два переплетённых цикла (сложное)',
  aliases: { '@': 'src' },
  files: [
    { path: 'src/order.ts', content: orderFile, role: 'readonly' },
    { path: 'src/customer.ts', content: customerFile, role: 'readonly' },
    { path: 'src/constants.ts', content: constantsFile, role: 'readonly' },
    { path: 'src/format.ts', content: formatStart, role: 'editable' },
    { path: 'src/invoice.ts', content: invoiceStart, role: 'editable' },
    { path: 'src/payment.ts', content: paymentStart, role: 'editable' },
  ],
  solution: [
    { path: 'src/order.ts', content: orderFile, role: 'readonly' },
    { path: 'src/customer.ts', content: customerFile, role: 'readonly' },
    { path: 'src/constants.ts', content: constantsFile, role: 'readonly' },
    { path: 'src/format.ts', content: formatSolution, role: 'editable' },
    { path: 'src/invoice.ts', content: invoiceSolution, role: 'editable' },
    { path: 'src/payment.ts', content: paymentSolution, role: 'editable' },
  ],
  checks: [
    noRuntimeCycles(),
    importIsTypeOnly(
      'src/invoice.ts',
      /\.\/order/,
      '`invoice.ts` импортирует `Order` как тип (`import type`)'
    ),
    fileContains('src/format.ts', /formatMoney/, '`format.ts` содержит `formatMoney`'),
    fileContains(
      'src/payment.ts',
      /from '\.\/format'/,
      '`payment.ts` берёт `formatMoney` из третьего модуля `./format`, а не из `invoice.ts`'
    ),
  ],
}
