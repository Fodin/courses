import { noRuntimeCycles, fileContains, type LabSpec } from 'src/engine'

/**
 * Задание 7.1 (простое) — Инверсия зависимости: внедрение через параметр.
 *
 * Дано: cart.ts импортирует applyDiscount из pricing.ts, а pricing.ts зовёт
 * checkout обратно из cart.ts — двусторонний рантайм-цикл на двух файлах.
 * Задача: pricing.ts перестаёт импортировать cart.ts, вместо этого нужная
 * функция передаётся параметром (внедрение зависимости).
 */

const cartStart = `import { applyDiscount } from './pricing'

export interface Item {
  id: string
  price: number
}

export function checkout(items: Item[]): Item[] {
  return applyDiscount(items)
}
`

const pricingStart = `import { checkout } from './cart'

export function applyDiscount(items: { id: string; price: number }[]) {
  return items.map(i => ({ ...i, price: i.price * 0.9 }))
}

// TODO: checkoutWithLog зовёт checkout обратно из cart.ts — это и создаёт цикл.
// Уберите импорт checkout из './cart' и примите его параметром функции.
export function checkoutWithLog(items: { id: string; price: number }[]) {
  console.log('checkout', checkout(items))
}
`

const pricingSolution = `export function applyDiscount(items: { id: string; price: number }[]) {
  return items.map(i => ({ ...i, price: i.price * 0.9 }))
}

export function checkoutWithLog(
  items: { id: string; price: number }[],
  checkout: (items: { id: string; price: number }[]) => { id: string; price: number }[]
) {
  console.log('checkout', checkout(items))
}
`

export const spec: LabSpec = {
  id: '7.1',
  title: 'Задание 7.1 — Инверсия зависимости: внедрение через параметр (простое)',
  aliases: { '@': 'src' },
  files: [
    { path: 'src/cart.ts', content: cartStart, role: 'readonly' },
    { path: 'src/pricing.ts', content: pricingStart, role: 'editable' },
  ],
  solution: [
    { path: 'src/cart.ts', content: cartStart, role: 'readonly' },
    { path: 'src/pricing.ts', content: pricingSolution, role: 'editable' },
  ],
  checks: [
    noRuntimeCycles(),
    fileContains(
      'src/pricing.ts',
      /checkoutWithLog\(\s*items:[\s\S]*?,\s*checkout:\s*\(/,
      '`checkoutWithLog` принимает `checkout` параметром, а не импортирует его'
    ),
  ],
}
