import {
  fileContains,
  fileExists,
  importIsTypeOnly,
  noRuntimeCycles,
  type LabSpec,
} from 'src/engine'

/**
 * Задание 3.6 (сложное) — Распутать смешанный модуль на types и runtime.
 *
 * `shop.ts` и `cart.ts` — классическая «свалка»: каждый экспортирует и тип
 * (`Product`, `CartItem`), и рантайм-код, и оба импортируют чужой тип обычным
 * импортом. При этом `cart.ts` реально вызывает `applyTax` из `shop.ts` — это
 * настоящая рантайм-зависимость, её нельзя трогать. Нужно вынести оба типа в
 * общий `types.ts`, оставив в `shop.ts`/`cart.ts` только рантайм-код и
 * корректные (типовые либо значимые) импорты. `receipt.ts` — сторонний
 * потребитель, показывающий целевой стиль импортов; менять его не нужно.
 */

const shopStart = `import { CartItem } from './cart'
// TODO: CartItem используется здесь только как тип параметра. Вынесите Product
// и CartItem в общий './types' и импортируйте CartItem оттуда как import type

export interface Product {
  id: string
  price: number
}

export const TAX_RATE = 0.2

export function applyTax(price: number): number {
  return price * (1 + TAX_RATE)
}

export function priceProductInCart(item: CartItem): number {
  return applyTax(item.product.price * item.qty)
}
`

const shopSolution = `import type { CartItem } from './types'

export const TAX_RATE = 0.2

export function applyTax(price: number): number {
  return price * (1 + TAX_RATE)
}

export function priceProductInCart(item: CartItem): number {
  return applyTax(item.product.price * item.qty)
}
`

const cartStart = `import { Product } from './shop'
import { applyTax } from './shop'
// TODO: Product используется здесь только как тип поля. applyTax — реальная
// рантайм-зависимость, её нужно оставить. Вынесите Product и CartItem в общий
// './types' и импортируйте Product/CartItem оттуда как import type

export interface CartItem {
  product: Product
  qty: number
}

export const DEFAULT_CURRENCY = 'USD'

export function summarize(items: CartItem[]): string {
  const total = items.reduce((sum, item) => sum + applyTax(item.product.price * item.qty), 0)
  return \`\${total.toFixed(2)} \${DEFAULT_CURRENCY}\`
}
`

const cartSolution = `import type { CartItem } from './types'
import { applyTax } from './shop'

export const DEFAULT_CURRENCY = 'USD'

export function summarize(items: CartItem[]): string {
  const total = items.reduce((sum, item) => sum + applyTax(item.product.price * item.qty), 0)
  return \`\${total.toFixed(2)} \${DEFAULT_CURRENCY}\`
}
`

const typesStart = `// TODO: перенесите сюда интерфейсы Product (из shop.ts) и CartItem (из cart.ts) —
// они нужны и shop.ts, и cart.ts, и receipt.ts, только как типы
`

const typesSolution = `export interface Product {
  id: string
  price: number
}

export interface CartItem {
  product: Product
  qty: number
}
`

const receiptTs = `import type { Product, CartItem } from './types'
import { summarize } from './cart'

export function printReceipt(items: CartItem[]): string {
  return summarize(items)
}

export function describeProduct(p: Product): string {
  return \`\${p.id}: $\${p.price.toFixed(2)}\`
}
`

export const spec: LabSpec = {
  id: '3.6',
  title: 'Задание 3.6 — Распутать смешанный модуль на types и runtime (сложное)',
  aliases: { '@': 'src' },
  files: [
    { path: 'src/shop.ts', content: shopStart, role: 'editable' },
    { path: 'src/cart.ts', content: cartStart, role: 'editable' },
    { path: 'src/types.ts', content: typesStart, role: 'editable' },
    { path: 'src/receipt.ts', content: receiptTs, role: 'readonly' },
  ],
  solution: [
    { path: 'src/shop.ts', content: shopSolution, role: 'editable' },
    { path: 'src/cart.ts', content: cartSolution, role: 'editable' },
    { path: 'src/types.ts', content: typesSolution, role: 'editable' },
    { path: 'src/receipt.ts', content: receiptTs, role: 'readonly' },
  ],
  checks: [
    noRuntimeCycles(),
    fileExists('src/types.ts'),
    fileContains(
      'src/types.ts',
      /export interface Product/,
      '`types.ts` содержит интерфейс `Product`'
    ),
    fileContains(
      'src/types.ts',
      /export interface CartItem/,
      '`types.ts` содержит интерфейс `CartItem`'
    ),
    importIsTypeOnly(
      'src/shop.ts',
      /\.\/types/,
      '`shop.ts` импортирует `CartItem` из `types.ts` как тип'
    ),
    importIsTypeOnly(
      'src/cart.ts',
      /\.\/types/,
      '`cart.ts` импортирует `CartItem` из `types.ts` как тип'
    ),
    fileContains(
      'src/cart.ts',
      /import\s*\{\s*applyTax\s*\}\s*from\s*'\.\/shop'/,
      '`cart.ts` по-прежнему импортирует `applyTax` как значение — реальная зависимость сохранена'
    ),
  ],
}
